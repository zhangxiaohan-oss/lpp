# 第三方登录和客服真实接入清单

请先确认一个正式 HTTPS 域名，例如 Netlify 域名。OAuth 后台不能只填 `127.0.0.1`。

当前 Netlify 示例域名：`https://golden-syrniki-7459e5.netlify.app`

## 1. Google / Gmail 登录

需要在 Netlify 环境变量填写：
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_SITE_URL=https://你的域名`

Google Cloud Console 授权回调 URL：
- `https://你的域名/api/auth/google/callback/`

## 2. Facebook 登录

需要在 Netlify 环境变量填写：
- `META_APP_ID`
- `META_APP_SECRET`
- `META_API_VERSION=v23.0`

Meta App 的 OAuth 回调 URL：
- `https://你的域名/api/auth/facebook/callback/`

Meta App 需要添加 Facebook Login，并开启 `email` / `public_profile` 权限。

## 3. WhatsApp Business 客服和绑定

需要在 Netlify 环境变量填写：
- `WHATSAPP_BUSINESS_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN`
- `WHATSAPP_DISPLAY_NUMBER`
- `WHATSAPP_VERIFY_TOKEN`

WhatsApp Cloud API Webhook 回调 URL：
- `https://你的域名/api/auth/whatsapp/webhook/`

注意：WhatsApp 不是普通 OAuth 登录。正式绑定用户账号通常要通过手机号验证码、一次性链接，或用户主动发起 WhatsApp 对话后记录手机号。后端发送接口已经预留，真实发送时必须提供客户手机号（E.164 格式）。

## 4. Messenger 客服

需要在 Netlify 环境变量填写：
- `FACEBOOK_PAGE_ID`
- `MESSENGER_PAGE_ACCESS_TOKEN`
- `MESSENGER_VERIFY_TOKEN`

Messenger Webhook 回调 URL：
- `https://你的域名/api/auth/messenger/webhook/`

Messenger 真实发送需要客户先和 Facebook Page 发起对话，系统拿到 Page-scoped user ID（PSID）后才能通过 Send API 回复。

## 当前项目已完成

- 移除 `output: "export"`，允许 Next API 路由运行。
- Google / Facebook OAuth start 和 callback 路由已接入，并加入 OAuth `state` 校验。
- 新增账号 session 查询和 logout 接口。
- 新增 WhatsApp / Messenger Webhook GET 验证和 POST 接收入口。
- 新增 `/api/support/send`，支持 WhatsApp Cloud API 和 Messenger Send API 的服务端发送。
- 前端账号面板、登录/注册入口、分渠道客服窗口已连接到对应接口。
- 新增 `.env.example`，按里面复制成 `.env.local` 或填入 Netlify 环境变量。
