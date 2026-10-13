import "dotenv/config";
import crypto from "node:crypto";
import { NepPayments } from "neppayments";

const environment =
  process.env.ESEWA_ENVIRONMENT ||
  (process.env.NODE_ENV === "production" ? "production" : "sandbox");
if (!["sandbox", "production"].includes(environment)) {
  throw new Error("ESEWA_ENVIRONMENT must be sandbox or production.");
}
const isSandbox = environment === "sandbox";

export const esewaProductCode =
  process.env.ESEWA_PRODUCT_CODE || (isSandbox ? "EPAYTEST" : undefined);
const esewaSecretKey =
  process.env.ESEWA_SECRET_KEY ||
  (isSandbox ? "8gBm/:&EnhH.1/q" : undefined);
export const esewaPaymentUrl = isSandbox
  ? "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
  : "https://epay.esewa.com.np/api/epay/main/v2/form";

export const signEsewaPayment = (fields) => {
  const signedData = fields.signed_field_names
    .split(",")
    .map((field) => `${field}=${fields[field]}`)
    .join(",");
  return crypto
    .createHmac("sha256", esewaSecretKey)
    .update(signedData)
    .digest("base64");
};

const payments = new NepPayments({
  esewa: {
    productCode: esewaProductCode,
    secretKey: esewaSecretKey,
    environment,
    successUrl: `${process.env.CLIENT_URL}/payment-success`,
    failureUrl: `${process.env.CLIENT_URL}/payment-failure`,
  },
});

export default payments;
