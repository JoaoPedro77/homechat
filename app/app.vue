<script setup>
useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: 'https://cdn-icons-png.flaticon.com/512/609/609803.png' }
  ],
  htmlAttrs: {
    lang: 'PT-BR'
  }
})

const title = 'HomeChat - A casa da conversa'
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
  <UApp>
    <UHeader>
      <template #left>
        <NuxtLink to="/">
          <UAvatar
            src="/favicon.ico"
            alt="HomeChat Logo"
            size="md"
            color="primary"
          />
          <div class="flex flex-col">
            <span class="ml-2 font-bold text-lg">HomeChat</span>
            <span class="ml-2 text-sm text-muted">A casa da conversa</span>
          </div>
        </NuxtLink>
      </template>

      <template #right>
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <USeparator icon="i-simple-icons-nuxtdotjs" />

    <UFooter>
      <template #left>
        <p class="text-sm text-muted">
          Powered by SALO - HomeTech • © {{ new Date().getFullYear() }}
        </p>
      </template>

      <template #right>
        <UButton
          to="https://github.com/nuxt-ui-templates/starter"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
          color="neutral"
          variant="ghost"
        />
      </template>
    </UFooter>
  </UApp>
</template>
