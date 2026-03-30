<template>
  <div v-if="userObj">
    <div class="grid grid-cols-12 px-4 mb-6 first:items-center">
      <PageHeader class="col-span-6 col-start-4"> Store </PageHeader>
      <div class="col-span-3 flex items-center justify-end">
        <Icon name="bi:cash-coin" class="text-yellow-500" size="1.5em" />
        <p class="font-f1 font-semibold text-lg text-yellow-500 ml-2">{{ userObj.money }}</p>
      </div>
    </div>

    <div class="flex gap-3 mb-6 border-b border-gray-700">
      <button 
        v-for="mode in viewModes"
        :key="mode"
        class="p-2 text-left"
        :class="{
          'border-b-2': currentViewMode === mode
        }"
        @click="toggleViewMode(mode)"
      >
        {{ toTitleCase(mode.replace('-', ' ')) }}
      </button>
    </div>

    <StoreDailyDeals v-if="currentViewMode === 'daily-deals'"/>
    <StorePacks v-if="currentViewMode === 'packs'"/>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();

const { userObj } = storeToRefs(userStore);

definePageMeta({
  middleware: "auth",
});

const viewModes = ['packs', 'daily-deals'] as const;
type ViewMode = (typeof viewModes)[number];

const currentViewMode = useState<ViewMode>('viewMode', () => 'packs');

const toggleViewMode = (mode: ViewMode) => {
  currentViewMode.value = mode;
}
</script>

<style lang="scss" scoped>
</style>
