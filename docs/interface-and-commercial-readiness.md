# LPP Hat Shop 接口文档与正式商用准备清单

更新时间：2026-07-02
站点域名：oufanacc.com / www.oufanacc.com
当前部署形态：Next.js 静态导出，上传到 SiteGround `public_html`

## 1. 当前系统状态

当前网站是静态电商展示站，可以展示商品、筛选商品、收藏、对比、加入购物车、填写结账信息和本地后台演示。

重要限制：当前没有真实后端数据库，没有真实支付，没有真实物流接口。订单、后台商品、收藏、购物车等数据保存在访问者自己浏览器的 `localStorage` 中；换设备、清缓存或换浏览器后数据会丢失，也不会同步到商家后台服务器。

## 2. 前端页面路由

| 路由 | 用途 | 参数 |
|---|---|---|
| `/` | 首页 | 无 |
| `/shop` | 商品列表 | `filter`、`keywords` |
| `/product/[slug]` | 商品详情 | `slug` 路径参数 |
| `/cart` | 购物车演示 | `product`、`qty` |
| `/checkout` | 结账表单演示 | `product`、`qty` |
| `/wishlist` | 收藏夹 | 无 |
| `/compare` | 商品对比 | 无 |
| `/contact` | 联系表单展示 | 无 |
| `/customize` | 定制需求展示 | 无 |
| `/tracking` | 订单追踪演示 | 无 |
| `/admin` | 本地后台演示 | 无 |
| `/about` | 关于页面 | 无 |
| `/brand-story` | 品牌故事 | 无 |
| `/new-arrival` | 新品页面 | 无 |
| `/best-sellers` | 热卖页面 | 无 |

## 3. 当前外部接口

### 3.1 汇率接口

```http
GET https://open.er-api.com/v6/latest/USD
```

用途：把商品美元价格换算成人民币展示。

前端使用字段：

```json
{
  "rates": {
    "CNY": 7.1234
  },
  "time_last_update_utc": "...",
  "time_next_update_utc": "..."
}
```

失败兜底：如果接口失败，前端使用备用汇率 `1 USD = 6.79 CNY`。

风险：这是浏览器直接请求的第三方接口，正式商用建议改成后端定时缓存汇率，避免第三方接口不可用、跨域、限流或数据异常影响价格展示。

## 4. 当前本地存储接口

当前这些数据都存在浏览器本地，不是服务器数据库。

### 4.1 购物车：`lpp_cart`

```json
{
  "product-slug": {
    "slug": "product-slug",
    "qty": 1
  }
}
```

### 4.2 收藏夹：`lpp_wishlist`

```json
[
  "product-slug-1",
  "product-slug-2"
]
```

### 4.3 商品对比：`lpp_compare`

```json
[
  "product-slug-1",
  "product-slug-2"
]
```

### 4.4 本地后台商品：`lpp_admin_products`

```json
[
  {
    "id": 29321,
    "slug": "wholesale-custom-logo-surfing-beach-straw-hats",
    "title": "夏季成人冲浪海滩草帽批发定制",
    "price": 30.9,
    "image": "/assets/product-02.jpg",
    "description": "商品描述",
    "tags": ["custom", "wholesale", "surf", "beach"]
  }
]
```

### 4.5 本地订单：`lpp_admin_orders`

```json
[
  {
    "id": "LPP20260702-12345",
    "createdAt": "2026-07-02T00:00:00.000Z",
    "source": "购物网页",
    "status": "pending",
    "paymentStatus": "pending",
    "fulfillmentStatus": "unfulfilled",
    "productSlug": "product-slug",
    "productTitle": "商品标题",
    "productImage": "/assets/product-02.jpg",
    "quantity": 1,
    "unitPrice": 30.9,
    "total": 30.9,
    "customer": {
      "name": "客户姓名",
      "email": "customer@example.com",
      "phone": "+1...",
      "address": "收货地址"
    },
    "notes": "定制需求",
    "timeline": [
      { "label": "客户提交订单", "time": "2026-07-02T00:00:00.000Z" }
    ]
  }
]
```

### 4.6 偏好设置

| Key | 用途 | 可选值 |
|---|---|---|
| `lpp_currency` | 币种 | `CNY`、`USD` |
| `lpp_language` | 语言 | `zh-CN`、`en` |

## 5. 正式商用建议后端 API

正式卖货时，应把下列能力从浏览器本地存储迁移到后端数据库。

### 5.1 商品接口

```http
GET /api/products
GET /api/products/:slug
POST /api/admin/products
PATCH /api/admin/products/:id
DELETE /api/admin/products/:id
```

商品字段建议：

```json
{
  "id": "prod_001",
  "slug": "custom-logo-patch-lifeguard-straw-hat",
  "title": "Logo 贴章救生员草帽",
  "status": "active",
  "price": 28.9,
  "currency": "USD",
  "compareAtPrice": null,
  "inventory": 120,
  "images": ["https://..."],
  "tags": ["custom", "lifeguard"],
  "description": "商品描述",
  "seoTitle": "...",
  "seoDescription": "...",
  "createdAt": "2026-07-02T00:00:00.000Z",
  "updatedAt": "2026-07-02T00:00:00.000Z"
}
```

### 5.2 购物车接口

```http
POST /api/cart
GET /api/cart/:cartId
POST /api/cart/:cartId/items
PATCH /api/cart/:cartId/items/:itemId
DELETE /api/cart/:cartId/items/:itemId
```

### 5.3 订单接口

```http
POST /api/orders
GET /api/orders/:orderId
GET /api/admin/orders
PATCH /api/admin/orders/:orderId/status
```

下单请求：

```json
{
  "items": [
    { "productSlug": "product-slug", "quantity": 1 }
  ],
  "customer": {
    "name": "客户姓名",
    "email": "customer@example.com",
    "phone": "+1..."
  },
  "shippingAddress": {
    "country": "US",
    "state": "CA",
    "city": "Los Angeles",
    "line1": "Street address",
    "postalCode": "90001"
  },
  "notes": "定制 Logo / 数量 / 交期"
}
```

订单状态建议：

| 字段 | 可选值 |
|---|---|
| `status` | `pending`、`confirmed`、`cancelled`、`completed` |
| `paymentStatus` | `unpaid`、`authorized`、`paid`、`refunded`、`failed` |
| `fulfillmentStatus` | `unfulfilled`、`processing`、`shipped`、`delivered`、`returned` |

### 5.4 支付接口

建议接 Stripe、PayPal 或 SiteGround 可用的支付方案。前端不要保存卡号、CVV 等敏感卡数据。

```http
POST /api/payments/create-checkout-session
POST /api/payments/webhook
POST /api/refunds
```

支付创建请求：

```json
{
  "orderId": "ord_001",
  "successUrl": "https://oufanacc.com/checkout/success",
  "cancelUrl": "https://oufanacc.com/cart"
}
```

### 5.5 物流与运费接口

```http
POST /api/shipping/rates
POST /api/admin/shipments
GET /api/tracking/:trackingNumber
```

### 5.6 询价与定制接口

```http
POST /api/quotes
GET /api/admin/quotes
PATCH /api/admin/quotes/:quoteId
```

定制询价字段：姓名、邮箱、电话、公司、目标国家、数量、Logo 工艺、交期、预算、备注、附件。

### 5.7 会员与后台权限

```http
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
GET /api/admin/users
PATCH /api/admin/users/:userId/role
```

后台至少需要：登录、管理员角色、操作日志、密码重置、二次验证。

## 6. 数据库表建议

| 表 | 用途 |
|---|---|
| `products` | 商品主数据 |
| `product_images` | 商品图片 |
| `inventory_movements` | 库存流水 |
| `customers` | 客户信息 |
| `orders` | 订单主表 |
| `order_items` | 订单明细 |
| `payments` | 支付记录 |
| `shipments` | 发货与物流 |
| `quotes` | 定制询价 |
| `admin_users` | 后台用户 |
| `audit_logs` | 后台操作日志 |

## 7. 正式商用还需要准备什么

### 7.1 业务资料

- 公司主体信息：公司名、注册地址、联系电话、客服邮箱。
- 收款账户：Stripe/PayPal/银行账户，结算币种和税务资料。
- 商品资料：真实库存、SKU、规格、颜色、尺码、包装、起订量、批发价格阶梯。
- 图片版权：确认商品图、海报图、Logo、评价内容都有使用权。
- 客服流程：询价回复、订单确认、退换货处理、售后时效。

### 7.2 网站页面

- 隐私政策 `Privacy Policy`。
- 服务条款 `Terms of Service`。
- 退款/退货政策 `Refund & Return Policy`。
- 配送政策 `Shipping Policy`。
- 联系我们：邮箱、电话、公司地址或可公开的业务地址。
- Cookie / tracking 提示，特别是接入广告像素或统计工具后。

### 7.3 支付与安全

- 全站 HTTPS，包含 `www` 和非 `www` 域名。
- 使用第三方托管支付页或支付组件，不在自己服务器保存银行卡信息。
- 后台登录加 2FA，管理员操作留日志。
- 定期备份数据库和商品图片。
- 表单加验证码/限流，防止垃圾询盘。
- 重要接口加 CSRF / CORS / rate limit / 输入校验。

PCI SSC 说明 PCI DSS 用于保护存储、处理或传输支付账户数据的环境；凡涉及卡数据处理的商户、处理商、服务商都在相关范围内。因此正式收款建议用 Stripe/PayPal 托管支付，尽量降低自己系统接触卡数据的范围。

### 7.4 隐私与合规

- 收集姓名、邮箱、电话、地址前，要说明收集目的和使用方式。
- 隐私政策要写清楚：收集哪些数据、用途、共享对象、保存多久、用户如何请求访问/删除/更正。
- 如果面向加州消费者且达到 CCPA/CPRA 适用门槛，需要处理知情、删除、更正、拒绝出售或共享等权利；加州官方说明还要求在收集点或之前告知消费者收集信息类型和用途。
- 如果面向欧盟客户，需要考虑 GDPR 的合法处理依据、数据主体权利、跨境传输、最小化收集、数据泄露响应等要求。

### 7.5 税务与发票

- 确认销售地：美国州销售税、跨境出口、欧盟 VAT、进口税由谁承担。
- 结账页展示税费、运费、关税责任。
- 订单邮件和发票模板。
- 财务对账：订单金额、退款、手续费、汇率差。

### 7.6 物流与履约

- 选择物流商：USPS/UPS/FedEx/DHL/第三方仓。
- 设置运费规则：按国家、重量、数量、订单金额、批发订单单独报价。
- 物流追踪号同步到订单。
- 缺货、预售、定制周期说明。

### 7.7 SEO 与营销

- 配置 Google Search Console、Bing Webmaster Tools。
- 提交 `sitemap.xml` 和 `robots.txt`。
- 商品页补充结构化数据 Product schema。
- 接入 GA4 或其他统计前，先补隐私政策和 Cookie 说明。
- 设置品牌邮箱，例如 `support@oufanacc.com`。

### 7.8 运维

- 建立发布流程：本地构建、测试、上传、回滚。
- 保留最近 3 个版本的静态包。
- 监控首页、商品页、结账页是否可访问。
- 定期检查 SSL 证书、DNS、备份、依赖安全更新。

## 8. 推荐落地路线

### 第一阶段：低成本商用询盘版

适合先验证市场。

- 保留静态站点。
- 把结账改成询价/WhatsApp/邮件表单。
- 用 Formspree、Netlify Forms、Google Forms 或自建轻量 API 接收询盘。
- 不接在线支付，只人工报价。

### 第二阶段：真实订单版

适合开始收小额订单。

- 增加后端和数据库。
- 商品、库存、订单进入后台管理。
- 接 Stripe/PayPal 托管支付。
- 自动发送订单邮件。
- 支持订单查询和物流追踪。

### 第三阶段：完整电商版

适合持续运营。

- 多 SKU、多仓库、优惠码、会员账户。
- 批发阶梯价、定制报价流转、发票系统。
- CRM、邮件营销、广告转化追踪。
- 风控、退款、售后工单。

## 9. 参考资料

- PCI Security Standards Council: PCI DSS defines requirements for environments where payment account data is stored, processed, or transmitted; PCI scope includes merchants and service providers involved in payment card processing.
- California Attorney General CCPA page: privacy notices, privacy policy contents, right to know/delete/correct/opt out, and notice at collection requirements.
- European Commission GDPR business guidance: business obligations around personal data, individual rights, data protection by design/default, breach handling, and cross-border transfer questions.
