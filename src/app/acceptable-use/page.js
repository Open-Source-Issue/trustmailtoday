import LegalLayout, { LegalSection } from "@/components/LegalLayout";

export const metadata = {
  title: "Acceptable Use Policy — Trustmailtoday",
  description:
    "Rules governing acceptable use of the Trustmailtoday email warmup service.",
};

const CONTACT_EMAIL = "support@trustmailtoday.com";

export default function AcceptableUsePage() {
  return (
    <LegalLayout title="Acceptable Use Policy" updated="June 14, 2026">
      <p className="text-[15px] leading-relaxed">
        This Acceptable Use Policy (&quot;AUP&quot;) sets out the rules for using
        Trustmailtoday. It exists to protect our users, the mailbox providers we
        work with, and the integrity of the email ecosystem. Violating this AUP
        may result in suspension or termination of your account.
      </p>

      <LegalSection heading="1. Prohibited content and activity">
        <p>You must not use the Service to send or facilitate:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>Unsolicited bulk email (spam) or unlawful messages.</li>
          <li>Phishing, fraud, scams, or deceptive content.</li>
          <li>Malware, viruses, or other harmful code.</li>
          <li>
            Content that is hateful, harassing, or that exploits or endangers
            minors.
          </li>
          <li>
            Content that infringes intellectual property or violates privacy
            rights.
          </li>
          <li>Any activity that violates applicable law or regulation.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="2. Legitimate warmup only">
        <p>
          The Service is designed to build genuine sender reputation through
          gradual, realistic sending. You must not use it to manufacture fake
          engagement for the purpose of evading spam filters in order to deliver
          abusive or unsolicited campaigns.
        </p>
      </LegalSection>

      <LegalSection heading="3. Authorized inboxes only">
        <p>
          You may only connect inboxes that you own or are explicitly authorized
          to manage. You are responsible for ensuring you have the right to send
          from any connected account.
        </p>
      </LegalSection>

      <LegalSection heading="4. Compliance with provider policies">
        <p>
          Your use must comply with the terms and sending policies of the
          mailbox providers involved, including Google&apos;s policies and
          applicable anti-spam laws (such as CAN-SPAM, GDPR, and India&apos;s IT
          Act where relevant).
        </p>
      </LegalSection>

      <LegalSection heading="5. No abuse of the platform">
        <p>
          You must not attempt to disrupt, reverse-engineer, overload, or gain
          unauthorized access to the Service or its infrastructure, or
          circumvent any rate limits or safety controls.
        </p>
      </LegalSection>

      <LegalSection heading="6. Enforcement">
        <p>
          We may investigate suspected violations and may suspend or terminate
          accounts that breach this AUP, with or without notice depending on the
          severity. We may also report unlawful activity to the relevant
          authorities.
        </p>
      </LegalSection>

      <LegalSection heading="7. Reporting abuse">
        <p>
          To report a suspected violation of this AUP, contact us at{" "}
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
