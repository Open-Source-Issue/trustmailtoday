import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export const metadata = {
  title: "Terms of Service — Trustmailtoday",
  description:
    "The terms and conditions governing your use of the Trustmailtoday email warmup service.",
};

const CONTACT_EMAIL = "support@trustmailtoday.com";

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Service" updated="June 14, 2026">
      <p className="text-[15px] leading-relaxed">
        These Terms of Service (&quot;Terms&quot;) govern your access to and use
        of Trustmailtoday (the &quot;Service&quot;). By creating an account or
        connecting an inbox, you agree to these Terms.
      </p>

      <LegalSection heading="1. The service">
        <p>
          Trustmailtoday provides email warmup and deliverability tooling that
          gradually increases sending volume, measures inbox placement, and
          tracks sender reputation. The Service is built on legitimate
          deliverability practices and is not designed to evade spam filters or
          send unsolicited bulk email.
        </p>
      </LegalSection>

      <LegalSection heading="2. Eligibility and accounts">
        <p>
          You must be at least 18 years old and capable of forming a binding
          contract to use the Service. You are responsible for the activity that
          occurs under your account and for keeping your access credentials
          secure.
        </p>
      </LegalSection>

      <LegalSection heading="3. Acceptable use">
        <p>
          Your use of the Service must comply with our{" "}
          <a
            href="/acceptable-use"
            className="text-[#22c55e] underline hover:text-[#4ADE80]"
          >
            Acceptable Use Policy
          </a>
          . Using the Service to send spam, phishing, malware, or any unlawful
          content is strictly prohibited and may result in immediate
          suspension.
        </p>
      </LegalSection>

      <LegalSection heading="4. Connected inboxes">
        <p>
          By connecting a Google account, you authorize Trustmailtoday to send
          and label messages on your behalf solely to operate the warmup engine,
          as described in our{" "}
          <a
            href="/privacy"
            className="text-[#22c55e] underline hover:text-[#4ADE80]"
          >
            Privacy Policy
          </a>
          . You may disconnect your inbox at any time.
        </p>
      </LegalSection>

      <LegalSection heading="5. Plans and limits">
        <p>
          The Service is offered across Free and paid plans with different
          daily sending limits and features. We may change plan features or
          limits over time; material changes will be communicated in advance
          where reasonably possible. You may cancel at any time.
        </p>
      </LegalSection>

      <LegalSection heading="6. Service availability">
        <p>
          We aim to keep the Service available and reliable but do not guarantee
          uninterrupted access. We may modify, suspend, or discontinue features
          with reasonable notice.
        </p>
      </LegalSection>

      <LegalSection heading="7. Disclaimers">
        <p>
          The Service is provided &quot;as is&quot; without warranties of any
          kind. Email deliverability depends on many factors outside our
          control, including the policies of mailbox providers. We do not
          guarantee specific inbox-placement rates or business outcomes.
        </p>
      </LegalSection>

      <LegalSection heading="8. Limitation of liability">
        <p>
          To the maximum extent permitted by law, Trustmailtoday will not be
          liable for any indirect, incidental, or consequential damages, or for
          loss of profits, data, or goodwill arising from your use of the
          Service.
        </p>
      </LegalSection>

      <LegalSection heading="9. Termination">
        <p>
          We may suspend or terminate your access if you violate these Terms or
          the Acceptable Use Policy. You may stop using the Service and
          disconnect your inbox at any time.
        </p>
      </LegalSection>

      <LegalSection heading="10. Changes to these terms">
        <p>
          We may update these Terms from time to time. Continued use of the
          Service after changes take effect constitutes acceptance of the
          revised Terms.
        </p>
      </LegalSection>

      <LegalSection heading="11. Contact">
        <p>
          Questions about these Terms? Email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-[#22c55e] underline hover:text-[#4ADE80]"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
