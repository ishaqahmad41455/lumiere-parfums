import { PolicyLayout } from "@/components/PolicyLayout";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout title="Privacy Policy" updated="August 2026">
      <p>
        Lumière Parfums collects only the information required to fulfill
        your orders, personalize your experience, and communicate with you
        about products you've purchased or shown interest in.
      </p>
      <p>
        We never sell your personal data. Payment details are processed
        directly by Stripe and PayPal and are never stored on our servers.
        You may request a copy of, or deletion of, your data at any time by
        contacting privacy@lumiere-parfums.com.
      </p>
    </PolicyLayout>
  );
}
