<template>
  <!-- Background Asset -->
  <div class="absolute w-full h-screen left-0 z-0">
    <NuxtImg
      alt="F1 Pick6 background"
      class="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000 scale-105"
      src="/img/homepage-bg.png"
    />
    <div
      class="absolute inset-0 bg-linear-to-t from-background via-transparent to-background/50"
    ></div>
    <div class="absolute inset-0 carbon-pattern opacity-10"></div>
  </div>

  <!-- Main Content -->
  <div class="relative z-10">
    <h1 class="text-center text-2xl font-bold mt-8 font-f1 text-white">
      WELCOME TO F1 PICK 6
    </h1>
    <NuxtImg
      alt="F1 Pick6 logo"
      class="mx-auto w-48 my-4"
      src="/img/logo.png"
    />
    <p
      class="text-lg text-primary-on-surface max-w-2xl mb-8 border-l-2 border-primary pl-6 leading-relaxed"
    >
      The ultimate fantasy racing experience! Collect your favorite drivers and
      teams, and build out your team to compete against friends and the global
      community for ultimate glory.
    </p>
    <div class="text-center">
      <NuxtLink to="/signup">
        <Button size="lg">GET STARTED</Button>
      </NuxtLink>
    </div>
    <div class="text-center mt-20 mb-4">
      <h2
        class="font-headline text-lg font-bold text-white mb-1 tracking-tighter uppercase"
      >
        How to play?
      </h2>
      <div class="w-24 h-1 bg-primary mx-auto"></div>
    </div>

    <div>
      <div v-for="i in text">
        <div class="flex flex-col items-center gap-8 mb-12" :key="i.title">
          <div>
            <NuxtImg
              :src="i.image"
              alt="F1 Pick6 background"
              class="w-full h-full object-cover rounded-lg shadow-lg"
            />
          </div>
          <div class="text-center">
            <p class="text-xl mb-4 font-headline text-white">
              {{ i.title }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  linkTitle: "Home",
});

const text = [
  {
    title: "Collect your favorite drivers and teams",
    image: "https://placeholdit.com/600/dddddd/999999",
  },
  {
    title: "Build your fantasy team each race",
    image: "https://placeholdit.com/600/dddddd/999999",
  },
  {
    title:
      "Compete against friends and the global community for ultimate glory.",
    image: "https://placeholdit.com/600/dddddd/999999",
  },
];
</script>
