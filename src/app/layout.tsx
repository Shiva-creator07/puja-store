import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Puja Store (TPS) | Puja Samagri, Kits & Daily Puja Items",
  description:
    "The Puja Store (TPS) - curated puja samagri, festival kits and daily puja items delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-amber-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
