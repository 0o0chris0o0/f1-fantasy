<template>
  <div>
    <PageHeader class="mb-4"> Account </PageHeader>

    <div class="space-y-10 w-11/12 mx-auto max-w-md">
      <!-- Username -->
      <UForm
        :state="usernameForm"
        class="space-y-4"
        @submit="handleUpdateUsername"
      >
        <p class="font-headline uppdercase text-center font-bold text-lg">
          Username
        </p>
        <UFormField
          label="Username"
          name="username"
          :error="usernameErrors.username || false"
          required
        >
          <UInput
            v-model="usernameForm.username"
            placeholder="Username"
            variant="none"
          />
        </UFormField>
        <div class="text-center">
          <Button
            type="submit"
            size="sm"
            :disabled="usernameLoading"
            :aria-busy="usernameLoading"
          >
            {{ usernameLoading ? "Saving…" : "Save Username" }}
          </Button>
        </div>
      </UForm>

      <!-- Email -->
      <UForm :state="emailForm" class="space-y-4" @submit="handleUpdateEmail">
        <p class="font-headline uppdercase text-center font-bold text-lg">
          Email
        </p>
        <UFormField
          label="Current Email"
          name="currentEmail"
          class="opacity-50"
        >
          <UInput
            :value="user?.email"
            placeholder="Current Email"
            type="email"
            variant="none"
            disabled
            readonly
          />
        </UFormField>
        <hr class="block w-20 my-6 mx-auto border-on-surface/20" />
        <UFormField
          label="New Email"
          name="email"
          :error="emailErrors.email || false"
          required
        >
          <UInput
            v-model="emailForm.email"
            placeholder="New Email"
            type="email"
            variant="none"
          />
        </UFormField>
        <UFormField
          label="Current Password"
          name="currentPassword"
          :error="emailErrors.currentPassword || false"
          required
        >
          <UInput
            v-model="emailForm.currentPassword"
            placeholder="Current Password"
            type="password"
            variant="none"
          />
        </UFormField>
        <div class="text-center">
          <Button
            type="submit"
            size="sm"
            :disabled="emailLoading"
            :aria-busy="emailLoading"
          >
            {{ emailLoading ? "Updating..." : "Update Email" }}
          </Button>
        </div>
      </UForm>

      <!-- Password -->
      <UForm
        :state="passwordForm"
        class="space-y-4"
        @submit="handleUpdatePassword"
      >
        <p class="font-headline uppdercase text-center font-bold text-lg">
          Password
        </p>
        <UFormField
          label="Current Password"
          name="currentPassword"
          :error="passwordErrors.currentPassword || false"
          required
        >
          <UInput
            v-model="passwordForm.currentPassword"
            placeholder="Current Password"
            type="password"
            variant="none"
          />
        </UFormField>
        <UFormField
          label="New Password"
          name="newPassword"
          :error="passwordErrors.newPassword || false"
          required
        >
          <UInput
            v-model="passwordForm.newPassword"
            placeholder="New Password"
            type="password"
            variant="none"
          />
        </UFormField>
        <UFormField
          label="Confirm New Password"
          name="confirmPassword"
          :error="passwordErrors.confirmPassword || false"
          required
        >
          <UInput
            v-model="passwordForm.confirmPassword"
            placeholder="Confirm New Password"
            type="password"
            variant="none"
          />
        </UFormField>
        <div class="text-center">
          <Button
            type="submit"
            size="sm"
            :disabled="passwordLoading"
            :aria-busy="passwordLoading"
          >
            {{ passwordLoading ? "Updating…" : "Update Password" }}
          </Button>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, writeBatch } from "firebase/firestore";
import { useFirebaseAuth } from "vuefire";
import type { FormSubmitEvent } from "@nuxt/ui";
import type { FirebaseError } from "firebase/app";

definePageMeta({
  middleware: "auth",
});

const db = useFirestore();
const auth = useFirebaseAuth()!;
const user = useCurrentUser();
const userStore = useUserStore();
const notificationStore = useNotificationStore();

// Username
const usernameForm = ref({ username: user.value?.displayName || "" });
const usernameErrors = ref<{ username: string | null }>({ username: null });
const usernameLoading = ref(false);

const handleUpdateUsername = async (
  event: FormSubmitEvent<typeof usernameForm.value>,
) => {
  if (usernameLoading.value) return;
  usernameErrors.value.username = null;

  if (!usernameForm.value.username) {
    usernameErrors.value.username = "Please enter a username";
    return;
  }

  usernameLoading.value = true;

  try {
    if (!auth.currentUser) throw new Error("Not logged in");

    await updateProfile(auth.currentUser, {
      displayName: usernameForm.value.username,
    });

    const batch = writeBatch(db);
    batch.update(doc(db, "players", auth.currentUser.uid), {
      displayName: usernameForm.value.username,
    });
    batch.update(doc(db, "leaderboard", auth.currentUser.uid), {
      playerName: usernameForm.value.username,
    });
    await batch.commit();

    notificationStore.addNotification({
      version: "success",
      message: "Username updated",
    });
  } catch (reason: unknown) {
    notificationStore.addNotification({
      version: "error",
      message: getFirebaseErrorMessage(reason),
    });
  } finally {
    usernameLoading.value = false;
  }
};

// Email
const emailForm = ref({ email: "", currentPassword: "" });
const emailErrors = ref<{
  email: string | null;
  currentPassword: string | null;
}>({
  email: null,
  currentPassword: null,
});
const emailLoading = ref(false);

const handleUpdateEmail = async (
  event: FormSubmitEvent<typeof emailForm.value>,
) => {
  if (emailLoading.value) return;
  emailErrors.value = { email: null, currentPassword: null };

  if (!emailForm.value.email) {
    emailErrors.value.email = "Please enter a valid email";
    return;
  }
  if (!emailForm.value.currentPassword) {
    emailErrors.value.currentPassword = "Please enter your current password";
    return;
  }

  emailLoading.value = true;

  try {
    if (!auth.currentUser?.email) throw new Error("Not logged in");

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      emailForm.value.currentPassword,
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updateEmail(auth.currentUser, emailForm.value.email);

    emailForm.value.currentPassword = "";
    notificationStore.addNotification({
      version: "success",
      message: "Email updated",
    });
  } catch (reason: unknown) {
    const { message, field } = mapAuthError(reason);
    if (field === "currentPassword" || field === "email") {
      emailErrors.value[field] = message;
    } else {
      notificationStore.addNotification({ version: "error", message });
    }
  } finally {
    emailLoading.value = false;
  }
};

// Password
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const passwordErrors = ref<{
  currentPassword: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
}>({ currentPassword: null, newPassword: null, confirmPassword: null });
const passwordLoading = ref(false);

const handleUpdatePassword = async (
  event: FormSubmitEvent<typeof passwordForm.value>,
) => {
  if (passwordLoading.value) return;
  passwordErrors.value = {
    currentPassword: null,
    newPassword: null,
    confirmPassword: null,
  };

  if (!passwordForm.value.currentPassword) {
    passwordErrors.value.currentPassword = "Please enter your current password";
    return;
  }
  if (!passwordForm.value.newPassword) {
    passwordErrors.value.newPassword = "Please enter a new password";
    return;
  }
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = "Passwords do not match";
    return;
  }

  passwordLoading.value = true;

  try {
    if (!auth.currentUser?.email) throw new Error("Not logged in");

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      passwordForm.value.currentPassword,
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, passwordForm.value.newPassword);

    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    notificationStore.addNotification({
      version: "success",
      message: "Password updated",
    });
  } catch (reason: unknown) {
    const { message, field } = mapAuthError(reason);
    if (field === "currentPassword" || field === "newPassword") {
      passwordErrors.value[field] = message;
    } else {
      notificationStore.addNotification({ version: "error", message });
    }
  } finally {
    passwordLoading.value = false;
  }
};

function getFirebaseErrorMessage(reason: unknown): string {
  const errorObj = reason as FirebaseError;
  return errorObj?.code ? mapAuthError(reason).message : "Unknown error";
}

function mapAuthError(reason: unknown): {
  message: string;
  field: "email" | "currentPassword" | "newPassword" | null;
} {
  const code = (reason as FirebaseError)?.code;

  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return { message: "Incorrect password", field: "currentPassword" };
    case "auth/invalid-email":
      return { message: "There is an issue with your email", field: "email" };
    case "auth/email-already-in-use":
      return {
        message: "There is already a user with that email",
        field: "email",
      };
    case "auth/weak-password":
      return { message: "Your new password is too weak", field: "newPassword" };
    case "auth/requires-recent-login":
      return {
        message: "Please re-enter your current password and try again",
        field: "currentPassword",
      };
    default:
      return { message: "Something went wrong, please try again", field: null };
  }
}
</script>

<style lang="scss" scoped></style>
