import { useFirebaseAuth } from 'vuefire'
import { signOut } from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
  // VueFire 3 composable to get the auth instance
  const auth = useFirebaseAuth()

  nuxtApp.hook('app:error', async (err) => {
    if (err.message.includes('AUTH_REVOKED')) {
      if (auth) {
        await signOut(auth)
        // Clear the Nuxt error state and redirect
        clearError()
        await navigateTo('/login')
      }
    }
  })
})