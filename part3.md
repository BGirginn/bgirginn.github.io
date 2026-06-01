# MASTER WEBSITE SPECIFICATION

## bgirgin.dev

### Version 1.0

### Part 3 — Technical Architecture, Performance, Accessibility, SEO, Deployment & Development Process

---

# 33. Technical Architecture Philosophy

Bu proje:

```text
Motion-first
değil
```

```text
Content-first
+
Performance-first
+
Motion-enhanced
```

olarak geliştirilmelidir.

Öncelik sırası:

```text
1. İçerik

2. Kullanılabilirlik

3. Performans

4. Accessibility

5. Motion

6. Görsel efektler
```

Eğer herhangi bir noktada:

```text
Motion
```

ile

```text
Performance
```

çatışırsa:

```text
Performance kazanır.
```

---

# 34. Final Technology Stack

## Core

```text
Next.js 15
App Router
TypeScript
```

---

## Styling

```text
Tailwind CSS v4
```

---

## Typography

```text
Geist
next/font
```

---

## Motion

```text
GSAP
ScrollTrigger
@gsap/react
```

---

## Smooth Scroll

```text
Lenis
```

Desktop + Tablet only.

---

## 3D

```text
Three.js
React Three Fiber
Drei
```

---

## Forms

```text
React Hook Form
Zod
```

---

## Email

```text
Resend
```

---

## Rate Limiting

```text
Upstash Redis
```

---

## Analytics

```text
Vercel Analytics
Vercel Speed Insights
```

---

## Deployment

```text
Vercel
```

---

# 35. Folder Architecture

```text
src/

app/
components/
hooks/
lib/
content/
styles/

public/
```

---

## app/

Routing.

```text
layout.tsx
page.tsx
api/contact/route.ts
```

---

## components/

UI.

---

### sections/

```text
Hero
Signature
Work
Process
Capabilities
About
Contact
```

---

### ui/

```text
Button
Container
SectionLabel
ProgressIndicator
FormField
```

---

### three/

```text
PCBScene
PCBModel
LayerSeparation
SignalFlow
```

---

# 36. Content Architecture

Content UI içine gömülmez.

---

Yanlış:

```tsx
<h1>Embedded Systems</h1>
```

---

Doğru:

```ts
content/site.ts

hero.title
hero.description
```

---

Sebep:

```text
maintainability
future localization
future CMS
```

---

# 37. GSAP Architecture

## Tek Kural

GSAP dışında hiçbir motion sistemi olmayacak.

---

Kullanılmayacak:

```text
Framer Motion
```

---

## useGSAP

Her component:

```tsx
useGSAP(() => {})
```

kullanır.

---

## Plugin Registration

Tek dosyada:

```ts
lib/gsap.ts
```

---

Register:

```ts
ScrollTrigger
```

---

# 38. ScrollTrigger Rules

Kullanım alanları:

```text
Hero Exit

Signature Scene

Timeline

Section Reveal

Progress Indicator
```

---

Kullanılmayacak:

```text
hover

button animation

input animation
```

---

# 39. Motion Budget

Site genelinde:

## Signature Scene

1 adet

---

## Major Reveal

Maksimum:

```text
3
```

---

## Continuous Animation

Maksimum:

```text
2
```

---

Sürekli çalışanlar:

```text
PCB Float

Signal Pulse
```

---

Yeni sürekli animasyon eklenemez.

---

# 40. Lenis Strategy

Desktop:

```text
Açık
```

---

Tablet:

```text
Açık
```

---

Mobile:

```text
Kapalı
```

---

Sebep:

```text
Battery

Performance

Native feel
```

---

# 41. Three.js Architecture

## Hero Scene

Amaç:

```text
Ambience
```

---

İçerik:

```text
Floating PCB
```

---

## Signature Scene

Amaç:

```text
Storytelling
```

---

İçerik:

```text
Layer Separation

Signal Flow
```

---

Hero Scene:

```text
WOW değil
```

---

Signature Scene:

```text
WOW
```

---

# 42. Camera System

## Hero

```text
Fixed camera
```

---

## Signature

Camera değişebilir.

Başlangıç:

```text
[0,0,8]
```

---

Yakınlaşma:

```text
[0,0,4]
```

---

FOV:

```text
45
```

---

# 43. Lighting System

Ambient:

```text
0.3
```

---

Directional:

```text
1.2
```

---

Signal Light:

```text
Blue
```

---

Power Accent:

```text
Gold
```

---

# 44. 3D Asset Pipeline

Akış:

```text
KiCad

↓

STEP

↓

Blender

↓

Optimization

↓

GLB

↓

Draco Compression

↓

Deployment
```

---

# 45. Model Budget

Hero GLB:

```text
Target < 2MB
```

---

Absolute Max:

```text
3MB
```

---

Texture:

```text
1024
```

maksimum.

---

# 46. WebGL Detection

Başlangıçta:

```ts
WebGL.isWebGLAvailable()
```

---

False ise:

```text
Render Image
```

---

Gösterilir.

---

# 47. Mobile Strategy

Desktop ve mobile aynı değildir.

---

## Desktop

Tam deneyim.

---

## Mobile

Reduced experience.

---

Kullanılacak:

```text
Render

Image

WebM
```

---

Kullanılmayacak:

```text
Layer Separation Scroll

Complex Parallax

Pinned 300vh Scene
```

---

# 48. Loading Strategy

Boş ekran:

```text
yasak
```

---

İlk görünen:

```text
Hero Text
```

---

Sonra:

```text
PCB Render
```

---

En son:

```text
GLB
```

---

Fade:

```text
Render → GLB
```

---

# 49. Loading Screen

Background:

```text
Dark Navy
```

---

Animasyon:

```text
PCB Trace SVG
```

---

Text:

```text
Initializing Systems...
```

---

# 50. Image Strategy

Format:

```text
WebP
```

---

Hero:

```text
priority
```

---

Diğerleri:

```text
lazy
```

---

# 51. Contact Form Architecture

Frontend:

```text
React Hook Form
```

---

Validation:

```text
Zod
```

---

Backend:

```text
API Route
```

---

Email:

```text
Resend
```

---

# 52. Validation Rules

Name:

```text
2-100
```

---

Email:

```text
valid email
```

---

Message:

```text
10-2000
```

---

# 53. Rate Limiting

IP başına:

```text
3 request
```

---

Süre:

```text
1 saat
```

---

Araç:

```text
Upstash Redis
```

---

# 54. Security Requirements

Form:

```text
server validation
```

zorunlu.

---

Client validation:

```text
yeterli değil
```

---

API:

```text
sanitize input
```

---

# 55. Accessibility Requirements

Minimum hedef:

```text
WCAG AA
```

---

# 56. Reduced Motion

Support:

```text
prefers-reduced-motion
```

---

Kapatılacak:

```text
Lenis

Signal Flow

Layer Separation

Floating

Parallax
```

---

Kalacak:

```text
Fade
```

---

# 57. Keyboard Navigation

Tüm site:

```text
tab ile kullanılabilir
```

---

Focus State:

```text
visible
```

---

Asla:

```css
outline:none
```

değil.

---

# 58. Semantic HTML

Kullanılacak:

```html
header
nav
main
section
footer
button
form
```

---

# 59. SEO Strategy

Metadata:

```text
Title

Description

Canonical
```

---

Open Graph:

```text
zorunlu
```

---

Twitter Card:

```text
zorunlu
```

---

# 60. OG Image

Boyut:

```text
1200x630
```

---

İçerik:

```text
PCB Render

Bora Girgin

Embedded Systems & PCB Design
```

---

# 61. Structured Data

Schema:

```text
Person
```

---

Opsiyonel:

```text
WebSite
```

---

# 62. Sitemap

Üretilmeli.

---

# 63. Robots

Index:

```text
true
```

---

# 64. Analytics

Araç:

```text
Vercel Analytics
```

---

Amaç:

```text
Traffic
```

---

# 65. Speed Monitoring

Araç:

```text
Vercel Speed Insights
```

---

Amaç:

```text
Core Web Vitals
```

---

# 66. Performance Budgets

LCP:

```text
< 2.5s
```

---

CLS:

```text
< 0.05
```

---

INP:

```text
< 200ms
```

---

FCP:

```text
< 1.2s
```

---

# 67. Bundle Strategy

GSAP:

```text
dynamic import
```

---

Three.js:

```text
dynamic import
```

---

İlk yükleme:

```text
minimum JS
```

---

# 68. CV Strategy

Dosya:

```text
/public/cv.pdf
```

---

URL:

```text
bgirgin.dev/cv.pdf
```

---

Google Drive:

```text
yasak
```

---

# 69. Analytics Events

Takip:

```text
CTA Click

Contact Submit

CV Download

Project View
```

---

# 70. Deployment Strategy

Platform:

```text
Vercel
```

---

Environment Variables:

```text
RESEND_API_KEY

UPSTASH_URL

UPSTASH_TOKEN
```

---

# 71. Testing Checklist

Desktop:

```text
Chrome

Safari

Firefox
```

---

Mobile:

```text
iOS Safari

Android Chrome
```

---

# 72. Accessibility Checklist

Test:

```text
Keyboard

Screen Reader

Reduced Motion
```

---

# 73. Performance Checklist

Test:

```text
Lighthouse

WebPageTest
```

---

# 74. WebGL Checklist

Test:

```text
WebGL disabled
```

---

Fallback çalışmalı.

---

# 75. Development Phases

## Faz 0

Asset Preparation

---

## Faz 1

Content

---

## Faz 2

Static Site

---

## Faz 3

Motion

---

## Faz 4

3D

---

## Faz 5

Polish

---

## Faz 6

Launch
