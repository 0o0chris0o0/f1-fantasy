<template>
  <div>
    <PageHeader> Login </PageHeader>

    <Loader v-if="loading" />

    <div class="text-center mb-4">
      <p
        v-if="generalError"
        class="font-mono text-sm font-semibold tracking-wide text-error"
      >
        {{ generalError }}
      </p>
    </div>

    <UForm
      :state="formState"
      class="space-y-4"
      :class="{
        'border-error/50': generalError,
      }"
      @submit="loginUser"
      @error="onError"
    >
      <!-- Glass Corner Accent -->
      <div
        class="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-primary-container/40 rounded-tr-lg"
      ></div>
      <div class="space-y-4">
        <UFormField
          label="Email"
          name="email"
          :error="fieldErrors.email || false"
          :class="{ 'error-state': !!fieldErrors.email }"
          required
        >
          <UInput
            v-model="formState.email"
            placeholder="Email"
            icon="i-lucide-at-sign"
            variant="none"
            :trailing-icon="fieldErrors.email ? 'wordpress:error' : ''"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          :error="fieldErrors.password || false"
          :class="{ 'error-state': !!fieldErrors.password }"
          required
        >
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="Password"
            icon="i-lucide-lock"
            variant="none"
            :trailing-icon="fieldErrors.password ? 'wordpress:error' : ''"
          />
        </UFormField>

        <div class="text-center">
          <Button type="submit" :disabled="loading" :aria-busy="loading">
            <span v-if="!loading">Log in</span>
            <span v-else>Logging in…</span>
          </Button>
        </div>
      </div>
    </UForm>

    <div class="mt-8 text-center">
      <p class="text-on-surface-variant opacity-70">Don't have an account?</p>
      <NuxtLink
        to="/signup"
        class="uppercase font-bold text-sm text-primary border-b border-primary/30 pb-1 tracking-[0.15em]"
      >
        Sign up
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { signInWithEmailAndPassword } from "firebase/auth";
import { useFirebaseAuth } from "vuefire";
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";

// Types
import type { FirebaseError } from "firebase/app";
import type { iLeaderboardScore } from "@f1pick6/shared";

const auth = useFirebaseAuth()!; // only exists on client side

const formState = ref({
  email: "",
  password: "",
});

type Schema = typeof formState.value;
type FieldName = keyof Schema;

const fieldErrors = ref<Record<FieldName, string | null>>({
  email: null,
  password: null,
});

const generalError = ref<string | null>(null);
const loading = ref(false);

const loginUser = async (event: FormSubmitEvent<Schema>) => {
  if (loading.value) return;

  resetErrors();

  if (!validateForm()) {
    loading.value = false;
    return;
  }

  loading.value = true;

  try {
    await signInWithEmailAndPassword(
      auth,
      formState.value.email,
      formState.value.password,
    );
    navigateTo("home");
  } catch (reason: unknown) {
    const errorObj = reason as FirebaseError;
    if (errorObj.code) {
      const { errorMsg, field } = transformErrorCode(errorObj.code);
      setGeneralError(errorMsg);
      if (field) {
        setFieldError(field, errorMsg);
      }
    } else {
      setGeneralError("Unknown error");
    }
  } finally {
    loading.value = false;
  }
};

function transformErrorCode(code: string) {
  let errorMsg = "Unknown error";
  let field: FieldName | null = null;

  switch (code) {
    case "auth/invalid-email":
      errorMsg = "There is an issue with your email";
      field = "email";
      break;
    case "auth/user-disabled":
      errorMsg = "User has been disabled";
      break;
    case "auth/user-not-found":
      errorMsg = "Could not find a user with that email/password";
      break;
    case "auth/wrong-password":
      errorMsg = "Password incorrect";
      field = "password";
      break;

    default:
      errorMsg = "Unknown error";
      break;
  }

  return { errorMsg, field };
}

function setFieldError(field: FieldName, errorMsg: string) {
  fieldErrors.value[field] = errorMsg;
}

function clearFieldError(field: FieldName) {
  fieldErrors.value[field] = null;
}

function setGeneralError(errorMsg: string) {
  generalError.value = errorMsg;
}

function resetErrors() {
  generalError.value = null;
  fieldErrors.value.email = null;
  fieldErrors.value.password = null;
}

function validateForm() {
  let valid = true;

  if (!formState.value.email) {
    setFieldError("email", "Please enter a valid email");
    valid = false;
  }

  if (!formState.value.password) {
    setFieldError("password", "Please enter a valid password");
    valid = false;
  }

  return valid;
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id);
    element?.focus();
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

watch(
  () => formState.value.email,
  () => {
    clearFieldError("email");
  },
);

watch(
  () => formState.value.password,
  () => {
    clearFieldError("password");
  },
);
</script>

<style scoped></style>
