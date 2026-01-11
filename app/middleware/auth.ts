export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();

  // If the user is not logged in and is trying to access any page other than login
  if (!user && to.path !== '/login') {
    return navigateTo('/login')
  }
  
  // If the user is logged in and tries to go to the login page, send them to dashboard
  if (user && to.path === '/login') {
    return navigateTo('/dashboard')
  }
})