import { defineStore } from 'pinia'

const waitForLoader = (ms = 750) => new Promise((resolve) => window.setTimeout(resolve, ms))

const baseRows = [
  { id: 1, codigoTarea: 'SHDA0', tarea: 'SMB - ALTAS HFC', nombreContrato: 'Materiales', usuarioModificacion: 'z002456', fechaModificacion: '19/06/2026 17:30', activo: 'N', pais: 'ARG' },
  { id: 2, codigoTarea: 'SAMAW', tarea: 'DOM - TRIAL SAM AMAZON WEB SERVICE', nombreContrato: 'Eventos', usuarioModificacion: 'u573795', fechaModificacion: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { id: 3, codigoTarea: 'RTMPI', tarea: 'RED - MPI - Tarea General de MPI', nombreContrato: 'Eventos', usuarioModificacion: 'u573795', fechaModificacion: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { id: 4, codigoTarea: 'RTHFC', tarea: 'RED - HFC - Tarea General de Redes', nombreContrato: 'Eventos', usuarioModificacion: 'u573795', fechaModificacion: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { id: 5, codigoTarea: 'RSRUN', tarea: 'DRC - SRE REPARAR DEGRADACION POR ENCIMA DEL UMBRAL', nombreContrato: 'Materiales', usuarioModificacion: 'z002456', fechaModificacion: '13/12/2024 13:04', activo: 'S', pais: 'ARG/UY' },
  { id: 6, codigoTarea: 'RSRRN', tarea: 'RED - SERVICE REVERSA', nombreContrato: 'Eventos', usuarioModificacion: 'u573795', fechaModificacion: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { id: 7, codigoTarea: 'RSRNN', tarea: 'DRC - SRE REPARAR PROBLEMA DE NIVELES', nombreContrato: 'BBI Siniestros', usuarioModificacion: 'z002456', fechaModificacion: '15/12/2025 14:31', activo: 'S', pais: 'ARG/UY' },
  { id: 8, codigoTarea: 'RSRIN', tarea: 'DRC - SRE REPARAR DEGRADACION DE SENAL INTERMITENTE', nombreContrato: 'BBI Siniestros', usuarioModificacion: 'z002456', fechaModificacion: '15/12/2025 14:31', activo: 'S', pais: 'ARG/UY' },
  { id: 9, codigoTarea: 'RSRCN', tarea: 'RED - SERVICE DE RED CLIENTE', nombreContrato: 'Eventos', usuarioModificacion: 'z002456', fechaModificacion: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { id: 10, codigoTarea: 'RSDRN', tarea: 'RED - SRC DEGRADACION REITERADA', nombreContrato: 'Materiales', usuarioModificacion: 'u573795', fechaModificacion: '22/07/2025 11:09', activo: 'S', pais: 'ARG/UY' },
  { id: 11, codigoTarea: 'BMDES', tarea: 'BAJA MATERIAL DESCARGADO', nombreContrato: 'Materiales', usuarioModificacion: 'z002456', fechaModificacion: '03/03/2026 09:20', activo: 'S', pais: 'ARG' },
  { id: 12, codigoTarea: 'EVTCL', tarea: 'EVENTO CLIENTE - CONTROL DE CIERRE', nombreContrato: 'Eventos', usuarioModificacion: 'u573795', fechaModificacion: '12/04/2026 12:45', activo: 'S', pais: 'ARG/UY' }
]

export const useJobtypeContratoStore = defineStore('jobtypeContrato', {
  state: () => ({
    loading: false,
    searched: false,
    rows: [],
    selectedRow: null
  }),

  getters: {
    hasSelection: (state) => Boolean(state.selectedRow)
  },

  actions: {
    async search() {
      this.loading = true
      this.searched = true
      this.selectedRow = null

      try {
        // ACA TIENE QUE CONECTAR EL BACKEND - BUSCAR RELACIONES JOBTYPE-CONTRATO
        // Endpoint legacy estimado:
        // /pc/jobtypeContrato/search.html
        // Reemplazar este mock por la llamada real y mapear la respuesta con la
        // misma estructura usada por jobtypeContratoColumns.
        await waitForLoader()
        this.rows = baseRows.map((row) => ({ ...row }))
      } finally {
        this.loading = false
      }
    },

    setSelectedRow(row) {
      this.selectedRow = row || null
    },

    clearSelection() {
      this.selectedRow = null
    }
  }
})
