<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from '#ui/types'
import { auth } from '../services/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { z } from 'zod'

definePageMeta({
  middleware: 'auth'
})
const schema = z.object({
  usuario: z.string({
    error: issue => issue.input === undefined ? 'Usuário é obrigatório' : 'Digite pelo menos 3 caracteres'
  })
    .nonempty('Usuário é obrigatório')
    .min(3, 'Usuário deve ter pelo menos 3 caracteres'),

  senha: z.string({
    error: issue => issue.input === undefined ? 'Senha é obrigatória' : 'Digite pelo menos 3 caracteres'
  })
    .nonempty('Senha é obrigatória')
    .min(6, 'Senha deve ter pelo menos 6 caracteres')

})
const erroLogin = ref('')
const autenticado = useCookie('autenticado')

const getMensagemErro = (code: string) => {
  switch (code) {
    case 'auth/wrong-password':
      return 'Usuário ou senha incorretos.'
    case 'auth/email-already-in-use':
      return 'Usuario em uso ou senha incorreta.'
    case 'auth/user-disabled':
      return 'Este usuário foi desativado.'
    case 'auth/operation-not-allowed':
      return 'Operação não permitida.'
    case 'auth/weak-password':
      return 'A senha é muito fraca, deve ter mais que 6 caracteres.'
    case 'auth/network-request-failed':
      return 'Erro de rede. Verifique sua conexão.'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.'
    default:
      return 'Ocorreu um erro inesperado. Tente novamente.'
  }
}

const fazerLogin = async (usuario: string, senha: string) => {
  const emailFicticio = `${usuario.toLowerCase()}@homechat.com`
  erroLogin.value = ''

  try {
    const userCredential = await signInWithEmailAndPassword(auth, emailFicticio, senha)
    console.log('Logado com sucesso!', userCredential.user)
    autenticado.value = 'true'
    navigateTo('/chat')
  } catch (error) {
    const authError = error as { code: string }
    // se n tiver usuario cadastrado, cria
    if (authError.code === 'auth/invalid-credential' || authError.code === 'auth/user-not-found') {
      try {
        const novoUser = await createUserWithEmailAndPassword(auth, emailFicticio, senha)
        console.log('Usuário criado com sucesso!', novoUser.user)
        autenticado.value = 'true'
        navigateTo('/chat')
      } catch (createError) {
        const authCreateError = createError as { code: string }
        erroLogin.value = getMensagemErro(authCreateError.code)
      }
    } else {
      erroLogin.value = getMensagemErro(authError.code)
    }
  }
}

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

function enviar(event: FormSubmitEvent<{ usuario: string, senha: string }>) {
  fazerLogin(event.data.usuario, event.data.senha)
}
</script>

<template>
  <div class="flex flex-col items-center justify-center flex-1 h-full pt-10">
    <div class="flex flex-row gap-4 items-center">
      <div class="flex flex-col items-center">
        <h1 class="hidden xl:block md:text-6xl text-4xl font-bold font-sour-gummy">
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
      class="m-5 sm:p-2"
    >
      <UAuthForm
        :fields="campos"
        :schema="schema"
        class=" sm:min-w-lg"
        :submit="{
          label: 'Entre no lar',
          icon: 'solar:login-2-bold-duotone'
        }"
        :ui="{ leadingIcon: 'text-primary' }"
        @submit="enviar"
      >
        <template #validation>
          <UAlert
            v-if="erroLogin"
            color="error"
            icon="i-lucide-alert-circle"
            :title="erroLogin"
          />
        </template>
        <template #title>
          <div class="flex flex-row items-center justify-center gap-2">
            <img
              src="/entrar.png"
              class="w-20 flex items-center self-center mr-2"
              alt="HomeChat"
            >
            <div class="flex flex-col text-left">
              <span class="font-bold">Entrar em HomeChat</span>
              <span class="text-sm text-muted">Insira seus dados para entrar no lar da conversa</span>
            </div>
          </div>
        </template>
      </UAuthForm>
      <p class="text-sm text-muted text-center">
        Powered by SALO - HomeTech • © {{ new Date().getFullYear() }}
      </p>
    </UPageCard>
  </div>
</template>
