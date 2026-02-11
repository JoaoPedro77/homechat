<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.png' }
  ],
  htmlAttrs: {
    lang: 'PT-BR'
  }
})

const title = 'HomeChat - O lar da conversa'
const description = 'HomeChat é um aplicativo de mensagens em tempo real. o HomeChat é a escolha perfeita para quem busca harmonia com a tecnologia e com seu lar'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/starter-light.png'
})
</script>

<template>
  <UApp class="h-screen flex flex-col overflow-hidden">
    <div class="bg-container animate__animated animate__pulse animate__infinite" />
    <UHeader
      :toggle="false"
      class="h-25"
    >
      <template #left>
        <NuxtLink to="/">
          <div class="flex items-center ">
            <img
              src="/favicon.png"
              alt="HomeChat Logo"
              class="w-25"
            >
            <div class="flex flex-col">
              <span class="ml-2 text-lg font-dynapuff">HomeChat</span>
              <span class="ml-2 text-xs text-neutral-600">O lar da conversa</span>
            </div>
          </div>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
        <UButton
          to="https://github.com/JoaoPedro77"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UHeader>

    <UMain class="flex-1">
      <NuxtPage />
    </UMain>
  </UApp>
</template>
