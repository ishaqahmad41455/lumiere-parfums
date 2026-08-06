import { PolicyLayout } from "@/components/PolicyLayout";

export const metadata = { title: "Refund Policy" };

export default function RefundPolicyPage() {
  return (
    <PolicyLayout title="Refund Policy" updated="August 2026">
      <p>
        We accept returns within 30 days of delivery for bottles used up to
        14% of their volume. Gift sets and limited-edition releases marked
        "final sale" are not eligible for return.
      </p>
      <p>
        Once your return is received and inspected, refunds are issued to
        your original payment method within 5–7 business days.
      </p>
    </PolicyLayout>
  );
}
