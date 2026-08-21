<template>
  <UDrawer
    :open="showFilters"
    direction="right"
    :ui="{ content: 'w-80 max-w-[calc(100vw-1rem)]' }"
    @update:open="emit('update:showFilters', $event)"
  >
    <template #content>
      <aside
        id="cards-filters-drawer"
        role="dialog"
        aria-modal="true"
        class="h-full w-full overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-headline text-xl font-semibold">Filters</h3>
          <button
            @click="emit('update:showFilters', false)"
            aria-label="Close filters"
          >
            <Icon name="material-symbols:close" class="text-2xl" />
          </button>
        </div>

        <div class="space-y-4 text-gray-500">
          <div>
            <UInput
              :value="searchText"
              @input="onSearch"
              placeholder="Search driver or team"
              size="lg"
              icon="bi:search"
            />
          </div>

          <div class="flex space-x-2">
            <USelect
              :model-value="selectedRarity"
              value-key="id"
              :items="rarityOptions"
              size="lg"
              @update:model-value="onRarity"
            />

            <USelect
              :model-value="selectedTeam"
              value-key="id"
              :items="teamOptions"
              size="lg"
              @update:model-value="onTeam"
            />
          </div>

          <div class="">
            <p class="font-headline font-semibold text-lg mb-1">Sort by</p>
            <USelect
              v-model="sortByValue"
              value-key="id"
              @change="onSort"
              :items="sortOptions"
              class="w-full"
              size="lg"
            >
            </USelect>
          </div>

          <div class="pt-4 border-t border-on-surface-variant/30 text-center">
            <Button @click="onReset" size="sm" version="normal">Reset</Button>
          </div>
        </div>
      </aside>
    </template>
  </UDrawer>
</template>

<script setup lang="ts">
import type { SelectItem } from "@nuxt/ui";

const props = defineProps<{
  showFilters: boolean;
  searchText: string;
  selectedRarity: string;
  selectedTeam: string;
  sortBy: string;
  teams: string[];
  sortOptions?: SelectItem[];
}>();

const sortByValue = ref(props.sortBy);

const rarityOptions: SelectItem[] = [
  { id: "ALL", label: "All rarities" },
  { id: "COMMON", label: "Common" },
  { id: "UNCOMMON", label: "Uncommon" },
  { id: "RARE", label: "Rare" },
  { id: "LEGENDARY", label: "Legendary" },
];

const teamOptions = computed<SelectItem[]>(() => [
  { id: "ALL", label: "All teams" },
  ...props.teams.map((team) => ({ id: team, label: team })),
]);

const defaultSortOptions: SelectItem[] = [
  { id: "rarity:desc,points:desc,name", label: "Rarity (Legendary First)" },
  { id: "rarity:asc,points:desc,name", label: "Rarity (Common First)" },
  { id: "name", label: "Name (A-Z)" },
  { id: "quantity:desc,rarity:desc,name", label: "Quantity" },
  { id: "level:desc,rarity:desc,name", label: "Level" },
  { id: "points:desc,rarity:desc,name", label: "Fantasy Points" },
];

const sortOptions = computed(() => props.sortOptions || defaultSortOptions);

const emit = defineEmits<{
  (e: "update:showFilters", value: boolean): void;
  (e: "update:searchText", value: string): void;
  (e: "update:selectedRarity", value: string): void;
  (e: "update:selectedTeam", value: string): void;
  (e: "update:sortBy", value: string): void;
  (e: "toggleSortOrder"): void;
  (e: "reset"): void;
}>();

const onSearch = (e: Event) => {
  const v = (e.target as HTMLInputElement)?.value ?? "";
  emit("update:searchText", v);
};

const onRarity = (value: string) => {
  emit("update:selectedRarity", value);
};

const onTeam = (value: string) => {
  emit("update:selectedTeam", value);
};

const onSort = () => {
  emit("update:sortBy", sortByValue.value);
};

const onReset = () => emit("reset");
</script>
