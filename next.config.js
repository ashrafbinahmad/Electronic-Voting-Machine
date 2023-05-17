/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    LOCAL_STORAGE_ADMIN_PASS: process.env.LOCAL_STORAGE_ADMIN_PASS,
    LOCAL_STORAGE_EVM_PASS: process.env.LOCAL_STORAGE_EVM_PASS,
    LOCAL_STORAGE_PUBLIC_RESULTS_PASS: process.env.LOCAL_STORAGE_PUBLIC_RESULTS_PASS,
    API_KEY: process.env.API_KEY,
    AUTH_DOMAIN: process.env.AUTH_DOMAIN,
    PROJECT_ID: process.env.PROJECT_ID,
    APP_ID: process.env.APP_ID,

    
  },
  pwa: {
    dest: "public",
		register: true,
    disable: process.env.NODE_ENV === 'development',
		skipWaiting: true,
  },
  
}

module.exports = nextConfig
