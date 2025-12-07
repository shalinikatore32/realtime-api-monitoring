import AlertProvider from "@/components/custom/AlertProvider";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "API Monitoring Dashboard",
  description: "Monitor and analyse API performance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AlertProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </AlertProvider>
      </body>
    </html>
  );
}
