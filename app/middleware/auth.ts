export default defineNuxtRouteMiddleware((to) => {
  const autenticado = useCookie('autenticado')

  if (!autenticado.value && to.path.startsWith('/chat')) {
    return navigateTo('/login')
  }
  if (autenticado.value && to.path === '/login') {
    return navigateTo('/chat')
  }
})
