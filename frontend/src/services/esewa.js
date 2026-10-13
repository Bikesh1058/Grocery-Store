export const submitEsewaPayment = ({ payment_url, fields }) => {
  let paymentUrl;
  try {
    paymentUrl = new URL(payment_url);
  } catch {
    throw new Error("The eSewa payment response is invalid.");
  }

  if (
    paymentUrl.protocol !== "https:" ||
    !["rc-epay.esewa.com.np", "epay.esewa.com.np"].includes(paymentUrl.hostname) ||
    !fields ||
    typeof fields !== "object" ||
    Array.isArray(fields)
  ) {
    throw new Error("The eSewa payment response is invalid.");
  }

  const form = document.createElement("form");
  form.method = "POST";
  form.action = paymentUrl.href;
  form.hidden = true;

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
};
