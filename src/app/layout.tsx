import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import QueryProvider from "../providers/QueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prepify - Ace Your Prep with AI-Powered Study Plans",
  description:
    "Transform your learning with Prepify's personalized AI study plans. Get customized study guides, track progress, and achieve your academic goals faster. Free study resources for students worldwide.",
  keywords: [
    "study plans",
    "AI learning",
    "academic prep",
    "study guides",
    "education",
    "student resources",
    "personalized learning",
  ],
  authors: [{ name: "Prepify Team" }],
  creator: "Prepify",
  publisher: "Prepify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://prepify.study"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Prepify - Ace Your Prep with AI-Powered Study Plans",
    description:
      "Transform your learning with Prepify's personalized AI study plans. Get customized study guides, track progress, and achieve your academic goals faster.",
    url: "https://prepify.study",
    siteName: "Prepify",
    images: [
      {
        url: "/logoSlogan.webp",
        width: 1200,
        height: 630,
        alt: "Prepify - Ace Your Prep with AI-Powered Study Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prepify - Ace Your Prep with AI-Powered Study Plans",
    description:
      "Transform your learning with Prepify's personalized AI study plans. Get customized study guides, track progress, and achieve your academic goals faster.",
    images: ["/logoSlogan.webp"],
    creator: "@prepify",
    site: "@prepify",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics Scripts */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-C6HN5KEJD0"
          id="google-analytics"
        ></Script>
        <Script id="google-analytics-script">
          {` window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-C6HN5KEJD0');`}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
