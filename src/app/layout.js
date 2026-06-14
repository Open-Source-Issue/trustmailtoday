import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://trustmailtoday.com"),
  title: "Trustmailtoday — Keep Your Emails Out of Spam",
  description:
    "AI-powered email warmup that builds real sender reputation so your emails land in the inbox, not the spam folder. From ₹200/month.",
  keywords: [
    "email warmup",
    "inbox placement",
    "sender reputation",
    "cold email deliverability",
    "SPF DKIM DMARC",
  ],
  openGraph: {
    type: "website",
    siteName: "Trustmailtoday",
    title: "Trustmailtoday — Keep Your Emails Out of Spam",
    description:
      "AI-powered email warmup that builds real sender reputation so your emails land in the inbox, not the spam folder.",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Trustmailtoday — Keep Your Emails Out of Spam",
    description:
      "AI-powered email warmup that builds real sender reputation so your emails land in the inbox, not the spam folder.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${poppins.variable} scroll-smooth antialiased`}
    >
      <body
        className="min-h-screen bg-darkbg text-[#FFFFFF] font-sans"
        suppressHydrationWarning
      >
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
