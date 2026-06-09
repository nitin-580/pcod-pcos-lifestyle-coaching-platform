import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://wombcare.in"),

  title: {
    default: "WombCare — “A Doctor-powered premium women’s health platform for PCOD & pregnancy management with structured care”",
    template: "%s | WombCare",
  },

  description:
    "WombCare is a lifestyle coach designed to help women balance hormones, manage PCOD, track menstrual cycles, and improve period health naturally.",

  keywords: [
    "PCOD",
    "PCOS",
    "period health",
    "hormone balance",
    "menstrual health",
    "women health AI",
    "cycle tracking",
    "hormone health",
    "health coach",
    "PCOD lifestyle management",
  ],

  authors: [{ name: "WombCare Team" }],
  creator: "WombCare",
  publisher: "WombCare",

  openGraph: {
    title: "WombCare — Coach for PCOD & Hormone Health",
    description:
      "Understand your hormones, balance your cycle, and manage PCOD with AI-powered guidance.",
    url: "https://wombcare.in",
    siteName: "WombCare",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "WombCare Hormone Health Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "WombCare — AI PCOD & Period Health Coach",
    description:
      "Balance hormones and manage PCOD with AI-powered lifestyle coaching.",
    images: ["/og-image.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://wombcare.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}

        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R88VXLF710"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-R88VXLF710');
          `}
        </Script>
      </body>
    </html>
  );
}
