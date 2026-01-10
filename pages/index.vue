<template>
  <div class="min-h-screen w-full bg-black text-white">
    <div
      ref="contentContainer"
      class="relative min-h-screen w-full flex flex-col z-20 content-container pb-6"
      :class="{ active: navOpen }"
    >
      <header class="flex items-center p-4 shadow-sm z-10">
        <NuxtLink :to="user ? '/home' : '/'">
          <p class="text-4xl font-f1"><span>F1</span>Pick<span>Em</span></p>
        </NuxtLink>
        <div class="ml-auto">
          <NavButton :nav-open="navOpen" @toggle-menu="toggleMenu" />
        </div>
      </header>
      <main class="w-full max-w-lg mx-auto flex-1 flex flex-col p-4">
        <div v-if="showRedirectMessage" class="bg-orange-500 rounded mb-4">
          <p class="text-sm p-3">
            The page you were trying to visit requires you to login!
          </p>
        </div>
        <NuxtPage />
        <NotificationContainer />
      </main>
    </div>
    <Nav ref="nav" :nav-open="navOpen" @toggle-menu="toggleMenu" />
  </div>
</template>

<script lang="ts" setup>
import type { ComponentPublicInstance } from "vue";

// Components
import Loader from "../components/Loader.vue";

const user = useCurrentUser();

const router = useRouter();
const route = useRoute();

console.log(user.value);

const nav = ref<ComponentPublicInstance | null>(null);
const contentContainer = ref<HTMLElement | null>(null);
const navOpen = ref(false);
const navWidth = ref(0);
const showRedirectMessage = ref(false);

// const userStore = useUserStore();

// if (user.value && !userStore.userFromStore) {
//   userStore.getUserForStore();
// }

if (route.query.redirect) {
  showRedirectMessage.value = true;
}

onMounted(() => {
  const navComp = nav.value;
  if (navComp && navComp.$el) {
    navWidth.value = navComp.$el.clientWidth;
  }
});

const toggleMenu = () => {
  navOpen.value = !navOpen.value;

  const contentContainerElem = contentContainer.value;
  if (contentContainerElem) {
    contentContainerElem.style.left = `-${
      navOpen.value ? navWidth.value : 0
    }px`;
  }
};

// watch([() => route.path, () => route.query], () => {
//   if (route.query.redirect) {
//     showRedirectMessage.value = true;
//     toggleMenu();
//   } else if (showRedirectMessage.value) {
//     showRedirectMessage.value = false;
//   }
// });

// watch(user, async (currentUser, previousUser) => {
//   // redirect to login if they logout and the current route is only for authenticated users
//   if (
//     !currentUser &&
//     previousUser &&
//     (Array.isArray(route.meta.middleware)
//       ? route.meta.middleware.includes("authenticated")
//       : route.meta.middleware === "authenticated")
//   ) {
//     return router.push({ name: "login" });
//   }
//   // redirect the user if they are logged in but were rejected because the user wasn't ready yet
//   if (currentUser && typeof route.query.redirect === "string") {
//     return router.push(route.query.redirect);
//   }
//   // update user info
//   if (currentUser && !userStore.userFromStore) {
//     userStore.getUserForStore();
//   }
// });
</script>

<style lang="scss" scoped>
.content-container {
  box-shadow: 1px 5px 6px 4px rgba(0, 0, 0, 0.3);
  transition: left 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
  left: 0;

  background: linear-gradient(
    300deg,
    rgba(2, 12, 56, 1) 0%,
    rgba(1, 8, 25, 1) 100%
  );

  &.active {
    transition: left 0.4s cubic-bezier(0.68, 0, 0.265, 1.55);
  }
}
</style>
