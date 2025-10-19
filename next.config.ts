import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Вмикаємо standalone-вивід для продакшн-запуску в Docker
  // Це створить .next/standalone/server.js, який запускаємо в рантайм-стейджі контейнера
  output: "standalone",
};

export default nextConfig;
