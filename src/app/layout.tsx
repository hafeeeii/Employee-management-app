import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { decrypt, User } from "@/lib/session";
import { UserProvider } from "@/components/user-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WorkSphere",
  description: "A workspace-centric management tool",
};

export default async function RootLayout ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
      const cookieStore = await cookies()
      const cookie = cookieStore.get('session')?.value
      let session = null;
  
      if (cookie) {
          session = await decrypt(cookie);
      }
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        {" "}
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider user={(session as User) ?? null}>
          {children}
          </UserProvider>
          <Toaster/>
        </ThemeProvider>
      </body>
    </html>
  );
}
