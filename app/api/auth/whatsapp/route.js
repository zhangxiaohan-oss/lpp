import { htmlResponse, requireEnv } from "../_shared/utils";

export async function GET() {
  const missing = requireEnv("WhatsApp 绑定和客服", ["WHATSAPP_BUSINESS_PHONE_NUMBER_ID", "WHATSAPP_ACCESS_TOKEN", "WHATSAPP_DISPLAY_NUMBER"]);
  if (missing) return missing;

  return htmlResponse("WhatsApp binding ready", `<h1>WhatsApp 通道已配置</h1><p>下一步需要启用手机号验证码流程和 Webhook，才能把 WhatsApp 号码绑定到 Oufan 账户。</p><p>当前展示客服入口：<a href="https://wa.me/${process.env.WHATSAPP_DISPLAY_NUMBER}" rel="noreferrer">打开 WhatsApp 客服</a></p><p><a href="/">返回首页</a></p>`);
}
