import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { CredentialInitializer } from "@/components/credential-initializer";
import "./global.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://collectui.vercel.app"),
  icons: "/logo.png",
};

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <RootProvider>
          <CredentialInitializer>{children}</CredentialInitializer>
        </RootProvider>
      </body>
    </html>
  );
}
