import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Le Rhino - Assistant de Révision",
  description: "Assistant intelligent pour la révision des cours",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col bg-background">
          {children}
        </div>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
