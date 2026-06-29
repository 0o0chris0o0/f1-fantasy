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
        <li>
          <NuxtLink :to="userLoggedIn ? '/home' : '/'"> Home </NuxtLink>
        </li>
        <template v-if="userLoggedIn">
          <li>
            <NuxtLink to="/store">Store</NuxtLink>
          </li>
          <li>
            <NuxtLink to="/packs" class="main-link flex items-center gap-3">
              Packs
              <span
                v-if="userStore.userPacksCount"
                class="bg-error rounded-full drop-shadow-[0_0_5px_#ff1801] text-sm font-headline font-bold w-6 leading-6 text-center"
              >
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

@media (prefers-reduced-motion: reduce) {
  .nav {
    transition: none;
  }
}
</style>
