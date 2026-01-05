/**
 * Hero Mesh Gradient - Stripe-style WebGL Effect
 * Premium animated gradient background for hero section
 * 
 * Features:
 * - Smooth color blending with WebGL
 * - Reduced motion support
 * - Performance optimized (pauses when hidden)
 */

class MeshGradient {
    constructor(canvas) {
        this.canvas = canvas;
        this.gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        if (!this.gl) {
            console.warn('WebGL not supported, falling back to CSS gradient');
            this.useFallback();
            return;
        }

        this.time = 0;
        this.animating = true;
        this.colors = [
            [0.035, 0.039, 0.067],  // Dark blue-black
            [0.376, 0.647, 0.980],  // Primary blue (#60a5fa)
            [0.133, 0.827, 0.933],  // Cyan accent (#22d3ee)
            [0.655, 0.545, 0.980],  // Purple (#a78bfa)
        ];

        this.init();
        this.setupVisibilityHandling();
        this.animate();
    }

    init() {
        const gl = this.gl;

        // Vertex shader
        const vsSource = `
            attribute vec2 a_position;
            varying vec2 v_uv;
            void main() {
                v_uv = a_position * 0.5 + 0.5;
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `;

        // Fragment shader - animated gradient
        const fsSource = `
            precision mediump float;
            varying vec2 v_uv;
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform vec3 u_color1;
            uniform vec3 u_color2;
            uniform vec3 u_color3;
            uniform vec3 u_color4;

            // Simplex noise function for smooth variation
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                                   -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy));
                vec2 x0 = v -   i + dot(i, C.xx);
                vec2 i1;
                i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                    + i.x + vec3(0.0, i1.x, 1.0));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
                    dot(x12.zw,x12.zw)), 0.0);
                m = m*m;
                m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                vec2 uv = v_uv;
                float aspect = u_resolution.x / u_resolution.y;
                uv.x *= aspect;
                
                // Animated noise layers
                float t = u_time * 0.15;
                float n1 = snoise(uv * 1.5 + vec2(t * 0.3, t * 0.2)) * 0.5 + 0.5;
                float n2 = snoise(uv * 2.0 + vec2(-t * 0.2, t * 0.1)) * 0.5 + 0.5;
                float n3 = snoise(uv * 0.8 + vec2(t * 0.1, -t * 0.15)) * 0.5 + 0.5;
                
                // Blend colors with noise
                vec3 color = mix(u_color1, u_color2, n1);
                color = mix(color, u_color3, n2 * 0.6);
                color = mix(color, u_color4, n3 * 0.4);
                
                // Add subtle glow in center
                float centerGlow = 1.0 - length(v_uv - 0.5) * 1.2;
                centerGlow = max(0.0, centerGlow);
                color += u_color2 * centerGlow * 0.15;
                
                // Slight vignette
                float vignette = 1.0 - length(v_uv - 0.5) * 0.5;
                color *= vignette;
                
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        // Compile shaders
        const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
        const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

        this.program = gl.createProgram();
        gl.attachShader(this.program, vs);
        gl.attachShader(this.program, fs);
        gl.linkProgram(this.program);

        if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
            console.error('Shader program failed:', gl.getProgramInfoLog(this.program));
            this.useFallback();
            return;
        }

        gl.useProgram(this.program);

        // Create fullscreen quad
        const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(this.program, 'a_position');
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        // Get uniform locations
        this.uniforms = {
            time: gl.getUniformLocation(this.program, 'u_time'),
            resolution: gl.getUniformLocation(this.program, 'u_resolution'),
            color1: gl.getUniformLocation(this.program, 'u_color1'),
            color2: gl.getUniformLocation(this.program, 'u_color2'),
            color3: gl.getUniformLocation(this.program, 'u_color3'),
            color4: gl.getUniformLocation(this.program, 'u_color4'),
        };

        // Set initial colors
        gl.uniform3fv(this.uniforms.color1, this.colors[0]);
        gl.uniform3fv(this.uniforms.color2, this.colors[1]);
        gl.uniform3fv(this.uniforms.color3, this.colors[2]);
        gl.uniform3fv(this.uniforms.color4, this.colors[3]);

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    compileShader(type, source) {
        const gl = this.gl;
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compile error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    resize() {
        const dpr = Math.min(window.devicePixelRatio, 2);
        this.canvas.width = this.canvas.offsetWidth * dpr;
        this.canvas.height = this.canvas.offsetHeight * dpr;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.uniform2f(this.uniforms.resolution, this.canvas.width, this.canvas.height);
    }

    setupVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            this.animating = !document.hidden;
            if (this.animating) this.animate();
        });
    }

    animate() {
        if (!this.animating || !this.gl) return;

        this.time += 0.016; // ~60fps
        this.gl.uniform1f(this.uniforms.time, this.time);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(() => this.animate());
    }

    useFallback() {
        // CSS gradient fallback
        this.canvas.style.background = `
            radial-gradient(ellipse at 30% 20%, rgba(96, 165, 250, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(167, 139, 250, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(34, 211, 238, 0.15) 0%, transparent 40%),
            linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
        `;
    }

    destroy() {
        this.animating = false;
        if (this.gl) {
            this.gl.getExtension('WEBGL_lose_context')?.loseContext();
        }
    }
}

// Initialize hero mesh
(function () {
    const REDUCE_MOTION = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const canvas = document.getElementById('heroMesh');

    if (!canvas) return;

    if (REDUCE_MOTION) {
        // Static gradient for reduced motion
        canvas.style.background = `
            radial-gradient(ellipse at 30% 20%, rgba(96, 165, 250, 0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 60%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
            linear-gradient(180deg, #0a0a0a 0%, #050505 100%)
        `;
    } else {
        new MeshGradient(canvas);
    }
})();
