import LandingPage from "@/components/LandingPage";
import { getLandingPage } from "@/lib/landing-pages";

const SLUG = "smtp-warmup";
const data = getLandingPage(SLUG);

export const metadata = {
  title: data.metaTitle,
  description: data.metaDescription,
  alternates: { canonical: `/${SLUG}` },
};

export default function Page() {
  return <LandingPage data={data} />;
}
