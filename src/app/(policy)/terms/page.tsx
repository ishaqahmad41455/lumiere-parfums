import { PolicyLayout } from "@/components/PolicyLayout";

export const metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <PolicyLayout title="Terms of Service" updated="August 2026">
      <p>
        By using lumiere-parfums.com, you agree to purchase products for
        personal use only and not for resale without written permission.
        All content, imagery, and 3D bottle renderings on this site are the
        property of Lumière Parfums and may not be reproduced.
      </p>
      <p>
        Prices are listed in USD and may change without notice. Orders are
        confirmed only once payment has been successfully processed.
      </p>
    </PolicyLayout>
  );
}
