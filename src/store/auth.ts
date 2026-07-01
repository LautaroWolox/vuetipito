import { defineStore } from 'pinia'

interface Usuario {
    nombre: string
    legajo: string
    email: string
}

interface PerfilState {
    autenticado: boolean
    rutas: string[]
    nombre: string
    legajo: string
    email: string
    usuario: Usuario | null
}

interface SetPerfilParams {
    autenticado: boolean
    rutas: string[]
    nombre: string
    email: string
    legajo: string
}

const storageKeyPrefix = 'fm_auth_'

export const authStore = {
    getItem: (key: string) => sessionStorage.getItem(`${storageKeyPrefix}${key}`),
    setItem: (key: string, value: string) => sessionStorage.setItem(`${storageKeyPrefix}${key}`, value),
    removeItem: (key: string) => sessionStorage.removeItem(`${storageKeyPrefix}${key}`)
}

export const useAuthStore = defineStore('auth', {
    state: (): PerfilState => ({
        autenticado: false,
        rutas: [],
        nombre: "",
        legajo: "",
        email: "",
        usuario: null
    }),
    actions: {
        setPerfil({ autenticado, rutas, nombre, email, legajo}: SetPerfilParams) {
            this.autenticado = autenticado
            this.rutas = rutas
            this.nombre = nombre
            this.legajo = legajo
            this.email = email
            this.usuario = { nombre, legajo, email }
        },
        logout() {
            this.$reset()
        },
    },
    persist: [
        {
            key: 'auth',
            storage: authStore,
        },
    ],
})
