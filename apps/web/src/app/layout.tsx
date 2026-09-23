import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motoraconect",
  description: "Vehicle marketplace for buying and selling vehicles.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
