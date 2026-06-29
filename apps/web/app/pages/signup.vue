<template>
  <div>
    <PageHeader> Sign up </PageHeader>

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
      @submit="createUser"
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
          label="Username"
          name="username"
          :error="fieldErrors.username || false"
          :class="{ 'error-state': !!fieldErrors.username }"
          required
        >
          <UInput
            v-model="formState.username"
            placeholder="Username"
            icon="i-lucide-user"
            variant="none"
            :trailing-icon="fieldErrors.username ? 'wordpress:error' : ''"
          />
        </UFormField>

        <div class="h-1"></div>

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

        <UFormField
          label="Confirm Password"
          name="confirmPassword"
          :error="fieldErrors.confirmPassword || false"
          :class="{ 'error-state': !!fieldErrors.confirmPassword }"
          required
        >
          <UInput
            v-model="formState.confirmPassword"
            type="password"
            placeholder="Confirm Password"
            icon="i-lucide-lock"
            variant="none"
            :trailing-icon="
              fieldErrors.confirmPassword ? 'wordpress:error' : ''
            "
          />
        </UFormField>

        <div class="text-center">
          <Button type="submit" :disabled="loading" :aria-busy="loading">
            <span v-if="!loading">Sign up</span>
            <span v-else>Signing up…</span>
          </Button>
        </div>
      </div>
    </UForm>

    <div class="mt-8 text-center">
      <p class="text-on-surface-variant opacity-70">Already have an account?</p>
      <NuxtLink
        to="/login"
        class="uppercase font-bold text-sm text-primary border-b border-primary/30 pb-1 tracking-[0.15em]"
      >
        Log in
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, writeBatch } from "firebase/firestore";
import { useFirebaseAuth } from "vuefire";
import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";

// Utils
import newPlayerStarterObj from "../utils/newPlayerStarterObj";

// Types
import type { FirebaseError } from "firebase/app";
import type { iLeaderboardScore } from "@f1pick6/shared";

const db = useFirestore();
const auth = useFirebaseAuth()!; // only exists on client side

const formState = ref({
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
});

type Schema = typeof formState.value;
type FieldName = keyof Schema;

const fieldErrors = ref<Record<FieldName, string | null>>({
  email: null,
  username: null,
  password: null,
  confirmPassword: null,
});

const generalError = ref<string | null>(null);
const loading = ref(false);

const createUser = async (event: FormSubmitEvent<Schema>) => {
  if (loading.value) return;

  resetErrors();

  if (!validateForm()) {
    return;
  }

  loading.value = true;

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      formState.value.email,
      formState.value.password,
    );

    // set users username
    await updateProfile(userCred.user, {
      displayName: formState.value.username,
    });

    const newUserObj = { ...newPlayerStarterObj };

    if (userCred.user.displayName) {
      newUserObj.displayName = userCred.user.displayName;
    }

    const playerRef = doc(db, "players", userCred.user.uid);
    const leaderboardRef = doc(db, "leaderboard", playerRef.id);
    const batch = writeBatch(db);

    batch.set(playerRef, newUserObj);

    const leaderBoardEntry: iLeaderboardScore = {
      playerName: newUserObj.displayName,
      playerId: playerRef.id,
      currentScore: 0,
      currentRank: 1,
      prevRank: 1,
      qualifyingScore: 0,
      modifierScore: 0,
      raceScore: 0,
    };

    batch.set(leaderboardRef, leaderBoardEntry);

    await batch.commit();

    navigateTo("/home");
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
    case "auth/email-already-in-use":
      errorMsg = "There is already a user with that email";
      field = "email";
      break;
    case "auth/weak-password":
      errorMsg = "Your password is too weak";
      field = "password";
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
  fieldErrors.value.username = null;
  fieldErrors.value.password = null;
  fieldErrors.value.confirmPassword = null;
}

function validateForm() {
  let valid = true;

  if (!formState.value.email) {
    setFieldError("email", "Please enter a valid email");
    valid = false;
  }

  if (!formState.value.username) {
    setFieldError("username", "Please enter a username");
    valid = false;
  }

  if (!formState.value.password) {
    setFieldError("password", "Please enter a valid password");
    valid = false;
  }

  if (!formState.value.confirmPassword) {
    setFieldError("confirmPassword", "Please confirm your password");
    valid = false;
  }

  if (formState.value.password !== formState.value.confirmPassword) {
    setFieldError("confirmPassword", "Passwords do not match");
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
  () => formState.value.username,
  () => {
    clearFieldError("username");
  },
);

watch(
  () => formState.value.password,
  () => {
    clearFieldError("password");
    clearFieldError("confirmPassword");
  },
);

watch(
  () => formState.value.confirmPassword,
  () => {
    clearFieldError("confirmPassword");
  },
);
</script>

<style scoped></style>
