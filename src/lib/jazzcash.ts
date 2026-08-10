import crypto from "crypto";

/**
 * JazzCash Mobile Account (Hosted Checkout Page) integration.
 * Docs: https://sandbox.jazzcash.com.pk/Sandbox/Sandbox
 *
 * Flow:
 * 1. Server builds a signed payload (pp_* fields) and a SecureHash.
 * 2. Client is redirected (via auto-submitting form) to JazzCash's hosted
 *    payment page with those fields.
 * 3. JazzCash redirects back to JAZZCASH_RETURN_URL with the result,
 *    which we verify in /api/webhooks/jazzcash.
 */

const JAZZCASH_ENV = process.env.JAZZCASH_ENV === "live" ? "live" : "sandbox";

export const JAZZCASH_ENDPOINT =
  JAZZCASH_ENV === "live"
    ? "https://payments.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/"
    : "https://sandbox.jazzcash.com.pk/CustomerPortal/transactionmanagement/merchantform/";

interface JazzCashParams {
  amount: number; // in PKR, e.g. 1500.00
  orderRefNum: string; // your internal order id (must be unique)
  description: string;
  returnUrl: string;
}

/** JazzCash expects amount in paisa (amount * 100), no decimals. */
function toPaisa(amount: number) {
  return Math.round(amount * 100).toString();
}

function nowStamp() {
  const d = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

function expiryStamp(minutesFromNow = 60) {
  const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    d.getFullYear().toString() +
    pad(d.getMonth() + 1) +
    pad(d.getDate()) +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  );
}

/**
 * Builds the full set of pp_* fields JazzCash requires, plus a SecureHash
 * computed as HMAC-SHA256 over "&"-joined, alphabetically-sorted pp_* values,
 * prefixed with the integrity salt.
 */
export function buildJazzCashPayload({
  amount,
  orderRefNum,
  description,
  returnUrl,
}: JazzCashParams) {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID!;
  const password = process.env.JAZZCASH_PASSWORD!;
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT!;

  const fields: Record<string, string> = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: merchantId,
    pp_Password: password,
    pp_TxnRefNo: orderRefNum,
    pp_Amount: toPaisa(amount),
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: nowStamp(),
    pp_BillReference: orderRefNum,
    pp_Description: description.slice(0, 100),
    pp_TxnExpiryDateTime: expiryStamp(60),
    pp_ReturnURL: returnUrl,
    ppmpf_1: "",
    ppmpf_2: "",
    ppmpf_3: "",
    ppmpf_4: "",
    ppmpf_5: "",
  };

  // Sort keys alphabetically and join non-empty values with "&"
  const sortedKeys = Object.keys(fields).sort();
  const hashString = sortedKeys
    .filter((k) => fields[k] !== "")
    .map((k) => fields[k])
    .join("&");

  const secureHash = crypto
    .createHmac("sha256", integritySalt)
    .update(`${integritySalt}&${hashString}`)
    .digest("hex")
    .toUpperCase();

  return { ...fields, pp_SecureHash: secureHash };
}

/** Verifies the SecureHash JazzCash sends back on the return URL. */
export function verifyJazzCashResponse(fields: Record<string, string>) {
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT!;
  const { pp_SecureHash, ...rest } = fields;

  const sortedKeys = Object.keys(rest).sort();
  const hashString = sortedKeys
    .filter((k) => rest[k] !== "" && rest[k] !== undefined)
    .map((k) => rest[k])
    .join("&");

  const expected = crypto
    .createHmac("sha256", integritySalt)
    .update(`${integritySalt}&${hashString}`)
    .digest("hex")
    .toUpperCase();

  return expected === pp_SecureHash;
}
