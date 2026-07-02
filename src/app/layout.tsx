import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bloombook",
  description: "Beautiful bookings, effortlessly managed.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="font-sans">
      <body>{children}</body>
    </html>
  );
}
