<template>
  <main class="text-center">
    <h1 class="font-headline text-3xl mb-4">Welcome to F1 Pick 6</h1>
    <p class="text-lg mb-8 text-gray-300 leading-tight">
      The ultimate digital fantasy racing experience for Formula 1 fans.
    </p>
    <div class="flex flex-col gap-8 leading-tight mb-4">
      <div v-for="(item, index) in text" :key="index">
        <p class="text-xl mb-1">
          <span class="font-bold">{{ index + 1 }}.</span>
          {{ item.title }}
        </p>
        <NuxtImg
          :src="item.image"
          :alt="item.title"
          width="800"
          height="400"
          class="mx-auto"
        />
      </div>
    </div>
    <div>
      <NuxtLink to="/signup">
        <Button version="green">Get Started</Button>
      </NuxtLink>
    </div>
  </main>
</template>

<script lang="ts" setup>
definePageMeta({
  linkTitle: "Home",
});

const text = [
  {
    title: "Collect your favorite drivers and teams",
    image: "/img/index-1.png",
  },
  {
    title: "Build your fantasy team each race",
    image: "/img/index-2.png",
  },
  {
    title:
      "Compete against friends and the global community for ultimate glory.",
    image: "https://placeholdit.com/400/dddddd/999999",
  },
];
</script>
