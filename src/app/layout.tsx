import type {Metadata} from "next";
import {Inter} from "next/font/google";
import {SpeedInsights} from "@vercel/speed-insights/next"
import {Analytics} from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Picture Triangulator",
  description: "Upload any two pictures and triangulate the location of the subject using the embedded GPS data.",
  applicationName: "Picture Triangulator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
