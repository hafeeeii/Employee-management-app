import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <SidebarProvider >
      <AppSidebar  />
      <main className="w-full min-h-screen flex flex-col">
        <SidebarTrigger />
        <div className="p-4">
        {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
