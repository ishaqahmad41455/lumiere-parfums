"use client";

import { useEffect, useRef } from "react";

/**
 * JazzCash and EasyPaisa's hosted checkout pages only accept an HTML form
 * POST (not a simple redirect URL like Stripe/PayPal give you). This
 * component renders a hidden form with the signed fields and submits it
 * automatically, sending the browser to the wallet's payment page.
 */
export function PakRedirectForm({
  endpoint,
  fields,
}: {
  endpoint: string;
  fields: Record<string, string>;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    formRef.current?.submit();
  }, []);

  return (
    <form ref={formRef} action={endpoint} method="POST" className="hidden">
      {Object.entries(fields).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
    </form>
  );
}
