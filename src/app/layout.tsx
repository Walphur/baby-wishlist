import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Baby Wishlist — Lista de regalos para baby shower",
  description:
    "Creá gratis la lista de regalos de tu baby shower y compartila con quien quieras.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${fredoka.variable} ${inter.variable} font-sans bg-gradient-to-b from-cream-50 via-cream-100 to-sage-50 text-ink-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

