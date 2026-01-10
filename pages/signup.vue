<template>
  <div>
    <PageHeader> Sign up </PageHeader>

    <p v-if="error" class="text-center text-red-600 mb-2">
      {{ error }}
    </p>

    <form @submit.prevent="createUser">
      <div class="grid grid-cols-1 gap-4">
        <Input v-model="username" placeholder="Username" required />
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
          <Button type="submit" version="green" text-color-class="text-green-500">Sign up</Button>
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
const router = useRouter();
const userStore = useUserStore();

const username = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const errorFields = ref<string[]>([]);

// display errors if any
const error = ref<string | null>(null);

const createUser = async () => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    );

    // set users username
    await updateProfile(userCred.user, { displayName: username.value });

    const newUserObj = newPlayerStarterObj;

    if (userCred.user.displayName) {
      newUserObj.displayName = userCred.user.displayName;
    }

    // create user entry in db
    await setDoc(doc(db, "players", userCred.user.uid), newUserObj);

    // update local store
    userStore.setUserForStore({
      ...newUserObj,
      userId: userCred.user.uid,
    });

    router.push("/home");
  } catch (reason: unknown) {
    const errorObj = reason as FirebaseError;
    if (errorObj.code) {
      const { errorMsg, field } = transformErrorCode(errorObj.code);
      error.value = errorMsg;

      if (field) {
        errorFields.value.push(field);
      }
    } else {
      error.value = "Unknown error";
    }
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
    case "auth/email-already-in-use":
      errorMsg = "There is already a user with that email";
      field = "email";
      break;
    case "auth/weak-password":
      errorMsg = "Your password is too weak";
      field = "password";
      break;

    default:
      errorMsg = "Unknown error";
      break;
  }

  return { errorMsg, field };
}
</script>

<style scoped></style>
