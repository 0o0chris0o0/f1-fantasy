import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  ssr: false,

  // routeRules: {
  //   // Homepage pre-rendered at build time
  //   '/': { prerender: true },
  //   // Client side routes
  //   '/home': { ssr: false },
  //   '/store': { ssr: false },
  // },

  app: {
    head: {
      title: "F1 Pick 6",
      meta: [{ name: "description", content: "F1 Pick 6" }],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:ital,wght@0,100..900;1,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Space+Grotesk:wght@300..700&display=swap",
        },
      ],
    },
  },

  css: ["./app/assets/css/main.css"],

  vite: {
    plugins: [tailwindcss()],
  },

  build: {
    transpile: ["@f1pick6/shared"],
  },

  nitro: {
    preset: "netlify",
  },

  modules: ["nuxt-vuefire", "@pinia/nuxt", "@nuxt/ui", "@nuxt/image"],

  icon: {
    mode: "svg",
    cssLayer: "base",
  },

  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: true, // Recommended for SSR
    },
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
    },
  },
});
