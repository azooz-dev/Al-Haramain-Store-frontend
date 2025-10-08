import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { useApp } from "@shared/contexts/AppContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();
  const { isRTL } = useApp();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={isRTL ? "top-left" : "top-right"}
      dir={isRTL ? "rtl" : "ltr"}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "#000000",
          "--normal-border": "#e5e7eb",
          "--success-bg": "#ffffff",
          "--success-text": "#000000",
          "--success-border": "#10b981",
          "--error-bg": "#ffffff",
          "--error-text": "#000000",
          "--error-border": "#ef4444",
          "--warning-bg": "#ffffff",
          "--warning-text": "#000000",
          "--warning-border": "#f59e0b",
          "--info-bg": "#ffffff",
          "--info-text": "#000000",
          "--info-border": "#3b82f6",
          zIndex: 9999,
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          color: '#000000',
          backdropFilter: 'none',
          opacity: '1',
          zIndex: '9999',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
