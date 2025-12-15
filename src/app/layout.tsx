import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import QueryProvider from "../providers/QueryProvider";
import { Toaster } from "react-hot-toast";

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
        url: "/logoWBackground.webp",
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
    images: ["/logoWBackground.webp"],
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
        <Toaster
          position={"top-center"}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#1f2937",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "1rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: "500",
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              maxWidth: "24rem",
            },
            success: {
              style: {
                background: "#d1fae5",
                color: "#065f46",
                border: "1px solid #10b981",
              },
              iconTheme: {
                primary: "#065f46",
                secondary: "#d1fae5",
              },
            },
            error: {
              style: {
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #ef4444",
              },
              iconTheme: {
                primary: "#991b1b",
                secondary: "#fee2e2",
              },
            },
            loading: {
              style: {
                background: "#dbeafe",
                color: "#1e40af",
                border: "1px solid #3b82f6",
              },
            },
          }}
        />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
