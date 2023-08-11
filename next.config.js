/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};
module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ogg|mp3|wav|mpe?g)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/sounds/",
            outputPath: "static/sounds/",
            name: "[name].[ext]",
          },
        },
      ],
    });

    return config;
  },
};
