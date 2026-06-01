import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const siteUrl = "https://bgirgin.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Bora Girgin | Embedded Systems & PCB Design",
  description:
    "Hardware, firmware and system-level engineering for reliable electronic products.",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "Bora Girgin | Embedded Systems & PCB Design",
    description:
      "Hardware, firmware and system-level engineering for reliable electronic products.",
    url: siteUrl,
    siteName: "bgirgin.dev",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "PCB render with Bora Girgin embedded systems and PCB design text",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bora Girgin | Embedded Systems & PCB Design",
    description:
      "Hardware, firmware and system-level engineering for reliable electronic products.",
    images: ["/og-image.svg"],
  },
  keywords: [
    "Embedded Systems Engineer",
    "PCB Designer",
    "Firmware Developer",
    "Embedded Firmware",
    "Electronics Engineer",
  ],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0A0F14",
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Bora Girgin",
  url: siteUrl,
  jobTitle: "Embedded Systems & PCB Design Engineer",
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
    <html lang="en">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {process.env.VERCEL ? <Analytics /> : null}
        {process.env.VERCEL ? <SpeedInsights /> : null}
      </body>
    </html>
  );
}
