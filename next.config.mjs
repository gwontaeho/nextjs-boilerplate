/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    async rewrites() {
        return [
            {
                source: "/naver/:path*",
                destination: "https://openapi.naver.com/:path*",
            },
            {
                source: "/mega/:path*",
                destination: "https://www.mega-mgccoffee.com/store/find/:path*",
            },
        ];
    },
};

export default nextConfig;
