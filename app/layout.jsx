import "./globals.css";

export const metadata = {
  title: "草帽品牌展示站",
  description: "草帽品牌展示站，支持多页面商品展示、人民币价格、收藏、对比、购物车和定制咨询演示。"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
