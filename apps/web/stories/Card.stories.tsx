import type { Meta, StoryObj } from "@storybook/vue3-vite";
import { iCardRarity } from "@f1pick6/shared/types";
import type { iConstructorCard, iDriverCard } from "@f1pick6/shared/types";
import Card from "../app/components/Card.vue";
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

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
  args: {
    card: baseDriverCard,
    rarity: iCardRarity.LEGENDARY,
    disableModal: false,
    hideCardScore: false,
    userDetails: undefined,
  },
  argTypes: {
    rarity: {
      control: "select",
      options: Object.values(iCardRarity),
    },
    disableModal: {
      control: "boolean",
    },
    hideCardScore: {
      control: "boolean",
    },
    card: {
      control: false,
    },
    userDetails: {
      control: "object",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Card>;

export const Default: Story = {};

export const Constructor: Story = {
  args: {
    card: baseConstructorCard,
    rarity: iCardRarity.RARE,
  },
};

export const NumerousSizes: Story = {
  render: (args) => ({
    components: { Card },
    setup() {
      return { args };
    },
    template: `
    <div className="flex flex-wrap gap-4">
      <div className="w-[99px]"><Card v-bind="args" /></div>
      <div className="w-[199px]"><Card v-bind="args" /></div>
      <div className="w-[249px]"><Card v-bind="args" /></div>
      <div className="w-[299px]"><Card v-bind="args" /></div>
      <div className="w-[400px]"><Card v-bind="args" /></div>
    </div>
    `,
  }),
};
