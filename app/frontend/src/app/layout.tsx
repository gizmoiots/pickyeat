import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "pickyeat — scan, pick, eat",
  description:
    "Order what you'll actually love. Snap any menu, get picks tuned to your taste.",
  manifest: "/manifest.json",
  metadataBase: new URL("https://pickyeat.com"),
  openGraph: {
    title: "pickyeat — order what you'll actually love",
    description:
      "Scan any restaurant menu, tell us your mood. We surface the three dishes you'll love most.",
    url: "https://pickyeat.com",
    siteName: "pickyeat",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "pickyeat",
    description: "Order what you'll actually love.",
    images: ["/og.png"]
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icon-192.svg"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F26B3A"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}
