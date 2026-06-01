Harika. O zaman bunu gerçekten bir ürün dokümanı gibi yazacağız.

Bu cevapta **Part 1** olacak:

# MASTER WEBSITE SPECIFICATION

## bgirgin.dev

### Version 1.0

### Part 1 — Product Vision, Brand Identity & Design System

---

# 1. Executive Summary

## Proje Tanımı

bgirgin.dev, gömülü sistemler, PCB tasarımı ve firmware geliştirme alanında çalışan Bora Girgin'in teknik uzmanlığını modern ve premium bir mühendislik markası olarak sunan tek sayfalık bir web sitesidir.

Bu site geleneksel bir portföy sitesi değildir.

Amaç:

```text
İş bulmak
+
Teknik güven oluşturmak
+
Kişisel marka inşa etmek
+
Mühendislik kalitesini göstermek
```

---

## Temel Fark

Çoğu mühendislik sitesi:

```text
CV benzeri
Blog benzeri
LinkedIn uzantısı
```

gibidir.

Bu proje ise:

```text
Engineering Brand Website
```

olarak konumlandırılır.

Kullanıcı siteye girdiğinde:

> Bu kişi yalnızca PCB tasarlamıyor.
> Donanım, firmware ve sistem mimarisini birlikte düşünüyor.

hissini almalıdır.

---

# 2. Business Goals

## Birincil Hedef

Potansiyel müşteri veya işverenin:

```text
10 saniye içinde
```

şunları anlaması:

```text
Kim?
Ne yapıyor?
Neden iyi?
```

---

## İkincil Hedef

Teknik meslektaşların:

```text
Bu kişi gerçekten mühendis.
```

diyebilmesi.

---

## Üçüncül Hedef

LinkedIn paylaşımı veya yönlendirmesi sonrası:

```text
Premium izlenim
```

oluşturmak.

---

# 3. Target Audience

## Persona 01 — Hiring Manager

Yaş:

```text
30-50
```

Aradığı:

```text
Güvenilir mühendis
```

İlgilendiği:

```text
Projeler
Sorumluluklar
Sonuçlar
```

---

## Persona 02 — Technical Lead

İlgilendiği:

```text
PCB
Firmware
RTOS
Architecture
```

İlk baktığı:

```text
Selected Work
Capabilities
```

---

## Persona 03 — Recruiter

İlk baktığı:

```text
Hero
About
CV
```

Detaya inmez.

---

# 4. Brand Identity

## İsim

```text
Bora Girgin
```

---

## Wordmark

```text
BG.
```

Nokta:

```text
Gold Accent
```

---

## Tagline

```text
Embedded Systems & PCB Design
```

---

## Marka Karakteri

### Olmalı

```text
Technical
Reliable
Premium
Minimal
Precise
```

---

### Olmamalı

```text
Cyberpunk
Startup Hype
Gamer
Crypto
Sci-fi
```

---

# 5. Brand Voice

## Yazım Dili

Kısa.

Teknik.

Doğrudan.

---

## Kaçınılacaklar

```text
Passionate
Rockstar
Ninja
Guru
Disruptive
Revolutionary
```

---

## Tercih Edilecekler

```text
Reliable
System-level
Embedded
Hardware
Firmware
Engineering
```

---

# 6. Design Philosophy

Bu site:

```text
Apple
+
Modern Industrial Design
+
Engineering Precision
```

karışımıdır.

---

## Tasarım İlkeleri

### 1

Az ama kaliteli içerik.

---

### 2

Büyük boşluklar.

---

### 3

Az renk.

---

### 4

Az ama etkili motion.

---

### 5

Bir tane büyük WOW anı.

---

# 7. Visual Identity

## Genel Hava

```text
Dark
Premium
Industrial
Technical
```

---

## Işık Kullanımı

Soft.

Diffused.

Keskin glow yok.

---

## Kontrast

Yüksek.

Ancak göz yormayan.

---

# 8. Design Tokens

## Colors

### Background

```css
--color-bg: #0A0F14;
--color-surface: #131A23;
--color-surface-2: #1A2430;
```

---

### Text

```css
--color-text: #F5F7FA;
--color-muted: #A7B1BC;
--color-subtle: #4A5568;
```

---

### Premium

```css
--color-gold: #C9A96E;
--color-gold-light: #E3C48A;
```

---

### Technology

```css
--color-blue: #4F7DF3;
--color-blue-light: #77B6FF;
```

---

### State

```css
--color-border: rgba(255,255,255,0.06);
--color-hover: rgba(201,169,110,0.08);
```

---

# 9. Color Usage Rules

## Beyaz

Kullanım:

```text
Başlıklar
Ana metin
CTA
```

---

## Gold

Kullanım:

```text
Section label
Divider
Hover
Navigation state
Progress indicator
```

---

## Blue

Kullanım:

```text
Signal flow
PCB trace
Technical indicators
```

---

## Yasak

Gold:

```text
Uzun paragraf
Hero başlık
Büyük yüzey
```

---

# 10. Typography

## Font

Kesin karar:

```text
Geist
```

---

## Neden

```text
Modern
Technical
Readable
Minimal
```

---

## Display

```css
clamp(64px, 8vw, 120px)
```

---

## H1

```css
clamp(40px, 5vw, 72px)
```

---

## H2

```css
clamp(28px, 3vw, 48px)
```

---

## Body

```css
clamp(16px, 1.2vw, 18px)
```

---

## Label

```css
11px
uppercase
letter-spacing: 0.12em
```

---

# 11. Spacing System

Grid:

```text
8px
```

---

Scale:

```css
8
16
24
32
48
64
96
128
192
256
```

---

## Bölüm Aralıkları

Desktop:

```text
192-256px
```

---

Mobile:

```text
96-128px
```

---

# 12. Layout System

## Container

```css
max-width: 1280px
```

---

## Grid

```text
12 column
```

---

## Responsive

```text
Mobile  < 480
Tablet  < 768
Desktop < 1024
Wide    > 1440
```

---

# 13. Motion Philosophy

Motion:

```text
Mechanical
Controlled
Intentional
```

---

Olmamalı:

```text
Playful
Bouncy
Gaming
```

---

## Motion Budget

Sayfa başına:

```text
1 signature animation

3 major reveal sequences

max 2 sürekli animasyon
```

---

# 14. Signature Experience

Bu sitenin kimliği:

```text
PCB Layer Separation
+
Signal Flow
```

---

Amaç:

```text
Hardware
Firmware
System Thinking
```

ilişkisini göstermek.

---

Bu sahne:

```text
Sitenin merkezidir.
```

Diğer tüm motionlar bu sahneyi desteklemek için vardır.
