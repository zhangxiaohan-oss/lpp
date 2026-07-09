# 第三方登录和客服真实接入清单

请先确认一个正式域名，例如 Netlify / Vercel 的 HTTPS 地址。OAuth 后台不能只填 `127.0.0.1`。

## 1. Google / Gmail 登录

需要给我：
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- 授权回调 URL：`https://你的域名/api/auth/google/callback/`

Google Cloud Console 里创建 OAuth Client，类型选 Web application。

## 2. Facebook 登录

需要给我：
- `META_APP_ID`
- `META_APP_SECRET`
- OAuth 回调 URL：`https://你的域名/api/auth/facebook/callback/`

Meta App 需要添加 Facebook Login，并开启 email / public_profile 权限。

## 3. WhatsApp Business 客服和绑定

需要给我：
- `WHATSAPP_BUSINESS_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_DISPLAY_NUMBER`
- `WHATSAPP_VERIFY_TOKEN`

注意：WhatsApp 不是普通 OAuth 登录。正式绑定用户账号通常要做手机号验证码或一次性链接验证。

## 4. Messenger 客服

需要给我：
- `FACEBOOK_PAGE_ID`
- `MESSENGER_PAGE_ACCESS_TOKEN`
- `MESSENGER_VERIFY_TOKEN`

Messenger 客服一般通过 Facebook Page 收件箱和 Webhook 接消息。

## 当前项目已完成

- 移除 `output: "export"`，允许 Next API 路由运行。
- 新增 Google / Facebook OAuth start 和 callback 路由。
- 新增账号 session 查询和 logout 接口。
- 新增 WhatsApp / Messenger 配置检查入口。
- 新增 `.env.example`，按里面复制成 `.env.local` 填值。
