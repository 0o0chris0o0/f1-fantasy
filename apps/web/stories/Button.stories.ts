import type { Meta, StoryObj } from "@storybook/vue3-vite";
import Button from "../app/components/Button.vue";

type ButtonArgs = {
  type: "button" | "submit";
  size: "sm" | "md" | "lg";
  version: "primary" | "secondary" | "tertiary" | "neutral";
  label: string;
};

const meta: Meta<ButtonArgs> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    type: "button",
    size: "md",
    version: "primary",
    label: "Test Button",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["button", "submit"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    version: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "neutral"],
    },
    label: {
      control: "text",
    },
  },
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template:
      '<Button :type="args.type" :size="args.size" :version="args.version">{{ args.label }}</Button>',
  }),
};

export default meta;

type Story = StoryObj<ButtonArgs>;

export const Primary: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Secondary: Story = {
  args: {
    version: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    version: "tertiary",
  },
};

export const Neutral: Story = {
  args: {
    version: "neutral",
  },
};
