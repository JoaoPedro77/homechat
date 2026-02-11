<script setup lang="ts">
import type { AuthFormField } from '#ui/types'

const campos = ref<AuthFormField[]>([
  {
    name: 'usuario',
    label: 'Usuário',
    type: 'text',
    autofocus: true,
    size: 'lg',
    icon: 'solar:user-bold-duotone',
    placeholder: 'Digite seu usuário'
  },
  {
    name: 'senha',
    label: 'Senha',
    type: 'password',
    size: 'lg',
    icon: 'solar:lock-keyhole-bold-duotone',
    placeholder: '• • • • • • • • • •'
  }
])
</script>

<template>
  <div class="flex flex-col items-center justify-center flex-1 h-full pt-5">
    <div class="flex flex-row gap-4 items-center">
      <div class="flex flex-col items-center">
        <h1 class="hidden xl:block md:text-7xl text-4xl font-bold font-sour-gummy">
          HomeChat • O lar da conversa
        </h1>
        <div class="xl:hidden flex flex-col items-center font-sour-gummy">
          <span class="text-4xl font-bold"> HomeChat <UIcon
            name="solar:chat-round-line-bold-duotone"
            class="text-4xl"
          /> </span>
          <span class="text-2xl">O lar da conversa</span>
        </div>
        <p class="text-neutral-600 text-center text-sm md:text-lg m-2">
          O HomeChat é a escolha perfeita para quem busca harmonia com a tecnologia e com seu lar
        </p>
      </div>
      <UIcon
        name="solar:chat-round-line-bold-duotone"
        class="text-7xl hidden xl:block"
      />
    </div>
    <UPageCard
      variant="soft"
      class="m-5 sm:p-6"
    >
      <UAuthForm
        icon="solar:home-bold-duotone"
        description="Insira seus dados para entrar no lar da conversa"
        title="Entrar em HomeChat"
        :fields="campos"
        class=" sm:min-w-lg"
        :submit="{
          label: 'Entre no lar',
          icon: 'solar:login-2-bold-duotone'
        }"
        :ui="{ leadingIcon: 'text-primary' }"
      />
      <p class="text-sm text-muted text-center">
        Powered by SALO - HomeTech • © {{ new Date().getFullYear() }}
      </p>
    </UPageCard>
  </div>
</template>
