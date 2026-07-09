import { htmlResponse, requireEnv } from "../_shared/utils";

export async function GET() {
  const missing = requireEnv("Messenger 客服", ["FACEBOOK_PAGE_ID", "MESSENGER_PAGE_ACCESS_TOKEN"]);
  if (missing) return missing;

  const messengerUrl = `https://m.me/${process.env.FACEBOOK_PAGE_ID}`;
  return htmlResponse("Messenger ready", `<h1>Messenger 通道已配置</h1><p>下一步需要配置 Webhook，把 Page 收件箱消息同步到 Oufan 客服系统。</p><p><a href="${messengerUrl}" rel="noreferrer">打开 Messenger 客服</a></p><p><a href="/">返回首页</a></p>`);
}
