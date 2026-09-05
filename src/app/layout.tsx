import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
        className={`${playfair.variable} ${inter.variable} font-sans bg-cream-100 text-ink-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
