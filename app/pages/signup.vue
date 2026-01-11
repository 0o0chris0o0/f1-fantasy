<template>
  <div>
    <PageHeader> Sign up </PageHeader>

    <Loader v-if="loading" />

    <p v-if="error" class="text-center text-red-600 mb-2">
      {{ error }}
    </p>

    <form @submit.prevent="createUser">
      <div class="grid grid-cols-1 gap-4">
        <Input v-model="username" placeholder="Username" :errored="errorFields.includes('username')" />
        <Input
          v-model="email"
          type="email"
          placeholder="Email"
          :errored="errorFields.includes('email')"
          required
        />
        <Input
          v-model="password"
          type="password"
          placeholder="Password"
          :errored="errorFields.includes('password')"
          errorMessage="Password must be at least 6 characters long"
          required
        />
        <div class="text-center">
          <Button
            type="submit"
            version="green"
            text-color-class="text-green-500"
            :disabled="loading"
            :aria-busy="loading"
          >
            <span v-if="!loading">Sign up</span>
            <span v-else>Signing up…</span>
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useFirebaseAuth } from "vuefire";

// Utils
import newPlayerStarterObj from "~/utils/newPlayerStarterObj";

// Stores
import { useUserStore } from "@/stores/user";

// Types
import type { FirebaseError } from "firebase/app";

const db = useFirestore();
const auth = useFirebaseAuth()!; // only exists on client side
const userStore = useUserStore();

const username = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const errorFields = ref<string[]>([]);

// display errors if any
const error = ref<string | null>(null);
const loading = ref(false);

const validateForm = () => {
  error.value = null;
  errorFields.value = [];

  const trimmedEmail = email.value.trim();
  const trimmedUsername = username.value.trim();
  const pwd = password.value;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!trimmedUsername) {
    errorFields.value.push("username");
  }

  if (!emailRegex.test(trimmedEmail)) {
    errorFields.value.push("email");
  }

  if (!pwd || pwd.length < 6) {
    errorFields.value.push("password");
  }

  if (errorFields.value.length) {
    error.value = "Please fix the highlighted fields.";
    return false;
  }

  // normalize values
  email.value = trimmedEmail;
  username.value = trimmedUsername;

  return true;
};

const createUser = async () => {
  if (loading.value) return;
  if (!validateForm()) return;

  loading.value = true;

  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // set users username only if provided
    if (username.value) {
      await updateProfile(userCred.user, { displayName: username.value });
    }

    const newUserObj = { ...newPlayerStarterObj };

    if (userCred.user.displayName) {
      newUserObj.displayName = userCred.user.displayName;
    }

    await setDoc(doc(db, "players", userCred.user.uid), newUserObj);

    userStore.setUserForStore({
      ...newUserObj,
      userId: userCred.user.uid,
    });

    // clear sensitive data
    password.value = "";
    navigateTo("/home");

  } catch (reason: unknown) {
    const errorObj = reason as FirebaseError;
    if (errorObj.code) {
      const { errorMsg, field } = transformErrorCode(errorObj.code);
      error.value = errorMsg;
      if (field) {
        // avoid duplicates
        if (!errorFields.value.includes(field)) {
          errorFields.value.push(field);
        }
      }
    } else {
      error.value = "Unknown error";
    }
  } finally {
    loading.value = false;
  }
};

function transformErrorCode(code: string) {
  let errorMsg = "Unknown error";
  let field: string | null = null;

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

// clear field-specific errors as user types
watch(username, () => {
  errorFields.value = errorFields.value.filter((f) => f !== "username");
});
watch(email, () => {
  errorFields.value = errorFields.value.filter((f) => f !== "email");
});
watch(password, () => {
  errorFields.value = errorFields.value.filter((f) => f !== "password");
});
</script>

<style scoped></style>