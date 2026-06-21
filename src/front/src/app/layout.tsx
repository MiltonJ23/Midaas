import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ToastContainer } from "react-toastify";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
 const APP_NAME = "Midaas";
const APP_DEFAULT_TITLE =
  "Dashboard - Midaas | Inclusive Investment in Africa";
const APP_TITLE_TEMPLATE = "%s - Midaas";
const APP_DESCRIPTION =
  "Transparently support and invest in local businesses across Africa. Track project progress in real time and release funds through secure milestone stages.";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  keywords:
    "africa investment, local crowdfunding, financing platform, entrepreneur support, secure investing, milestone funding, Midaas",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description:
      "A transparent crowdfunding platform connecting communities with African entrepreneurs under strict milestone-based tracking.",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  alternates: {
    canonical: "/dashboard",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="animate-fade-in">
          {children}
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          toastClassName="!bg-white !text-black !border !border-black/10 !rounded-lg !shadow-lg !font-medium"
          bodyClassName="!text-sm"
          progressClassName="!bg-primary"
        />
      </body>
    </html>
  );
}
