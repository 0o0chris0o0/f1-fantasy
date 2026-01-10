<template>
  <div
    class="absolute z-10 h-full bg-black nav"
    :class="{ active: props.navOpen }"
  >
    <div class="p-6">
      <ul class="space-y-3">
        <li v-if="userLoggedIn">
          <div class="flex justify-between mb-4 -ml-1">
            <NuxtLink to="/profile" class="flex align-items-center">
              <img src="/img/user.svg" class="w-8 p-1" >
              <p class="ml-2 mt-1 font-f1 leading-tight">{{ user ? user.displayName : "User" }}</p>
            </NuxtLink>
            <div class="flex items-center">
              <img src="/img/coins.svg" class="w-5" >
              <p class="font-f1 font-semibold text-sm text-yellow-500 ml-1">{{ userStore.userFromStore?.money }}</p>
            </div>
          </div>
        </li>
        <li class="mt-3"><hr class="invisible my-3" ></li>
        <li>
          <NuxtLink :to="userLoggedIn ? '/home' : '/'" class="main-link">
            Home
          </NuxtLink>
        </li>
        <template v-if="userLoggedIn">
          <li>
            <NuxtLink to="/store" class="main-link">Store</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/packs" class="main-link flex items-center"
              >Packs<span
                v-if="userStore.userPacksCount"
                class="pack-notification"
                >{{ userStore.userPacksCount }}</span
              ></NuxtLink
            >
          </li>
          <li>
            <NuxtLink to="/my-cards" class="main-link">My Cards</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/collection" class="main-link">Collection</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/latest-results" class="main-link">Scores</NuxtLink>
          </li>
        </template>
        <template v-else>
          <li>
            <NuxtLink to="/signup" class="main-link">Get Started</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/login" class="main-link">Sign In</NuxtLink>
          </li>
        </template>
        <li class="mt-3"><hr class="invisible my-3" ></li>
        <li><NuxtLink to="/all-cards">All cards</NuxtLink></li>
        <li v-if="userLoggedIn">
          <button @click="logout">Logout</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signOut } from "firebase/auth";

const props = defineProps<{
  navOpen: boolean;
}>();
const emit = defineEmits(["toggleMenu"]);

const router = useRouter();
const route = useRoute();

const auth = useFirebaseAuth()!;
const user = useCurrentUser();

const userStore = useUserStore();

const userLoggedIn = computed(() => {
  return !!user.value?.uid;
});

watch(
  () => route.path,
  () => {
    if (props.navOpen) {
      emit("toggleMenu");
    }
  }
);

const logout = async () => {
  await signOut(auth);
  userStore.userFromStore = null;

  router.push("/");
};
</script>

<style lang="scss" scoped>
.nav {
  top: 0;
  right: 0;
  color: white;
  min-width: 200px;
  max-width: 280px;
}

.router-link-active {
  @apply opacity-40;
  @apply cursor-default;
  @apply underline;
}

li {
  a.main-link {
    @apply font-semibold;
    @apply text-xl;
    @apply tracking-wide;
  }
}

.pack-notification {
  @apply inline-block;
  @apply rounded-full;
  @apply bg-red-500;
  @apply w-6;
  @apply text-sm;
  @apply leading-6;
  @apply text-center;
  @apply ml-1;
}
</style>
