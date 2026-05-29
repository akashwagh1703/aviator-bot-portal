import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME || "Kisan Saathi"} — AI Farming Assistant`,
  description:
    "A friendly, voice-first AI farming assistant for farmers. Ask about weather, crops, market prices and government schemes in your language.",
};

export const viewport = {
  themeColor: "#2E7D32",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <div className="aurora" aria-hidden="true" />
        <div className="grid-overlay" aria-hidden="true" />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
