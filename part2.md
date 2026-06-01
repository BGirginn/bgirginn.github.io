# MASTER WEBSITE SPECIFICATION

## bgirgin.dev

### Version 1.0

### Part 2 — Information Architecture, Sections, Navigation & User Experience

---

# 15. Information Architecture

Bu site bir portfolio değildir.

Bu site bir:

```text
Engineering Brand Experience
```

olarak tasarlanacaktır.

---

## Kullanıcının Yolculuğu

Siteye giriş:

```text
Hero
↓
Merak
↓
Signature Scene
↓
Yetkinlik Kanıtı
↓
Projeler
↓
Nasıl Çalışıyor?
↓
Yetenekler
↓
Kim?
↓
İletişim
```

---

## Psikolojik Akış

### Hero

Soru:

```text
Bu kişi ne yapıyor?
```

---

### Signature

Soru:

```text
Gerçekten biliyor mu?
```

---

### Selected Work

Soru:

```text
Neler yaptı?
```

---

### Process

Soru:

```text
Nasıl düşünüyor?
```

---

### Capabilities

Soru:

```text
Hangi teknolojilerde güçlü?
```

---

### About

Soru:

```text
Bu kişiyle çalışmak mantıklı mı?
```

---

### Contact

Soru:

```text
Nasıl ulaşırım?
```

---

# 16. Global Layout Rules

Her section:

```text
minimum 100vh
```

olmalıdır.

---

## Section Width

```css
max-width: 1280px
```

---

## İç Grid

```text
12 kolon
```

---

## Hero Hariç

Tüm section'larda:

```text
sol taraf
=
metin

sağ taraf
=
görsel veya teknik içerik
```

yaklaşımı kullanılmalıdır.

---

# 17. Hero Section

## Amaç

İlk 5 saniyede:

```text
Kim?
Ne yapıyor?
```

sorularını cevaplamak.

---

## Layout

Desktop:

```text
┌─────────────────────────────┐
│                             │
│ Headline      3D PCB        │
│                             │
│ Subheadline                │
│                             │
│ CTA CTA                    │
│                             │
└─────────────────────────────┘
```

---

## Headline

```text
Embedded Systems
&
PCB Design
```

---

## Subheadline

```text
Hardware, firmware and
system-level engineering
for reliable electronic products.
```

---

## CTA

Primary:

```text
View Selected Work
```

---

Secondary:

```text
Get In Touch
```

---

## Hero Motion

Sürekli çalışan animasyonlar:

### Floating PCB

Amplitude:

```text
4px
```

Period:

```text
6 saniye
```

---

### Light Sweep

Gold çizgi.

Her:

```text
8 saniye
```

tekrar eder.

---

### Signal Pulse

Çok düşük opacity.

Sürekli dikkat çekmez.

---

# 18. Hero Scroll Exit

Kullanıcı scroll yapınca:

Headline:

```text
opacity 1 → 0
```

---

PCB:

```text
merkeze gelir
```

---

Background:

```text
daha koyu hale gelir
```

---

Bu geçiş Signature Section'a bağlanır.

---

# 19. Signature Section

Bu bölüm:

```text
Site'nin merkezi
```

olarak tasarlanır.

---

## Toplam Uzunluk

```text
300vh
```

---

## Pin Başlangıcı

Hero bittikten sonra:

```text
position pin
```

başlar.

---

# Scroll Timeline

## 0%

PCB merkeze hareket eder.

---

## 20%

PCB tamamen ortalanır.

---

## 40%

Kamera yaklaşır.

Öne çıkanlar:

```text
STM32
Power Section
Sensor Interface
```

---

## 60%

Layer Separation başlar.

---

## 75%

Katmanlar tamamen ayrılır.

```text
Top Layer
Inner Layer 1
Inner Layer 2
Bottom Layer
```

---

## 85%

Signal Flow başlar.

```text
MCU
 ↓
Sensor
 ↓
Communication
 ↓
Output
```

---

## 95%

Teknik etiketler gelir.

```text
Power Integrity

Signal Routing

Firmware Interfaces

Testing
```

---

## 100%

Section unpin olur.

Selected Work görünmeye başlar.

---

# 20. Signature Motion Rules

Burada:

```text
Gold = Power
```

---

```text
Blue = Data / Signal
```

---

Bu kural tüm site boyunca korunur.

---

# 21. Mobile Signature Version

Mobilde:

```text
300vh pin
YOK
```

---

Yerine:

```text
Static PCB Render

↓

Short Explanation

↓

WebM Animation

↓

Technical Labels
```

---

WebM:

```html
autoplay
muted
playsinline
loop
```

---

Fallback:

```text
Static Render
```

---

# 22. Selected Work

Bu bölüm:

```text
kanıt bölümü
```

dür.

---

## Maksimum Proje Sayısı

```text
3
```

---

## Neden

Fazla proje:

```text
kaliteyi düşürür
```

---

## Kart Yapısı

Her kart:

```text
Section Label

Project Name

Summary

Role

Stack

Outcome

CTA
```

---

# Kart Tasarımı

Örnek:

```text
01 FEATURED PROJECT

Industrial Sensor Board

Multi-layer industrial controller
designed for harsh environments.

Role
Schematic · PCB · Firmware

Stack
STM32 · CAN · FreeRTOS

Outcome
Prototype-ready controller

View Project →
```

---

# Hover Davranışı

### Görsel

```text
scale 1.00 → 1.03
```

---

### Border

Gold çizgi belirir.

---

### CTA

Hafif translate.

---

# 23. Engineering Process

Amaç:

```text
Nasıl düşündüğünü göstermek
```

---

Timeline:

```text
Requirements

↓

Architecture

↓

Schematic

↓

PCB Layout

↓

Firmware

↓

Prototype

↓

Testing

↓

Iteration
```

---

# Motion

Çizgi:

```text
scroll ile dolar
```

---

Node:

```text
gold active state
```

---

Signal:

```text
blue pulse
```

---

# 24. Capabilities

Amaç:

```text
Teknoloji listesi göstermek
```

---

Kategori 1

```text
Embedded Firmware
```

---

Kategori 2

```text
PCB Design
```

---

Kategori 3

```text
Communication
```

---

Kategori 4

```text
Testing
```

---

Kategori 5

```text
Tools
```

---

## Hover

Minimal.

Sadece:

```text
gold underline

veya

subtle glow
```

---

Kartlaşma:

```text
minimum
```

---

# 25. About

Amaç:

```text
İnsan tarafını göstermek
```

---

Ama:

```text
kişisel hikaye sitesi
değil
```

---

Uzunluk:

```text
2-3 paragraf
```

---

İçerik:

```text
Engineering philosophy

System thinking

Reliability
```

---

Fotoğraf:

Opsiyonel.

---

Varsa:

```text
karanlık ton

çalışma ortamı

mühendislik hissi
```

---

# 26. Contact

Son CTA.

---

Başlık:

```text
Let's build reliable
electronic systems.
```

---

Form:

```text
Name

Email

Message
```

---

Button:

```text
Send Message
```

---

Başarı Durumu

```text
✓ Message sent.
```

---

Hata Durumu

```text
Something went wrong.
Try again.
```

---

# 27. Footer

Minimal.

---

İçerik:

```text
Bora Girgin

Embedded Systems & PCB Design
```

---

Linkler:

```text
GitHub

LinkedIn

Email

CV
```

---

Copyright:

```text
© Bora Girgin
```

---

# 28. Navigation System

## Desktop

Sticky Header

---

Sol:

```text
BG.
```

---

Sağ:

```text
Work

Process

Capabilities

About

Contact
```

---

# Scroll Behaviour

Tıklama:

```text
smooth scroll
```

---

Aktif section:

```text
gold state
```

---

# 29. Progress Indicator

Desktop only.

---

Konum:

```text
sağ kenar
```

---

Örnek:

```text
● 01

○ 02

○ 03

○ 04

○ 05
```

---

Aktif:

```text
gold
```

---

Pasif:

```text
muted
```

---

# 30. Mobile Navigation

Header:

```text
BG.
        ☰
```

---

Açılınca:

```text
fullscreen overlay
```

---

Arkaplan:

```text
#0A0F14
```

---

Linkler:

```text
Work

Process

Capabilities

About

Contact
```

---

Büyük tipografi.

---

# 31. Section Transition System

Tüm geçişler:

```text
dark overlap
+
opacity fade
```

---

Sert geçiş:

```text
yasak
```

---

Video wipe:

```text
yasak
```

---

Aşırı blur:

```text
yasak
```

---

# 32. Content Rules

Tüm site boyunca:

### Yap

```text
kısa metin

yüksek kalite

somut bilgi
```

---

### Yapma

```text
uzun hikayeler

marketing dili

buzzword
```
