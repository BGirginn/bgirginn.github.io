import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { NavigationFocus } from "@/components/ui/NavigationFocus";
import {
  business,
  publicEmail,
  ventureEmail,
  verifiedProfiles,
} from "@/content/business";

const siteUrl = business.websiteUrl;
const displayFont = localFont({
  src: "../../public/fonts/ChakraPetch-SemiBold.ttf",
  variable: "--font-display",
  weight: "600",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${business.displayName} | Quadropod & Industrial LoRa`,
  description: business.venture.context,
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: `${business.displayName} | Quadropod & Industrial LoRa`,
    description: business.venture.context,
    url: siteUrl,
    siteName: business.displayName,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${business.displayName} — Quadropod and Industrial LoRa Platform`,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${business.displayName} | Quadropod & Industrial LoRa`,
    description: business.venture.context,
    images: ["/og-image.png"],
  },
  keywords: [
    "Embedded Systems Engineer",
    "PCB Designer",
    "Firmware Developer",
    "Embedded Firmware",
    "Independent Engineering Venture",
    "Quadropod V0",
    "Robotics Product Development",
    "Electronics Engineer",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080c11",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: business.founder.name,
  url: siteUrl,
  email: publicEmail,
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: publicEmail,
      contactType: "general inquiries",
    },
    {
      "@type": "ContactPoint",
      email: ventureEmail,
      contactType: "venture inquiries",
    },
  ],
  sameAs: verifiedProfiles.map((profile) => profile.value),
  knowsAbout: [
    "Embedded Systems",
    "PCB Design",
    "Firmware Development",
    "Electronics Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={displayFont.variable}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <NavigationFocus />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        {process.env.VERCEL ? <Analytics /> : null}
        {process.env.VERCEL ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
