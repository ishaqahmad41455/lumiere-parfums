import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Toaster } from "sonner";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumiere-parfums.com"),
  title: {
    default: "Lumière Parfums | Rare Luxury Fragrance",
    template: "%s | Lumière Parfums",
  },
  description:
    "Discover rare, hand-finished perfumes from Lumière Parfums — immersive 3D fragrance discovery, luxury bottles, and signature scents for men and women.",
  keywords: ["luxury perfume", "niche fragrance", "eau de parfum", "designer perfume"],
  openGraph: {
    title: "Lumière Parfums",
    description: "Rare compositions. Hand-finished bottles. Fragrance as art.",
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`} suppressHydrationWarning>
      <body>
        <LoadingScreen />
        <CustomCursor />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CartDrawer />
        <Toaster position="bottom-center" theme="dark" />
      </body>
    </html>
  );
}
