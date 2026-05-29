import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || "Aether AI"} — AI Avatar Assistant`,
  description:
    "A modern, config-driven AI avatar assistant that talks, animates and responds with AI. Built with Next.js, Tailwind and Framer Motion.",
};

export const viewport = {
  themeColor: "#09090f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <div className="aurora" aria-hidden="true" />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
