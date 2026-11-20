import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kohinoor Singh — Portfolio",
  description: "Kohinoor Singh — Full-Stack Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
