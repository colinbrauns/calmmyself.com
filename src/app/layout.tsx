import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import { MotionPreferencesProvider } from "@/components/MotionPreferences";

export const metadata: Metadata = {
  title: "CalmMyself — Free Calm & Anxiety Relief Tools",
  description:
    "Free, evidence-based tools for anxiety relief, stress management, and nervous system regulation. Breathing exercises, grounding techniques, guided visualizations, and more. No signup required.",
  keywords:
    "anxiety relief, calm tools, breathing exercises, grounding techniques, stress relief, mindfulness, nervous system regulation, panic attack help, meditation, mental health tools, free",
  authors: [{ name: "CalmMyself" }],
  creator: "CalmMyself",
  publisher: "CalmMyself",
  manifest: "/manifest.json",
  metadataBase: new URL("https://calmmyself.com"),
  alternates: {
    canonical: "https://calmmyself.com",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://calmmyself.com",
    siteName: "CalmMyself",
    title: "CalmMyself — Free Calm & Anxiety Relief Tools",
    description:
      "36+ free, evidence-based tools for anxiety relief and nervous system regulation. Breathing, grounding, mindfulness, visualization, and sound. No signup. No ads. Free forever.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "CalmMyself — Your personal calm toolbox",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CalmMyself — Free Calm & Anxiety Relief Tools",
    description:
      "36+ free tools for anxiety relief. Breathing exercises, grounding, mindfulness, guided visualization. No signup required.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CalmMyself",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "CalmMyself",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#e6eaed",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "CalmMyself",
  url: "https://calmmyself.com",
  description:
    "Free, evidence-based tools for anxiety relief and nervous system regulation",
  applicationCategory: "HealthApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="allow-animations" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            try {
              var t = localStorage.getItem('theme');
              if (t === 'dark' || (!t && matchMedia('(prefers-color-scheme:dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-[var(--page)] antialiased relative overflow-x-hidden transition-colors duration-300">
        <MotionPreferencesProvider>
          <div className="relative z-10">
            <main className="container mx-auto px-4 py-6 sm:py-8">
              {children}
            </main>
          </div>
          <PWAInstallPrompt />
        </MotionPreferencesProvider>
      </body>
    </html>
  );
}
