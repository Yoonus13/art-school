
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "캡스톤 디자인 운영 대시보드",
  description: "대학별 캡스톤 디자인 이수학생 및 지원금 운영 현황",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
