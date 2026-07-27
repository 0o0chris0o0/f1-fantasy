import { setup } from "@storybook/vue3";
import type { Preview } from "@storybook/vue3-vite";
import Card from "../app/components/Card.vue";
import "../app/assets/css/main.css";

setup((app) => {
  app.component("Card", Card);
  app.component("Icon", {
    props: {
      name: {
        type: String,
        default: "",
      },
    },
    template: `
      <div data-v-3557be18="" class="rounded-full card-icons__flag"><svg data-v-3557be18="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--circle-flags w-full h-full" width="1em" height="1em" viewBox="0 0 512 512"><mask id="iconifyVue6"><circle cx="256" cy="256" r="256" fill="#fff"></circle></mask><g mask="url(#iconifyVue6)"><path fill="#eee" d="m0 0l8 22l-8 23v23l32 54l-32 54v32l32 48l-32 48v32l32 54l-32 54v68l22-8l23 8h23l54-32l54 32h32l48-32l48 32h32l54-32l54 32h68l-8-22l8-23v-23l-32-54l32-54v-32l-32-48l32-48v-32l-32-54l32-54V0l-22 8l-23-8h-23l-54 32l-54-32h-32l-48 32l-48-32h-32l-54 32L68 0z"></path><path fill="#0052b4" d="M336 0v108L444 0Zm176 68L404 176h108zM0 176h108L0 68ZM68 0l108 108V0Zm108 512V404L68 512ZM0 444l108-108H0Zm512-108H404l108 108Zm-68 176L336 404v108z"></path><path fill="#d80027" d="M0 0v45l131 131h45zm208 0v208H0v96h208v208h96V304h208v-96H304V0zm259 0L336 131v45L512 0zM176 336L0 512h45l131-131zm160 0l176 176v-45L381 336z"></path></g></svg></div>
    `,
  });

  app.component("UModal", {
    props: {
      modelValue: {
        type: Boolean,
        default: false,
      },
      open: {
        type: Boolean,
        default: false,
      },
      disable: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["update:modelValue"],
    data() {
      return {
        isOpen: Boolean((this as any).modelValue || (this as any).open),
      };
    },
    watch: {
      modelValue(value: boolean) {
        (this as any).isOpen = value;
      },
      open(value: boolean) {
        (this as any).isOpen = value;
      },
    },
    methods: {
      toggle() {
        if ((this as any).disable) {
          return;
        }

        (this as any).isOpen = !(this as any).isOpen;
        (this as any).$emit("update:modelValue", (this as any).isOpen);
      },
      close() {
        (this as any).isOpen = false;
        (this as any).$emit("update:modelValue", false);
      },
    },
    template: `
      <div class="block">
        <div class="cursor-pointer" @click="toggle">
          <slot />
        </div>
        <div
          v-if="isOpen"
          class="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4"
          @click.self="close"
        >
          <div class="w-full max-w-xl rounded-lg bg-surface-container-highest p-4 text-white shadow-xl">
            <div class="mb-3 flex justify-end">
              <button type="button" class="rounded px-2 py-1 text-sm text-white/80 hover:bg-white/10" @click="close">
                Close
              </button>
            </div>
            <slot name="content" />
          </div>
        </div>
      </div>
    `,
  });

  app.component("NuxtImg", {
    props: {
      src: {
        type: String,
        default: "",
      },
      alt: {
        type: String,
        default: "",
      },
    },
    template: '<img :src="src" :alt="alt" />',
  });

  app.component("ClientOnly", {
    template: "<div><slot /></div>",
  });
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
