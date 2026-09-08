<template>
  <UApp>
    <NuxtLoadingIndicator
      color="repeating-linear-gradient(to right, var(--color-primary-container) 0%, var(--color-primary) 50%, var(--color-secondary) 100%)"
    />
    <div
      class="min-h-dvh w-full bg-neutral text-white"
      :class="{ 'menu-open': navOpen }"
    >
      <div
        class="relative min-h-dvh bg-surface w-full flex flex-col content-container"
        :class="[`page-${makeCssSafe(route.path)}`]"
      >
        <header
          class="bg-surface border-b border-white/10 shadow-[0_0_20px_rgba(255,180,167,0.1)] flex items-center p-4 z-10"
        >
          <NuxtLink :to="user ? '/home' : '/'" class="w-16">
            <NuxtImg
              src="/img/logo-2.png"
              alt="F1 Pick6 logo"
              width="400"
              height="206"
              class="mr-2"
            />
          </NuxtLink>
          <div class="ml-auto flex items-center gap-4">
            <div v-if="user" class="flex items-center gap-4">
              <NuxtLink :to="'/account'">
                <Icon
                  name="bi:person-circle"
                  class="text-on-surface"
                  size="1.5em"
                />
              </NuxtLink>
              <div class="flex items-center gap-2">
                <Icon
                  name="bi:cash-coin"
                  class="text-secondary mt-1"
                  size="1.2em"
                />
                <p class="font-f1 font-bold text-secondary text-lg">
                  {{ userMoney }}
                </p>
              </div>
            </div>
            <NavButton :nav-open="navOpen" @toggle-menu="toggleMenu" />
          </div>
        </header>
        <main class="w-full max-w-lg mx-auto flex-1 flex flex-col">
          <div
            v-if="userDataPending"
            class="flex-1 flex items-center justify-center"
          >
            <Loader />
          </div>
          <div v-show="!userDataPending" class="flex-1 flex flex-col min-h-0">
            <NuxtPage />
          </div>
        </main>
      </div>
      <button
        aria-label="Close navigation menu"
        class="menu-backdrop fixed inset-0 backdrop-blur-sm bg-surface-lowest/70 z-10 transition-opacity duration-200 opacity-0 pointer-events-none"
        :class="{ active: navOpen }"
        @click="closeMenu"
      ></button>
      <Nav :nav-open="navOpen" @toggle-menu="toggleMenu" />
      <Loader v-if="navigationIsSlow" />
    </div>
  </UApp>
</template>

<script lang="ts" setup>
const user = useCurrentUser();
const userStore = useUserStore();
const route = useRoute();
const nuxtApp = useNuxtApp();
const { visible: isPageVisible } = usePageVisibility();

const { userDataPending, userObj } = storeToRefs(userStore);

const navOpen = ref(false);
const wasPageVisible = ref(true); // Track previous visibility state

const userMoney = computed(() => userObj.value?.money ?? 0);

const toggleMenu = () => {
  navOpen.value = !navOpen.value;
};

const closeMenu = () => {
  navOpen.value = false;
};

// the old page stays on screen while the next one's chunk, middleware and data
// resolve, so cover it once that wait is long enough to look like a dead tap
const SLOW_NAVIGATION_MS = 350;
const navigationIsSlow = ref(false);
let slowNavigationTimer: ReturnType<typeof setTimeout> | undefined;

const hideNavigationLoader = () => {
  clearTimeout(slowNavigationTimer);
  navigationIsSlow.value = false;
};

const unhookNavigationLoader = [
  nuxtApp.hook('page:loading:start', () => {
    // the initial page load has its own loading state
    if (nuxtApp.isHydrating) return;

    slowNavigationTimer = setTimeout(() => {
      navigationIsSlow.value = true;
    }, SLOW_NAVIGATION_MS);
  }),
  nuxtApp.hook('page:loading:end', hideNavigationLoader),
  // a navigation that dies part way through must never leave the loader stuck up
  nuxtApp.hook('vue:error', hideNavigationLoader),
  nuxtApp.hook('app:error', hideNavigationLoader),
];

watch(navOpen, (isOpen) => {
  if (!import.meta.client) return;

  document.documentElement.style.overflow = isOpen ? 'hidden' : '';
});

watch(isPageVisible, (currentlyVisible) => {
  // Only refresh if page became visible AND was previously hidden
  // This skips the initial load when page is already visible
  if (currentlyVisible && !wasPageVisible.value && user.value) {
    userStore.refreshUserData();
  }
  wasPageVisible.value = currentlyVisible;
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  document.documentElement.style.overflow = '';

  clearTimeout(slowNavigationTimer);
  for (const unhook of unhookNavigationLoader) unhook();
});
</script>

<style lang="scss" scoped>
.content-container {
  background-image: radial-gradient(
    circle at 2px 2px,
    rgba(255, 255, 255, 0.05) 1px,
    transparent 0
  );
  background-size: 32px 32px;

  &.page-open-pack {
    --bg-gradient: url('/img/surface.avif');
    background-size: 200px;
  }
}

.menu-backdrop.active {
  opacity: 1;
  pointer-events: auto;
}

.menu-open .content-container {
  box-shadow: inset -10px 0 10px rgba(0, 0, 0, 0.15);
}

@media (prefers-reduced-motion: reduce) {
  .menu-backdrop,
  .content-container {
    transition: none;
  }
}
</style>
