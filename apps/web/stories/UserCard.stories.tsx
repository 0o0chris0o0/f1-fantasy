import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { iCardRarity } from "@f1pick6/shared/types";
import type { iConstructorCard, iDriverCard } from "@f1pick6/shared/types";
import Card from "../app/components/Card.vue";
import UserCard from "../app/components/UserCard.vue";
import { mockDriverCards } from "../app/utils/__mocks__/mockDriverCards.ts";
import { mockConstructorCards } from "../app/utils/__mocks__/mockConstructorCards.ts";

const baseDriverCard = {
  ...mockDriverCards[0]!,
  stats: {
    ...mockDriverCards[0]!.stats,
    currentFantasyPoints: 84,
    averageFantasyPoints: 78,
    numberOfDNFs: 2,
  },
} satisfies iDriverCard;

const baseConstructorCard = {
  ...mockConstructorCards[0]!,
  stats: {
    ...mockConstructorCards[0]!.stats,
    currentFantasyPoints: 84,
    averageFantasyPoints: 78,
    numberOfDNFs: 2,
  },
} satisfies iConstructorCard;

const meta: Meta<typeof UserCard> = {
  title: "Components/UserCard",
  component: UserCard,
  subcomponents: { Card },
  tags: ["autodocs"],
  args: {
    card: baseDriverCard,
    rarity: iCardRarity.LEGENDARY,
    level: 1,
    quantity: 2,
    inCollection: true,
    inTeam: false,
    hideUserData: false,
    hideCardScore: false,
    isNew: true,
  },
  argTypes: {
    rarity: {
      control: "select",
      options: Object.values(iCardRarity),
    },
    card: {
      control: false,
    },
  },
};

export default meta;

type Story = StoryObj<typeof UserCard>;

export const Default: Story = {
  render: (args) => ({
    components: { UserCard, Card },
    setup() {
      return { args };
    },
    template: '<div class="m-6 bg-slate-900"><UserCard v-bind="args" /></div>',
  }),
};

export const Constructor: Story = {
  args: {
    card: baseConstructorCard,
    rarity: iCardRarity.RARE,
  },
  render: (args) => ({
    components: { UserCard, Card },
    setup() {
      return { args };
    },
    template: '<div class="m-6 bg-slate-900"><UserCard v-bind="args" /></div>',
  }),
};
