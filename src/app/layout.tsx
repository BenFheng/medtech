import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Vanguard | Cellular Optimization Defined",
  description:
    "Doctor-formulated, data-driven supplement stacks for high-performing professionals. Clinical-grade precision meets algorithmic optimization.",
  openGraph: {
    title: "Vanguard | Cellular Optimization Defined",
    description:
      "Doctor-formulated, data-driven supplement stacks for high-performing professionals.",
    siteName: "Vanguard Health Sciences",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vanguard | Cellular Optimization Defined",
    description:
      "Doctor-formulated, data-driven supplement stacks for high-performing professionals.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
