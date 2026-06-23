import "./globals.css";

export const metadata = {
  title: "LPP 草帽店",
  description: "LPP 草帽店 Next.js 多页面电商展示站，支持人民币价格、收藏、对比、购物车和定制咨询演示。"
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
