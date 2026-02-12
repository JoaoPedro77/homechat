<script setup lang="ts">
import { auth } from '../services/firebase'

definePageMeta({
  middleware: 'auth'
})
const logout = async () => {
  await auth.signOut()
  const autenticado = useCookie('autenticado')
  autenticado.value = null
  navigateTo('/login')
}
</script>

<template>
  <div>
    <UButton
      color="neutral"
      variant="ghost"
      icon="i-heroicons-arrow-left-on-rectangle"
      @click="logout"
    >
      Sair
    </UButton>
    <h1>HomeChat</h1>
  </div>
</template>
