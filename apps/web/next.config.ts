import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  typedRoutes: false,
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
