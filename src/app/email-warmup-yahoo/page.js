import LandingPage from "@/components/LandingPage";
import { getLandingPage } from "@/lib/landing-pages";

const SLUG = "email-warmup-yahoo";
const data = getLandingPage(SLUG);

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: `/${SLUG}` },
};

export default function Page() {
  return <LandingPage data={data} />;
}
