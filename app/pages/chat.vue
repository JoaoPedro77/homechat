<script setup lang="ts">
import { db, auth } from '~/services/firebase'
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, limitToLast } from 'firebase/firestore'
import type { Timestamp } from 'firebase/firestore'

definePageMeta({
  middleware: 'auth'
})

type MensagemBase = {
  id: string
  mensagem: string
  usuario: string
  uid: string
  horario: Timestamp
} & (
  | { emissor: 'eu' }
  | { emissor: 'outro', foto: string }
)

const novaMensagem = ref('')
const mensagens = ref<MensagemBase[]>([])
const scrollArea = ref<{ $el: HTMLElement, virtualizer?: { scrollToIndex: (index: number, options?: object) => void } } | null>(null)

const limite = ref(20)
const temMais = ref(true)
const mostrarBotaoScroll = ref(false)
const desativarScrollAutomatico = ref(false)

const enviarMensagem = async () => {
  if (novaMensagem.value.trim() === '') return

  try {
    desativarScrollAutomatico.value = false
    await addDoc(collection(db, 'mensagens'), {
      mensagem: novaMensagem.value,
      usuario: auth.currentUser?.email?.split('@')[0],
      horario: serverTimestamp(),
      uid: auth.currentUser?.uid
    })
    novaMensagem.value = ''
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error)
  }
}

let unsubscribe: (() => void) | null = null

const carregarMensagens = () => {
  if (unsubscribe) unsubscribe()

  const q = query(
    collection(db, 'mensagens'),
    orderBy('horario', 'asc'),
    limitToLast(limite.value)
  )

  unsubscribe = onSnapshot(q, (snapshot) => {
    const novasMensagens = snapshot.docs.map((doc) => {
      const dados = doc.data()
      const isEu = dados.uid === auth.currentUser?.uid
      const msg = {
        id: doc.id,
        mensagem: dados.mensagem,
        usuario: dados.usuario,
        uid: dados.uid,
        horario: dados.horario
      }

      if (isEu) {
        return { ...msg, emissor: 'eu' as const }
      } else {
        return {
          ...msg,
          emissor: 'outro' as const,
          foto: `https://ui-avatars.com/api/?name=${dados.usuario}&background=random&color=fff`
        }
      }
    })

    if (snapshot.docs.length < limite.value) {
      temMais.value = false
    }

    mensagens.value = novasMensagens
  })
}

const scrollParaBaixo = () => {
  desativarScrollAutomatico.value = false
  if (scrollArea.value) {
    if (scrollArea.value.virtualizer) {
      scrollArea.value.virtualizer.scrollToIndex(mensagens.value.length - 1, { align: 'end', behavior: 'smooth' })
    } else {
      const el = scrollArea.value.$el.querySelector('.viewport') || scrollArea.value.$el
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
    }
  }
}

const handleScroll = (event: Event) => {
  const el = event.target as HTMLElement
  const isAtBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 150
  mostrarBotaoScroll.value = !isAtBottom

  if (!isAtBottom) {
    desativarScrollAutomatico.value = true
  } else {
    desativarScrollAutomatico.value = false
  }

  if (el.scrollTop < 50 && temMais.value) {
    const alturaAntes = el.scrollHeight
    limite.value += 20
    carregarMensagens()

    nextTick(() => {
      el.scrollTop = el.scrollHeight - alturaAntes
    })
  }
}

const formatarHorario = (timestamp: Timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate()
  return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

watch(mensagens, () => {
  if (desativarScrollAutomatico.value) return

  nextTick(() => {
    if (scrollArea.value) {
      if (scrollArea.value.virtualizer) {
        scrollArea.value.virtualizer.scrollToIndex(mensagens.value.length - 1, { align: 'end', behavior: 'smooth' })
      } else {
        const el = scrollArea.value.$el.querySelector('.viewport') || scrollArea.value.$el
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
      }
    }
  })
}, { deep: true })

onMounted(() => {
  carregarMensagens()

  // Script para monitorar o scroll manualmente e evitar o erro de tipo do UScrollArea
  nextTick(() => {
    if (scrollArea.value) {
      const el = scrollArea.value.$el.querySelector('.viewport') || scrollArea.value.$el
      el.addEventListener('scroll', handleScroll)
    }
  })
})

onUnmounted(() => {
  if (scrollArea.value) {
    const el = scrollArea.value.$el.querySelector('.viewport') || scrollArea.value.$el
    el.removeEventListener('scroll', handleScroll)
  }
  if (unsubscribe) unsubscribe()
})
</script>

<template>
  <div class="flex flex-col h-screen max-w-4xl mx-auto relative group">
    <UScrollArea
      ref="scrollArea"
      class="flex-1 px-2 pb-45 pt-3"
    >
      <div
        v-for="mensagem in mensagens"
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
              'p-2 text-sm md:text-base wrap-break-word shadow-sm relative',
              mensagem.emissor === 'eu'
                ? 'bg-primary-600 text-white rounded-xl rounded-tr-none'
                : 'bg-neutral-800 text-white rounded-xl rounded-tl-none'
            ]"
          >
            {{ mensagem.mensagem }}
            <div
              :class="[
                'text-[10px] opacity-70 mt-1',
                mensagem.emissor === 'eu' ? 'text-right' : 'text-left'
              ]"
            >
              {{ formatarHorario(mensagem.horario) }}
            </div>
          </div>
        </div>
      </div>
    </UScrollArea>

    <!-- Botão Flutuante para descer -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-y-4 opacity-0"
      enter-to-class="transform translate-y-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-y-0 opacity-100"
      leave-to-class="transform translate-y-4 opacity-0"
    >
      <div
        v-if="mostrarBotaoScroll"
        class="absolute bottom-50 right-6 z-20"
      >
        <UButton
          icon="solar:alt-arrow-down-bold-duotone"
          size="md"
          color="primary"
          class="rounded-full p-2 flex items-center justify-center"
          @click="scrollParaBaixo"
        />
      </div>
    </Transition>

    <div class="fixed bottom-0 left-0 right-0 p-4 pointer-events-none">
      <div class="max-w-4xl mx-auto w-full pointer-events-auto">
        <UForm
          class="flex flex-row gap-2 items-end bg-neutral-900/50 backdrop-blur-md p-2 rounded-2xl border border-neutral-800 shadow-lg"
          @submit="enviarMensagem"
        >
          <UTextarea
            v-model="novaMensagem"
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
            @submit="enviarMensagem"
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
