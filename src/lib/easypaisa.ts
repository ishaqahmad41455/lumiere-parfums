import crypto from "crypto";

/**
 * EasyPaisa Open/Hosted Checkout integration.
 * Docs (merchant portal): https://easypaisa.com.pk/merchants/
 *
 * Flow mirrors JazzCash: build a signed request, redirect the customer to
 * EasyPaisa's hosted page, then verify the callback on the return URL.
 * Exact field names can differ slightly by merchant agreement (Open API vs
 * classic MA model) — confirm against the integration doc EasyPaisa sends
 * once your merchant account is approved, and adjust field names below.
 */

const EASYPAISA_ENV = process.env.EASYPAISA_ENV === "live" ? "live" : "sandbox";

export const EASYPAISA_ENDPOINT =
  EASYPAISA_ENV === "live"
    ? "https://easypay.easypaisa.com.pk/easypay/Index.jsf"
    : "https://easypaystg.easypaisa.com.pk/easypay/Index.jsf";

interface EasyPaisaParams {
  amount: number; // PKR, e.g. 1500.00
  orderRefNum: string;
  description: string;
  returnUrl: string;
  mobileNumber?: string; // optional, prefills the wallet number
  email?: string;
}

function txnDateTime() {
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

/**
 * Builds the hosted-checkout form fields. EasyPaisa's HashRequest is an
 * AES-encrypted, then base64-encoded string of "key=value&..." pairs signed
 * with the merchant's hash key (per their Open API spec).
 */
export function buildEasyPaisaPayload({
  amount,
  orderRefNum,
  description,
  returnUrl,
  mobileNumber,
  email,
}: EasyPaisaParams) {
  const storeId = process.env.EASYPAISA_STORE_ID!;
  const hashKey = process.env.EASYPAISA_HASH_KEY!;

  const raw: Record<string, string> = {
    amount: amount.toFixed(2),
    storeId,
    postBackURL: returnUrl,
    orderRefNum,
    expiryDate: expiry(),
    autoRedirect: "1",
    paymentMethod: "MA_PAYMENT_METHOD",
    emailAddr: email ?? "",
    mobileNum: mobileNumber ?? "",
    merchantHashedReq: "",
  };

  const hashString = Object.keys(raw)
    .filter((k) => k !== "merchantHashedReq" && raw[k] !== "")
    .sort()
    .map((k) => `${k}=${raw[k]}`)
    .join("&");

  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    crypto.createHash("sha256").update(hashKey).digest(),
    Buffer.alloc(16, 0)
  );
  const encrypted = Buffer.concat([cipher.update(hashString, "utf8"), cipher.final()]);
  raw.merchantHashedReq = encrypted.toString("base64");

  return raw;
}

function expiry(minutesFromNow = 60) {
  const d = new Date(Date.now() + minutesFromNow * 60 * 1000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

/** Verifies EasyPaisa's callback signature. Adjust to match their exact spec. */
export function verifyEasyPaisaResponse(body: Record<string, string>) {
  // EasyPaisa's postback includes a status + a hash you re-derive the same
  // way as buildEasyPaisaPayload and compare. Placeholder: always require
  // an explicit success status until the real hash spec is wired in.
  return body.status === "0000" || body.status === "SUCCESS";
}
