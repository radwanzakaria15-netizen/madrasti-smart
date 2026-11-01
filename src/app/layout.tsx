import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "مَدْرَسَتي الذكية | منصة التعلم",
  description: "منصة تعليمية ذكية للمرحلة الابتدائية بإشراف الأستاذ"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
