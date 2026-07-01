import { defineStore } from 'pinia'
import { EncryptStorage } from 'encrypt-storage'
import { useFetch } from '@vueuse/core'
import { Mock } from '@/modules/otFallidasCT/descarte/mock'
import { Motivos } from '@/modules/otFallidasCT/descarte/motivos'
import type { Filters, Row, Motivo, StoreState, ActionResponse } from './types'
import { emptyFilters } from './types'


const clave = import.meta.env.VITE_PARAMETER1 as string;
export const fallidasCtStore = new EncryptStorage(clave, { storageType: 'sessionStorage' });

export const useFallidasCtStore = defineStore('fallidasCT', {
    state: (): StoreState => ({
        activeTab: ['0'],
        filters: emptyFilters(),
        validFilters: true,
        rows: [],
        motivos: [],
        selectedRows: [],
        loading: false,
    }),

    getters: {
        getRow: (state: StoreState) => (index: number): Row | undefined =>
            state.rows[index],

        selectedNotExcludedRows: (state: StoreState): Row[] =>
            state.selectedRows
                .map(id => state.rows.find(row => row.id === id))   // busca en todos los datos las filas con los ids seleccionados
                .filter((row): row is Row => row !== undefined)     // elimina filas cuyo id no exista
                .filter(row => row.excluida === 'N')                // elimina filas ya excluidas
    },

    actions: {
        setFilter<K extends keyof Filters>(key: K, value: Filters[K]): void {
            this.filters[key] = value
        },        
        validateFilters() {
            // acá hay que agregar la lógica de validación de filtros
            this.validFilters = true
        },
        async setData(): Promise<void> {
            // esto hay que cambiarlo por la búsqueda real
            await Mock.getData().then((data: Row[]) => { this.rows = data })
        },
        async setMotivos(): Promise<void> {
            // esto hay que cambiarlo por la búsqueda real
            if (this.motivos.length === 0) {
                await Motivos.getMotivos().then((data: Motivo[]) => { this.motivos = data })
            }
        },
        setSelectedRows(rows: number[]): void {
            this.selectedRows = rows;
        },
        async sendExcluidas(rows: Row[], motivo: string, comentario: string): Promise<ActionResponse> {
            try {
                this.loading = true;
                const payload = {rows, motivo, comentario}
                const { data, error } = await useFetch('/pc/registroOTFallidasReproceso/excluirOTFallida.html')
                    .post(payload)
                    .json<ActionResponse>()
                console.log('data: ' + JSON.stringify(data.value))    
                console.log('error; ' + JSON.stringify(error.value))    
                if (error.value) {
                    return {status: false, respuesta: String(error.value)}
                }
                if (!data.value) {
                    return { status: false, respuesta: 'Respuesta vacía del servidor' }
                }
                return data.value
            } finally {
                this.loading = false
            }
        },
        clearFilters() {
            this.filters = emptyFilters()
        },
        clearStore(): void {
            this.$reset()
        },
    },

    persist: [
        {
            key: 'fallidasCT',             
            storage: {
                getItem: (key: string): string | null => fallidasCtStore.getItem(key) ?? null,
                setItem: (key: string, value: string): void => fallidasCtStore.setItem(key, value),
            },
        },
    ],
})

