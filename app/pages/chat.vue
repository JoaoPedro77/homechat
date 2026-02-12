<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

type conversa = {
  mensagem: string
  usuario: string
  id: string
} & (
  | { emissor: 'eu' }
  | { emissor: 'outro', foto: string }
)

const conversas = ref<conversa[]>([
  {
    emissor: 'eu',
    mensagem: 'boa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noiteboa noite',
    usuario: 'eu',
    id: '1'
  },
  {
    emissor: 'outro',
    mensagem: 'arroy',
    usuario: 'outro',
    id: '2',
    foto: 'https://github.com/JoaoPedro77.png'
  },
  {
    emissor: 'eu',
    mensagem: 'bixa',
    usuario: 'eu',
    id: '3'
  }
])

const onSubmit = () => {
  console.log('submit')
}
</script>

<template>
  <div class="flex flex-col h-screen pt-25 pb-20 max-w-4xl mx-auto">
    <UScrollArea class="flex-1 px-2">
      <div
        v-for="mensagem in conversas"
        :key="mensagem.id"
        :class="[
          'flex gap-3 mb-4 w-full',
          mensagem.emissor === 'eu' ? 'flex-row-reverse' : 'flex-row'
        ]"
      >
        <UAvatar
          v-if="mensagem.emissor === 'outro'"
          :src="mensagem.foto"
          size="lg"
          class="shrink-0 mt-1"
        />
        <div
          :class="[
            'flex flex-col max-w-[80%] md:max-w-[70%]',
            mensagem.emissor === 'eu' ? 'items-end' : 'items-start'
          ]"
        >
          <span
            v-if="mensagem.emissor !== 'eu'"
            class="text-xs font-medium text-neutral-300 mb-1 ml-1"
          >
            {{ mensagem.usuario }}
          </span>
          <div
            :class="[
              'p-2 text-sm md:text-base wrap-break-word shadow-sm',
              mensagem.emissor === 'eu'
                ? 'bg-primary-600 text-white rounded-xl rounded-tr-none'
                : 'bg-neutral-800 text-white rounded-xl rounded-tl-none'
            ]"
          >
            {{ mensagem.mensagem }}
          </div>
        </div>
      </div>
    </UScrollArea>

    <div class="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
      <div class="max-w-4xl mx-auto w-full pointer-events-auto">
        <UForm
          class="flex flex-row gap-2 items-end bg-neutral-900/50 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 shadow-lg"
          @submit="onSubmit"
        >
          <UTextarea
            class="flex-1"
            placeholder="Digite sua mensagem..."
            :autofocus="true"
            :autoresize="true"
            :rows="1"
            size="xl"
            variant="none"
            :ui="{
              base: 'max-h-45 overflow-y-auto px-2 py-2 w-full focus:ring-0'
            }"
            @submit="onSubmit"
          />
          <UButton
            type="submit"
            icon="solar:map-arrow-right-bold-duotone"
            color="primary"
            variant="solid"
            size="xl"
            class="rounded-xl shrink-0 h-11 w-11 flex items-center justify-center"
          />
        </UForm>
      </div>
    </div>
  </div>
</template>
