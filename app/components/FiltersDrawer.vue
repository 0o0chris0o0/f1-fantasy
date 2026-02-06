<template>
  <div v-show="showFilters" class="fixed inset-0 z-40">
    <div class="absolute inset-0 bg-black/40" @click="$emit('update:showFilters', false)" />

    <aside
      id="cards-filters-drawer"
      role="dialog"
      aria-modal="true"
      class="absolute right-0 top-0 h-full w-80 bg-gray-800 p-4 shadow-lg transform transition-transform"
      :class="{ 'translate-x-0': showFilters, 'translate-x-full': !showFilters }"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-f1 text-lg">Filters</h3>
        <Button 
          @click="$emit('update:showFilters', false)" 
          aria-label="Close filters"
          size="small"
        >
          Close
        </Button>
      </div>

      <div class="space-y-4 text-gray-500">
        <div>
          <input
            :value="searchText"
            @input="onSearch"
            placeholder="Search driver or team"
            class="w-full px-3 py-2 border rounded"
          />
        </div>

        <div class="flex space-x-2">
          <select :value="selectedRarity" @change="onRarity" class="w-1/2 px-3 py-2 border rounded">
            <option value="ALL">All rarities</option>
            <option value="COMMON">Common</option>
            <option value="UNCOMMON">Uncommon</option>
            <option value="RARE">Rare</option>
            <option value="LEGENDARY">Legendary</option>
          </select>

          <select :value="selectedTeam" @change="onTeam" class="w-1/2 px-3 py-2 border rounded">
            <option value="ALL">All teams</option>
            <option v-for="team in teams" :key="team" :value="team">{{ team }}</option>
          </select>
        </div>

        <div class="flex space-x-2 items-center">
          <p>Sort by</p>
          <select 
            :value="sortBy" 
            @change="onSort"
            class="flex-1 px-3 py-2 border rounded"
          >
            <option value="rarity:desc,name">Rarity (Legendary First)</option>
            <option value="rarity:asc,name">Rarity (Common First)</option>
            <option value="name">Name (A-Z)</option>
            <option value="quantity:desc,rarity:desc,name">Quantity</option>
            <option value="level,rarity:desc,name">Level</option>
            <option value="points,rarity:desc,name">Fantasy Points</option>
          </select>
        </div>

        <div class="pt-2 border-t">
          <Button @click="onReset" size="small">Reset</Button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  showFilters: boolean;
  searchText: string;
  selectedRarity: string;
  selectedTeam: string;
  sortBy: string;
  teams: string[];
}>();

const emit = defineEmits<{
  (e: 'update:showFilters', value: boolean): void;
  (e: 'update:searchText', value: string): void;
  (e: 'update:selectedRarity', value: string): void;
  (e: 'update:selectedTeam', value: string): void;
  (e: 'update:sortBy', value: string): void;
  (e: 'toggleSortOrder'): void;
  (e: 'reset'): void;
}>();

const onSearch = (e: Event) => {
  const v = (e.target as HTMLInputElement)?.value ?? '';
  emit('update:searchText', v);
};

const onRarity = (e: Event) => {
  const v = (e.target as HTMLSelectElement)?.value ?? 'ALL';
  emit('update:selectedRarity', v);
};

const onTeam = (e: Event) => {
  const v = (e.target as HTMLSelectElement)?.value ?? 'ALL';
  emit('update:selectedTeam', v);
};

const onSort = (e: Event) => {
  const v = (e.target as HTMLSelectElement)?.value ?? 'name';
  emit('update:sortBy', v);
};

const onReset = () => emit('reset');
</script>

<style scoped lang="scss">
.card-size {
  span {
    display: inline-block;
    width: 10px;
    height: 16px;
    border-radius: 3px;
    border: 2px solid white;
  }
}
</style>
