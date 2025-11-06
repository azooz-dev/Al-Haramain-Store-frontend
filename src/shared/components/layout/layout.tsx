import React, { ReactNode } from "react";
import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header/>
      <main className="flex-1">{ children }</main>
      <Footer/>
    </div>
  );
}