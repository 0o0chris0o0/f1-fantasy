<template>
  <div>
    <PageHeader> Login </PageHeader>

    <Loader v-if="loading" />

    <p v-if="error" class="text-center text-red-600 mb-2">
      {{ error }}
    </p>

    <form @submit.prevent="signIn">
      <div class="grid grid-cols-1 gap-4">
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
          required
        />
        <div class="text-center">
          <Button type="submit" version="green">Sign in</Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { signInWithEmailAndPassword } from "firebase/auth";
import { navigateTo } from "nuxt/app";
import { ref } from "vue";
import { useFirebaseAuth } from "vuefire";

definePageMeta({
  linkTitle: "Login",
});

const auth = useFirebaseAuth()!; // only exists on client side

const loading = ref(false);
const email = ref<string>("");
const password = ref<string>("");
const errorFields = ref<string[]>([]);

// display errors if any
const error = ref<string | null>(null);

const signIn = async () => {
  if (loading.value) return;

  loading.value = true;

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    navigateTo("home");
  } catch (reason: any) {
    if (reason.code) {
      const { errorMsg, field } = transformErrorCode(reason.code);
      error.value = errorMsg;

      if (field) {
        errorFields.value.push(field);
      }
    } else {
      error.value = "Unknown error";
    }
  } finally {
    loading.value = false;
  }
};

function transformErrorCode(code: string) {
  let errorMsg;
  let field;

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
</script>

<style scoped>
.avatar {
  padding: 1em 0;
}

main > button {
  margin: 1em 0;
}
</style>
