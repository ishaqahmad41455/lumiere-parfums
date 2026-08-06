import { PolicyLayout } from "@/components/PolicyLayout";

export const metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout title="Shipping Policy" updated="August 2026">
      <p>
        Orders over $150 ship free within the continental US. Standard
        shipping takes 3–5 business days; expedited options are available
        at checkout. International orders typically arrive within 7–14
        business days, with duties and taxes calculated at checkout.
      </p>
      <p>
        Every order includes tracking, and you'll receive email updates as
        your fragrance moves from our atelier to your door.
      </p>
    </PolicyLayout>
  );
}
