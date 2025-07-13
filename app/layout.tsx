import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="bg-gray-700 flex justify-center w-full">{children}</body>
    </html>
  );
}
