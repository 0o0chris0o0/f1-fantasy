<template>
  <UModal class="w-full">
    <template #content>
      <div v-if="pack" class="bg-surface-container-highest p-3 text-white">
        <div class="mb-4">
          <p class="font-f1 text-2xl font-bold text-center">
            {{ pack.packName }}
          </p>
          <p class="font-mono font-bold text-sm text-center">
            Includes {{ pack.cardsIncluded }} card{{
              pack.cardsIncluded > 1 ? "s" : ""
            }}
          </p>
        </div>

        <div class="space-y-4">
          <section
            class="rounded-xl border border-white/10 bg-surface-container-high/70 p-3"
          >
            <div class="mb-2 flex items-center justify-between text-primary">
              <p class="uppercase font-mono text-xs">Fixed slots</p>
              <p class="font-mono text-[11px] text-white/60">
                {{ fixedSlots.length }} slot{{
                  fixedSlots.length === 1 ? "" : "s"
                }}
              </p>
            </div>

            <div v-if="fixedSlots.length" class="grid grid-cols-2 gap-2">
              <div
                v-for="[slotIndex, slot] in fixedSlots"
                :key="slotIndex"
                :class="getBorderClass(slot.forcedRarity)"
                class="rounded-xl border bg-surface-container-high p-2"
              >
                <p
                  class="mb-1 uppercase font-mono text-[10px] tracking-wider text-white/60"
                >
                  Card {{ slotIndex }}
                </p>
                <p
                  :class="[
                    getRarityClass(slot.forcedRarity),
                    'font-headline font-semibold text-sm',
                  ]"
                >
                  {{ getRarityLabel(slot.forcedRarity) }}
                </p>
              </div>
            </div>

            <p v-else class="font-mono text-sm text-white/60">
              No fixed-rarity slots
            </p>
          </section>

          <section
            class="rounded-xl border border-white/10 bg-surface-container-high/70 p-3"
          >
            <div class="mb-2 flex items-center justify-between text-primary">
              <p class="uppercase font-mono text-xs">Weighted slots</p>
              <p class="font-mono text-[11px] text-white/60">
                {{ weightedSlots.length }} slot{{
                  weightedSlots.length === 1 ? "" : "s"
                }}
              </p>
            </div>

            <div v-if="weightedSlots.length" class="grid grid-cols-2 gap-2">
              <div
                v-for="[slotIndex, slot] in weightedSlots"
                :key="slotIndex"
                :class="getBorderClass(getPrimaryRarity(slot))"
                class="rounded-xl border bg-surface-container-high p-2"
              >
                <p
                  class="mb-2 uppercase font-mono text-[10px] tracking-wider text-white/60"
                >
                  Card {{ slotIndex }}
                </p>
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="chance in getWeightedRarityEntries(slot)"
                    :key="chance.label"
                    :class="chance.className"
                    class="rounded-full bg-black/20 px-2 py-0.5 text-xs font-headline font-semibold"
                  >
                    {{ chance.value }}% {{ chance.label }}
                  </span>
                </div>
              </div>
            </div>

            <p v-else class="font-mono text-sm text-white/60">
              No weighted slots
            </p>
          </section>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { iPack, iSlot } from "@f1pick6/shared/types";
import { iCardRarity } from "@f1pick6/shared/types";

const props = defineProps<{
  pack?: iPack | null;
}>();

const packSlots = computed(() => Object.entries(props.pack?.slots ?? {}));

const fixedSlots = computed(() =>
  packSlots.value.filter(([, slot]) => Boolean(slot.forcedRarity)),
);

const weightedSlots = computed(() =>
  packSlots.value.filter(([, slot]) => !slot.forcedRarity),
);

function getRarityClass(rarity: iCardRarity | null) {
  return {
    "text-common": rarity === iCardRarity.COMMON,
    "text-uncommon": rarity === iCardRarity.UNCOMMON,
    "text-rare": rarity === iCardRarity.RARE,
    "text-legendary": rarity === iCardRarity.LEGENDARY,
    "text-mythic": rarity === iCardRarity.MYTHIC,
  };
}

function getRarityLabel(rarity: iCardRarity | null) {
  if (!rarity) {
    return "Unknown";
  }

  return rarity
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (char) => char.toUpperCase());
}

function getBorderClass(rarity: iCardRarity | null) {
  return {
    "border-common": rarity === iCardRarity.COMMON,
    "border-uncommon": rarity === iCardRarity.UNCOMMON,
    "border-rare": rarity === iCardRarity.RARE,
    "border-legendary": rarity === iCardRarity.LEGENDARY,
    "border-mythic": rarity === iCardRarity.MYTHIC,
  };
}

function getPrimaryRarity(slot: iSlot) {
  const entries = [
    [iCardRarity.COMMON, slot.rarityChances[iCardRarity.COMMON]],
    [iCardRarity.UNCOMMON, slot.rarityChances[iCardRarity.UNCOMMON]],
    [iCardRarity.RARE, slot.rarityChances[iCardRarity.RARE]],
    [iCardRarity.LEGENDARY, slot.rarityChances[iCardRarity.LEGENDARY]],
    [iCardRarity.MYTHIC, slot.rarityChances[iCardRarity.MYTHIC]],
  ] as const;

  const highest = entries.reduce((current, entry) => {
    if (entry[1] > current[1]) {
      return entry;
    }

    return current;
  });

  return highest[0];
}

function getWeightedRarityEntries(slot: iSlot) {
  const chances = [
    {
      label: "Common",
      value: slot.rarityChances[iCardRarity.COMMON],
      className: "text-common",
    },
    {
      label: "Uncommon",
      value: slot.rarityChances[iCardRarity.UNCOMMON],
      className: "text-uncommon",
    },
    {
      label: "Rare",
      value: slot.rarityChances[iCardRarity.RARE],
      className: "text-rare",
    },
    {
      label: "Legendary",
      value: slot.rarityChances[iCardRarity.LEGENDARY],
      className: "text-legendary",
    },
    {
      label: "Mythic",
      value: slot.rarityChances[iCardRarity.MYTHIC],
      className: "text-mythic",
    },
  ];

  return chances.filter((chance) => chance.value > 0);
}
</script>

<style scoped></style>

<style lang="scss" scoped>
.rarity-grid {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
}
</style>
