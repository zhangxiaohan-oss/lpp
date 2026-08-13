import "./globals.css";
import { PageContentProvider } from "./components";
import { readPublishedPageContent } from "./page-content-server";

export const metadata = {
  title: "草帽品牌展示站",
  description: "草帽品牌展示站，支持多页面商品展示、人民币价格、收藏、对比、购物车和定制咨询演示。"
};

export default async function RootLayout({ children }) {
  const initialPageContent = await readPublishedPageContent();

  return (
    <html lang="zh-CN">
      <body>
        <PageContentProvider initialContent={initialPageContent}>{children}</PageContentProvider>
      </body>
    </html>
  );
}
