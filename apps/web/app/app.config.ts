export default defineAppConfig({
  ui: {
    input: {
      slots: {
        root: "w-full relative inline-flex items-center",
        base: "focus:border-on-surface focus:ring-1 focus:ring-primary-container/30 transition-all placeholder:text-on-surface-variant/30 placeholder:uppercase tracking-wider outline-none",
        leading: "absolute inset-y-0 inset-s-0 flex items-center",
        leadingIcon: "shrink-0 text-primary/60",
        trailing: "absolute inset-y-0 inset-e-0 flex items-center",
        trailingIcon: "shrink-0 text-dimmed in-[.error-state]:text-error",
      },
      variants: {
        size: {
          xs: {
            base: "px-2 py-1 text-sm/4 gap-1",
            leading: "ps-2",
            trailing: "pe-2",
            leadingIcon: "size-4",
            leadingAvatarSize: "3xs",
            trailingIcon: "size-4",
          },
          sm: {
            base: "px-2.5 py-1.5 text-sm/4 gap-1.5",
            leading: "ps-2.5",
            trailing: "pe-2.5",
            leadingIcon: "size-4",
            leadingAvatarSize: "3xs",
            trailingIcon: "size-4",
          },
          md: {
            base: "px-10 py-4 text-base",
            leading: "ps-2.5",
            trailing: "pe-2.5",
            leadingIcon: "size-5",
            leadingAvatarSize: "2xs",
            trailingIcon: "size-6",
          },
          lg: {
            base: "px-3 py-2 text-base/5 gap-2",
            leading: "ps-3",
            trailing: "pe-3",
            leadingIcon: "size-5",
            leadingAvatarSize: "2xs",
            trailingIcon: "size-5",
          },
          xl: {
            base: "px-3 py-2 text-base gap-2",
            leading: "ps-3",
            trailing: "pe-3",
            leadingIcon: "size-6",
            leadingAvatarSize: "xs",
            trailingIcon: "size-6",
          },
        },
        variant: {
          none: "bg-surface-container-highest/40 border border-outline-variant/50 text-on-surface",
        },
        color: {
          error:
            "text-error focus-visible:ring-error/50 focus-visible:outline-error/50",
        },
      },
    },
    form: {
      base: "w-full bg-surface-container-low/60 backdrop-blur-xl border border-outline-variant/30 rounded-lg p-8 relative overflow-hidden shadow-red-glow",
    },
    formField: {
      slots: {
        labelWrapper: "flex",
        label:
          "font-mono font-bold text-on-surface-variant tracking-widest text-xs uppercase",
        error: "font-mono font-semibold text-error text-xs",
      },
      variants: {
        required: {
          true: {
            label: "after:content-['*']",
          },
        },
      },
    },
  },
});
