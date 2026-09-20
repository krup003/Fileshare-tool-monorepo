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
    default: "FileShareLive - Secure File Sharing for Developers",
    template: "%s | FileShareLive",
  },
  description:
    "FileShareLive is a fast and secure file sharing tool for developers. Upload, share, password-protect, manage privacy, and delete files easily.",
  keywords: [
    "file sharing",
    "secure file sharing",
    "developer tools",
    "upload files",
    "password protected files",
    "file transfer",
    "share files online",
    "temporary file sharing",
    "private file sharing",
  ],
  authors: [{ name: "FileShareLive" }],
  creator: "FileShareLive",
  publisher: "FileShareLive",
  icons: {
    icon: "/folder.png",
  },
  openGraph: {
    title: "FileShareLive - Secure File Sharing for Developers",
    description:
      "Upload and share files securely with password protection and privacy control. Built for developers.",
    url: "https://filesharelive.vercel.app",
    siteName: "FileShareLive",
    images: [
      {
        url: "/folder.png",
        width: 1200,
        height: 630,
        alt: "FileShareLive Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FileShareLive - Secure File Sharing",
    description:
      "Fast, secure file sharing with password protection and privacy control.",
    images: ["/folder.png"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
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
