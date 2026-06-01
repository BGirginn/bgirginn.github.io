(function () {
    const storage = {
        get(key) {
            try {
                return localStorage.getItem(key);
            } catch {
                return null;
            }
        },
        set(key, value) {
            try {
                localStorage.setItem(key, value);
            } catch {
                return undefined;
            }
        }
    };

    const root = document.documentElement;
    const navToggle = document.getElementById("navToggle");
    const navMenu = document.getElementById("navMenu");
    const themeToggle = document.getElementById("themeToggle");
    const langToggle = document.getElementById("langToggle");
    const year = document.getElementById("year");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function applyTheme(theme) {
        root.setAttribute("data-theme", theme);
        storage.set("theme", theme);
        if (themeToggle) {
            themeToggle.setAttribute("aria-label", "Switch cream theme variant");
        }
    }

    function initTheme() {
        const saved = storage.get("theme");
        applyTheme(saved === "dark" || saved === "light" ? saved : "light");
    }

    function translate(lang) {
        root.setAttribute("lang", lang);
        storage.set("language", lang);
        document.querySelectorAll("[data-en][data-tr]").forEach((node) => {
            node.textContent = node.getAttribute(lang === "tr" ? "data-tr" : "data-en");
        });
        if (langToggle) {
            langToggle.textContent = lang === "tr" ? "EN" : "TR";
        }
    }

    function initNav() {
        if (!navToggle || !navMenu) return;

        navToggle.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");
            navToggle.setAttribute("aria-expanded", String(isOpen));
        });

        navMenu.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => {
                navMenu.classList.remove("active");
                navToggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    function initSectionNav() {
        const links = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
        const sections = links
            .map((link) => document.querySelector(link.getAttribute("href")))
            .filter(Boolean);

        if (links.length === 0 || sections.length === 0 || !("IntersectionObserver" in window)) return;

        const setActive = (id) => {
            links.forEach((link) => {
                link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
            });
        };

        const observer = new IntersectionObserver((entries) => {
            const visible = entries
                .filter((entry) => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
            if (visible?.target?.id) setActive(visible.target.id);
        }, { rootMargin: "-35% 0px -52% 0px", threshold: [0.12, 0.24, 0.4] });

        sections.forEach((section) => observer.observe(section));
    }

    function initReveal() {
        const targets = document.querySelectorAll(".reveal");
        if (targets.length === 0) return;

        if (reduceMotion || !("IntersectionObserver" in window)) {
            targets.forEach((target) => target.classList.add("is-visible"));
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.14, rootMargin: "0px 0px -50px 0px" });

        targets.forEach((target) => observer.observe(target));
    }

    function initScrollEffects() {
        const progress = document.querySelector(".scroll-progress span");

        function updateScrollState() {
            const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const ratio = Math.min(1, Math.max(0, window.scrollY / max));
            root.style.setProperty("--scroll-progress", ratio.toFixed(4));
            root.style.setProperty("--hero-lift", `${(-34 * ratio).toFixed(2)}px`);
            root.style.setProperty("--atmosphere-shift", `${(80 * ratio).toFixed(2)}px`);
            root.style.setProperty("--scroll-cue-opacity", Math.max(0, 1 - ratio * 9).toFixed(3));
            if (progress) {
                progress.style.transform = `scaleX(${ratio})`;
            }
        }

        updateScrollState();
        window.addEventListener("scroll", updateScrollState, { passive: true });
        window.addEventListener("resize", updateScrollState);
    }

    function initAccordions() {
        document.querySelectorAll(".accordion-item").forEach((item, index) => {
            const header = item.querySelector(".accordion-header");
            const content = item.querySelector(".accordion-content");
            if (!header || !content) return;

            const contentId = content.id || `accordion-content-${index}`;
            content.id = contentId;
            header.setAttribute("aria-controls", contentId);
            header.setAttribute("aria-expanded", item.classList.contains("open") ? "true" : "false");

            if (item.classList.contains("open")) {
                content.style.height = "auto";
                content.style.opacity = "1";
            }

            header.addEventListener("click", () => {
                const isOpen = item.classList.contains("open");
                document.querySelectorAll(".accordion-item.open").forEach((openItem) => {
                    if (openItem === item) return;
                    closeAccordion(openItem);
                });
                isOpen ? closeAccordion(item) : openAccordion(item);
            });
        });
    }

    function openAccordion(item) {
        const header = item.querySelector(".accordion-header");
        const content = item.querySelector(".accordion-content");
        if (!content) return;

        item.classList.add("open");
        if (header) header.setAttribute("aria-expanded", "true");

        if (reduceMotion) {
            content.style.height = "auto";
            content.style.opacity = "1";
            return;
        }

        content.style.height = `${content.scrollHeight}px`;
        content.style.opacity = "1";
        window.setTimeout(() => {
            if (item.classList.contains("open")) {
                content.style.height = "auto";
            }
        }, 240);
    }

    function closeAccordion(item) {
        const header = item.querySelector(".accordion-header");
        const content = item.querySelector(".accordion-content");
        if (!content) return;

        if (!reduceMotion) {
            content.style.height = `${content.scrollHeight}px`;
            content.offsetHeight;
        }

        item.classList.remove("open");
        if (header) header.setAttribute("aria-expanded", "false");
        content.style.height = "0";
        content.style.opacity = "0";
    }

    function initGalleryModal() {
        const modal = document.getElementById("pcbModal");
        if (!modal) return;

        const title = document.getElementById("modalTitle");
        const closeButtons = modal.querySelectorAll("[data-close-modal]");
        const tabs = modal.querySelectorAll(".modal-tab");
        const panels = modal.querySelectorAll(".modal-panel");
        let previousFocus = null;

        function openModal(boardName) {
            previousFocus = document.activeElement;
            if (title) title.textContent = boardName;
            modal.hidden = false;
            document.body.style.overflow = "hidden";
            const close = modal.querySelector(".modal-close");
            if (close) close.focus();
        }

        function closeModal() {
            modal.hidden = true;
            document.body.style.overflow = "";
            if (previousFocus && previousFocus.focus) previousFocus.focus();
        }

        document.querySelectorAll(".gallery-item").forEach((item) => {
            item.setAttribute("tabindex", "0");
            item.setAttribute("role", "button");
            item.addEventListener("click", () => openModal(item.querySelector("h3")?.textContent || "PCB Details"));
            item.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    item.click();
                }
            });
        });

        closeButtons.forEach((button) => button.addEventListener("click", closeModal));
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !modal.hidden) closeModal();
        });

        tabs.forEach((tab) => {
            tab.addEventListener("click", () => {
                const target = tab.dataset.tab;
                tabs.forEach((node) => {
                    const active = node.dataset.tab === target;
                    node.classList.toggle("active", active);
                    node.setAttribute("aria-selected", String(active));
                });
                panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.panel === target));
            });
        });
    }

    function initHeroScene() {
        const canvas = document.getElementById("heroScene");
        if (!canvas) return null;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return null;

        let width = 0;
        let height = 0;
        let frame = 0;
        const pointer = { x: 0, y: 0 };

        function cssVar(name) {
            return getComputedStyle(root).getPropertyValue(name).trim();
        }

        function lerpPoint(a, b, t) {
            return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
        }

        function boardPoint(corners, u, v) {
            const top = lerpPoint(corners[0], corners[1], u);
            const bottom = lerpPoint(corners[3], corners[2], u);
            return lerpPoint(top, bottom, v);
        }

        function poly(points, fill, stroke) {
            ctx.beginPath();
            points.forEach((point, index) => {
                if (index === 0) ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            });
            ctx.closePath();
            if (fill) {
                ctx.fillStyle = fill;
                ctx.fill();
            }
            if (stroke) {
                ctx.strokeStyle = stroke;
                ctx.stroke();
            }
        }

        function drawTrace(corners, points, color, widthValue) {
            ctx.beginPath();
            points.forEach(([u, v], index) => {
                const point = boardPoint(corners, u, v);
                if (index === 0) ctx.moveTo(point.x, point.y);
                else ctx.lineTo(point.x, point.y);
            });
            ctx.strokeStyle = color;
            ctx.lineWidth = widthValue;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.stroke();
        }

        function drawChip(corners, u, v, size, label, phase) {
            const center = boardPoint(corners, u, v);
            const tiltX = size * 1.24;
            const tiltY = size * 0.44;
            const depth = size * 0.22;
            const body = [
                { x: center.x - tiltX, y: center.y - tiltY },
                { x: center.x + tiltX, y: center.y - tiltY * 0.58 },
                { x: center.x + tiltX * 0.9, y: center.y + tiltY },
                { x: center.x - tiltX * 1.08, y: center.y + tiltY * 0.58 }
            ];
            const side = body.map((point) => ({ x: point.x + depth, y: point.y + depth * 1.25 }));

            poly([body[3], body[2], side[2], side[3]], "rgba(83, 58, 18, 0.84)", "rgba(217, 169, 75, 0.32)");
            const chipGradient = ctx.createLinearGradient(body[0].x, body[0].y, body[2].x, body[2].y);
            chipGradient.addColorStop(0, "rgba(250, 236, 199, 0.98)");
            chipGradient.addColorStop(0.48, "rgba(101, 70, 21, 0.96)");
            chipGradient.addColorStop(1, "rgba(219, 188, 119, 0.98)");
            poly(body, chipGradient, "rgba(201, 209, 200, 0.32)");

            ctx.save();
            ctx.shadowColor = cssVar("--green");
            ctx.shadowBlur = 18 + Math.sin(phase) * 5;
            ctx.strokeStyle = "rgba(229, 201, 137, 0.50)";
            ctx.lineWidth = 1;
            ctx.strokeRect(center.x - size * 0.8, center.y - size * 0.34, size * 1.45, size * 0.62);
            ctx.restore();

            ctx.fillStyle = "rgba(229, 201, 137, 0.88)";
            for (let i = 0; i < 9; i += 1) {
                const p = i / 8;
                const left = lerpPoint(body[0], body[3], p);
                const right = lerpPoint(body[1], body[2], p);
                ctx.fillRect(left.x - 7, left.y - 1, 10, 2);
                ctx.fillRect(right.x - 2, right.y - 1, 10, 2);
            }

            ctx.fillStyle = "rgba(255, 249, 232, 0.82)";
            ctx.font = `${Math.max(10, size * 0.18)}px "IBM Plex Mono", monospace`;
            ctx.fillText(label, center.x - size * 0.58, center.y + size * 0.05);
        }

        function resize() {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            width = Math.max(1, rect.width);
            height = Math.max(1, rect.height);
            canvas.width = Math.floor(width * dpr);
            canvas.height = Math.floor(height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            draw(performance.now());
        }

        function draw(time) {
            const theme = root.getAttribute("data-theme") || "light";
            const isLight = theme !== "dark";
            const phase = time / 900;
            const px = pointer.x * 18;
            const py = pointer.y * 12;
            const scrollRatio = Number.parseFloat(getComputedStyle(root).getPropertyValue("--scroll-progress")) || 0;
            const scrollLift = scrollRatio * height * 0.18;

            ctx.clearRect(0, 0, width, height);

            const bg = ctx.createLinearGradient(0, 0, width, height);
            bg.addColorStop(0, isLight ? "rgba(251, 243, 228, 0.97)" : "rgba(246, 234, 209, 0.97)");
            bg.addColorStop(0.42, isLight ? "rgba(243, 228, 199, 0.94)" : "rgba(236, 216, 177, 0.94)");
            bg.addColorStop(1, isLight ? "rgba(255, 250, 239, 0.98)" : "rgba(250, 241, 224, 0.98)");
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, width, height);

            ctx.save();
            ctx.globalAlpha = isLight ? 0.22 : 0.28;
            ctx.strokeStyle = isLight ? "rgba(95, 69, 27, 0.12)" : "rgba(95, 69, 27, 0.13)";
            ctx.lineWidth = 1;
            for (let x = -80 + px * 0.3; x < width + 120; x += 42) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x - height * 0.16, height);
                ctx.stroke();
            }
            for (let y = 4 + py * 0.25; y < height + 80; y += 42) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(width, y + width * 0.12);
                ctx.stroke();
            }
            ctx.restore();

            const corners = [
                { x: width * 0.20 + px * 0.8, y: height * 0.22 + py - scrollLift },
                { x: width * 1.06 + px * 0.8, y: height * 0.36 + py - scrollLift },
                { x: width * 0.78 + px * 0.8, y: height * 0.98 + py - scrollLift },
                { x: width * -0.11 + px * 0.8, y: height * 0.79 + py - scrollLift }
            ];
            const depth = 58;
            const side = corners.map((point) => ({ x: point.x + depth, y: point.y + depth * 1.18 }));

            ctx.save();
            ctx.shadowColor = isLight ? "rgba(143, 101, 15, 0.18)" : "rgba(143, 101, 15, 0.20)";
            ctx.shadowBlur = isLight ? 34 : 40;
            poly([corners[3], corners[2], side[2], side[3]], isLight ? "rgba(167, 140, 91, 0.28)" : "rgba(154, 122, 67, 0.32)", "rgba(167, 120, 27, 0.24)");
            const boardGradient = ctx.createLinearGradient(corners[0].x, corners[0].y, corners[2].x, corners[2].y);
            boardGradient.addColorStop(0, isLight ? "rgba(255, 249, 235, 0.96)" : "rgba(255, 244, 222, 0.94)");
            boardGradient.addColorStop(0.35, isLight ? "rgba(238, 221, 186, 0.96)" : "rgba(229, 204, 159, 0.94)");
            boardGradient.addColorStop(0.68, isLight ? "rgba(218, 197, 155, 0.92)" : "rgba(214, 187, 138, 0.92)");
            boardGradient.addColorStop(1, isLight ? "rgba(247, 235, 207, 0.94)" : "rgba(244, 228, 195, 0.94)");
            poly(corners, boardGradient, isLight ? "rgba(143, 101, 15, 0.24)" : "rgba(143, 101, 15, 0.26)");
            ctx.restore();

            ctx.save();
            ctx.globalCompositeOperation = "overlay";
            ctx.globalAlpha = isLight ? 0.18 : 0.22;
            const wafer = boardPoint(corners, 0.68, 0.44);
            ctx.beginPath();
            ctx.ellipse(wafer.x, wafer.y, width * 0.19, height * 0.105, 0.22, 0, Math.PI * 2);
            const waferGradient = ctx.createRadialGradient(wafer.x - 30, wafer.y - 24, 12, wafer.x, wafer.y, width * 0.22);
            waferGradient.addColorStop(0, isLight ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.18)");
            waferGradient.addColorStop(0.46, isLight ? "rgba(110,95,69,.32)" : "rgba(180,160,116,.14)");
            waferGradient.addColorStop(1, "rgba(0,0,0,.26)");
            ctx.fillStyle = waferGradient;
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = isLight ? 0.34 : 0.46;
            ctx.strokeStyle = isLight ? "rgba(95, 69, 27, 0.16)" : "rgba(246, 222, 168, 0.20)";
            ctx.lineWidth = 1;
            for (let u = 0.08; u <= 0.94; u += 0.08) {
                const a = boardPoint(corners, u, 0.07);
                const b = boardPoint(corners, u, 0.93);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
            for (let v = 0.1; v <= 0.88; v += 0.08) {
                const a = boardPoint(corners, 0.04, v);
                const b = boardPoint(corners, 0.96, v);
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                ctx.stroke();
            }
            ctx.restore();

            const traceColor = isLight ? "rgba(143, 101, 15, 0.62)" : "rgba(143, 101, 15, 0.66)";
            const amber = isLight ? "rgba(47, 111, 120, 0.34)" : "rgba(47, 111, 120, 0.32)";
            drawTrace(corners, [[0.11, 0.22], [0.34, 0.23], [0.39, 0.33], [0.62, 0.35], [0.76, 0.45]], traceColor, 2.2);
            drawTrace(corners, [[0.08, 0.52], [0.25, 0.50], [0.31, 0.61], [0.55, 0.62], [0.68, 0.74]], amber, 1.8);
            drawTrace(corners, [[0.52, 0.12], [0.56, 0.28], [0.74, 0.31], [0.84, 0.38], [0.93, 0.38]], traceColor, 1.6);
            drawTrace(corners, [[0.16, 0.79], [0.28, 0.72], [0.44, 0.76], [0.56, 0.69], [0.82, 0.73]], amber, 1.7);

            drawChip(corners, 0.43, 0.47, Math.min(width, height) * 0.115, "BG-ATELIER", phase);
            drawChip(corners, 0.74, 0.25, Math.min(width, height) * 0.058, "RF", phase + 1.2);
            drawChip(corners, 0.25, 0.66, Math.min(width, height) * 0.07, "PWR", phase + 2.1);

            ctx.save();
            ctx.globalCompositeOperation = "screen";
            const glow = ctx.createRadialGradient(width * 0.72 + px, height * 0.34 + py, 0, width * 0.72 + px, height * 0.34 + py, width * 0.36);
            glow.addColorStop(0, isLight ? "rgba(143, 101, 15, 0.10)" : "rgba(143, 101, 15, 0.11)");
            glow.addColorStop(0.38, isLight ? "rgba(47, 111, 120, 0.05)" : "rgba(47, 111, 120, 0.05)");
            glow.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();

            ctx.save();
            ctx.globalAlpha = isLight ? 0.10 : 0.14;
            ctx.fillStyle = isLight ? "#07120d" : "#ffffff";
            for (let i = 0; i < 220; i += 1) {
                const x = (Math.sin(i * 49.21) * 0.5 + 0.5) * width;
                const y = (Math.sin(i * 71.37) * 0.5 + 0.5) * height;
                ctx.fillRect(x, y, 1, 1);
            }
            ctx.restore();

        }

        function loop(time) {
            draw(time);
            if (!reduceMotion) frame = requestAnimationFrame(loop);
        }

        function handlePointer(event) {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
            pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        }

        resize();
        window.addEventListener("resize", resize);
        window.addEventListener("mousemove", handlePointer, { passive: true });
        if (!reduceMotion) frame = requestAnimationFrame(loop);

        return {
            redraw: () => draw(performance.now()),
            destroy: () => {
                cancelAnimationFrame(frame);
                window.removeEventListener("resize", resize);
                window.removeEventListener("mousemove", handlePointer);
            }
        };
    }

    initTheme();
    translate(storage.get("language") === "tr" ? "tr" : "en");
    initNav();
    initSectionNav();
    initScrollEffects();
    const heroScene = initHeroScene();

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            applyTheme(root.getAttribute("data-theme") === "light" ? "dark" : "light");
            heroScene?.redraw();
        });
    }

    if (langToggle) {
        langToggle.addEventListener("click", () => {
            translate(root.getAttribute("lang") === "tr" ? "en" : "tr");
        });
    }

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    document.addEventListener("DOMContentLoaded", () => {
        initReveal();
        initAccordions();
        initGalleryModal();
        heroScene?.redraw();
    });
})();
