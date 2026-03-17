import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@mediapipe/face_mesh": "./lib/stubs/face_mesh.js",
    },
  },

  webpack: (config) => {
    config.externals = config.externals || [];

    if (Array.isArray(config.externals)) {
      config.externals.push("@mediapipe/face_mesh");
    } else {
      config.externals["@mediapipe/face_mesh"] = "@mediapipe/face_mesh";
    }

    config.resolve.alias = {
      ...config.resolve.alias,
      "@mediapipe/face_mesh": false,
    };

    return config;
  },
};

export default nextConfig;
