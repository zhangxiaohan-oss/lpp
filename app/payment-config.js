export const paymentSettings = {
  currency: "USD",
  supportEmail: "support@oufanacc.com",
  stripePaymentLink: "",
  paypalPaymentLink: ""
};

export const paymentMethods = [
  {
    id: "stripe",
    label: "Stripe / Credit Card",
    description: "支持信用卡等在线付款。请先在 Stripe 后台创建 Payment Link，再填入配置。",
    urlKey: "stripePaymentLink"
  },
  {
    id: "paypal",
    label: "PayPal",
    description: "支持 PayPal 账户或 PayPal 托管收银台。请先在 PayPal 后台创建收款链接。",
    urlKey: "paypalPaymentLink"
  }
];