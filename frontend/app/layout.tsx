import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./_layout/header";
import { Toaster } from "sonner";
import { GoogleAnalytics } from "@next/third-parties/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://filesharelive.vercel.app"),
  title: {
    default: "FileShareLive - Fast & Secure Online File Share",
    template: "%s | FileShareLive",
  },
  description:
    "Upload. Share. Collaborate. Securely share your files with friends and colleagues. Simple, fast, and encrypted online file sharing tool.",
  keywords: [
    "file share",
    "file sharing",
    "share files online",
    "secure file share",
    "encrypted file transfer",
    "fast file share",
    "upload files",
    "collaborate online",
    "free file transfer",
    "instant file share",
  ],
  authors: [{ name: "FileShareLive" }],
  creator: "FileShareLive",
  publisher: "FileShareLive",
  icons: {
    icon: "/folder.png",
  },
  openGraph: {
    title: "FileShareLive - Fast & Secure Online File Share",
    description:
      "Upload. Share. Collaborate. Securely share your files with friends and colleagues. Simple, fast, and encrypted.",
    url: "https://filesharelive.vercel.app",
    siteName: "FileShareLive",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "FileShareLive - Upload, Share, Collaborate Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileShareLive - Fast & Secure Online File Share",
    description:
      "Upload. Share. Collaborate. Securely share your files with friends and colleagues. Simple, fast, and encrypted.",
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
    canonical: "https://filesharelive.vercel.app",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <Header />
        {children}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
      </body>
    </html>
  );
}
