<template>
  <div
    class="bg-surface-lowest shadow-2xl border-l border-white/10 nav"
    :class="{ active: props.navOpen }"
  >
    <div class="p-8 h-full flex flex-col">
      <div class="flex justify-end mb-8">
        <button>
          <Icon
            name="bi:x"
            size="2em"
            class="text-xl text-primary"
            @click="$emit('toggleMenu')"
          />
        </button>
      </div>
      <ul
        class="space-y-6 font-headline uppercase tracking-tighter text-2xl text-white"
      >
        <li v-if="userLoggedIn">
          <div class="flex justify-between mb-4">
            <NuxtLink to="/profile" class="flex items-center">
              <Icon name="bi:person" size="1.5em" />
              <p class="ml-2 font-f1 leading-tight">{{ userDisplayName }}</p>
            </NuxtLink>
            <div class="flex items-center">
              <Icon name="bi:cash-coin" class="text-yellow-500" size="1.5em" />
              <p class="font-f1 font-semibold text-sm text-yellow-500 ml-1">
                {{ userMoney }}
              </p>
            </div>
          </div>
        </li>

        <li>
          <NuxtLink :to="userLoggedIn ? '/home' : '/'"> Home </NuxtLink>
        </li>
        <template v-if="userLoggedIn">
          <li>
            <NuxtLink to="/store">Store</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/packs" class="main-link flex items-center">
              Packs
              <span v-if="userStore.userPacksCount" class="pack-notification">
                {{ userStore.userPacksCount }}
              </span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/my-team">My Team</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/my-cards">My Cards</NuxtLink>
          </li>
          <li>
            <NuxtLink :to="`/results/${user?.uid}`">Results</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/collection">Collection</NuxtLink>
          </li>
        </template>
        <template v-else>
          <li>
            <NuxtLink to="/signup">Get Started</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/login">Sign In</NuxtLink>
          </li>
        </template>
        <li class="mt-3"><hr class="invisible my-3" /></li>
        <li v-if="userLoggedIn">
          <button @click="logout">Logout</button>
        </li>
      </ul>
      <div v-if="userLoggedIn" class="mt-auto pt-8 border-t border-white/5">
        <button
          class="flex items-center gap-3 text-mono tracking-widest"
          @click="logout"
        >
          <Icon name="material-symbols:logout" class="text-2xl" />
          LOGOUT
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signOut } from "firebase/auth";

const props = defineProps<{
  navOpen: boolean;
}>();
const emit = defineEmits(["toggleMenu"]);

const route = useRoute();
const auth = useFirebaseAuth()!;
const user = useCurrentUser();

const userStore = useUserStore();
const { userObj } = storeToRefs(userStore);

const userLoggedIn = computed(() => {
  return !!user.value?.uid;
});

const userDisplayName = computed(
  () => userObj.value?.displayName ?? "Loading...",
);
const userMoney = computed(() => userObj.value?.money ?? "—");

watch(
  () => route.path,
  () => {
    if (props.navOpen) {
      emit("toggleMenu");
    }
  },
);

const logout = async () => {
  await signOut(auth);
  userStore.userObj = undefined;

  emit("toggleMenu");

  navigateTo("/");
};
</script>

<style lang="scss" scoped>
.nav {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  color: white;
  width: clamp(280px, 80vw, 320px);
  z-index: 30;
  box-shadow: -12px 0 28px rgba(0, 0, 0, 0.35);
  transform: translate3d(100%, 0, 0);
  opacity: 0;
  pointer-events: none;
  transition:
    transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.18s ease;
  will-change: transform, opacity;
}

.nav.active {
  transform: translate3d(0, 0, 0);
  opacity: 1;
  pointer-events: auto;
}

.router-link-active {
  opacity: 0.4;
  cursor: default;
  text-decoration: underline;
}

.pack-notification {
  display: inline-block;
  border-radius: 9999px;
  background-color: #ef4444;
  width: 1.5rem;
  font-size: 0.875rem;
  line-height: 1.5rem;
  text-align: center;
  margin-left: 0.25rem;
}

@media (prefers-reduced-motion: reduce) {
  .nav {
    transition: none;
  }
}
</style>
