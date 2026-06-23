import "./globals.css";

export const metadata = {
  title: "LPP 草帽店",
  description: "LPP 草帽店 Next.js 单页电商展示。"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
