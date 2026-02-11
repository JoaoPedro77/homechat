<script setup lang="ts">
import type { AuthFormField } from '@nuxt/ui'

const campos = ref<AuthFormField[]>([
  {
    name: 'usuario',
    type: 'text',
    label: 'Usuário'
  },
  {
    name: 'senha',
    type: 'password',
    label: 'Senha'
  }
])
</script>

<template>
  <div>
    <UPageHero title="HomeChat - O lar da conversa" />
    <UAuthForm
      title="Login"
      :fields="campos"
      class="max-w-md"
      :submit="{ label: 'Entre no Lar' }"
    />
  </div>
</template>
