<template>
  <UApp>
    <div
      class="min-h-screen w-full bg-neutral text-white"
      :class="{ 'menu-open': navOpen }"
    >
      <div
        class="relative min-h-screen bg-surface w-full flex flex-col pb-6 content-container"
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
          <div class="ml-auto flex items-center gap-6">
            <div class="flex items-center gap-2">
              <Icon
                name="bi:person-circle"
                class="text-on-surface"
                size="1.5em"
              />
              <p class="font-headline font-bold text-xl text-on-surface">
                {{ userDisplayName }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <Icon name="bi:cash-coin" class="text-secondary" size="1.5em" />
              <p class="font-mono font-bold text-secondary text-lg">
                {{ userMoney }}
              </p>
            </div>
          </div>
          <div class="ml-4">
            <NavButton :nav-open="navOpen" @toggle-menu="toggleMenu" />
          </div>
        </header>
        <main class="w-full max-w-lg mx-auto flex-1 flex flex-col p-4">
          <div
            v-if="userDataPending"
            class="flex-1 flex items-center justify-center"
          >
            <Loader />
          </div>
          <div v-show="!userDataPending">
            <NuxtPage />
          </div>
          <NotificationContainer />
        </main>
      </div>
      <button
        aria-label="Close navigation menu"
        class="menu-backdrop fixed inset-0 backdrop-blur-sm bg-surface-lowest/70 z-10 transition-opacity duration-200 opacity-0 pointer-events-none"
        :class="{ active: navOpen }"
        @click="closeMenu"
      ></button>
      <Nav :nav-open="navOpen" @toggle-menu="toggleMenu" />
    </div>
  </UApp>
</template>

<script lang="ts" setup>
const user = useCurrentUser();
const userStore = useUserStore();
const { userDataPending, userObj } = storeToRefs(userStore);
const route = useRoute();

const navOpen = ref(false);

const toggleMenu = () => {
  navOpen.value = !navOpen.value;
};

const closeMenu = () => {
  navOpen.value = false;
};

const userDisplayName = computed(() => userObj.value?.displayName ?? "");
const userMoney = computed(() => userObj.value?.money ?? 0);

watch(navOpen, (isOpen) => {
  if (!import.meta.client) return;

  document.documentElement.style.overflow = isOpen ? "hidden" : "";
});

onBeforeUnmount(() => {
  if (!import.meta.client) return;
  document.documentElement.style.overflow = "";
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
    --bg-gradient: url("/img/surface.avif");
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
