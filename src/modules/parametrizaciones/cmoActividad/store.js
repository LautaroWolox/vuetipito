import { defineStore } from 'pinia'

const waitForLoader = (ms = 850) => new Promise((resolve) => window.setTimeout(resolve, ms))

const baseRows = [
  { id: 1, codigoActividad: 'ACT001', descActividad: 'Alta actividad de materiales', codigoS4: 'S4-001', cmo: 'CMO HFC', usuarioModificacion: 'z002456', fechaModificacion: '19/06/2026 17:30', activo: 'S' },
  { id: 2, codigoActividad: 'ACT002', descActividad: 'Descarga material técnico', codigoS4: 'S4-002', cmo: 'CMO REDES', usuarioModificacion: 'u573795', fechaModificacion: '22/07/2025 11:09', activo: 'S' },
  { id: 3, codigoActividad: 'ACT003', descActividad: 'Control operación contratista', codigoS4: 'S4-003', cmo: 'CMO EVENTOS', usuarioModificacion: 'u573795', fechaModificacion: '22/07/2025 11:09', activo: 'S' },
  { id: 4, codigoActividad: 'ACT004', descActividad: 'Revisión actividad S4', codigoS4: 'S4-004', cmo: 'CMO MATERIALES', usuarioModificacion: 'z002456', fechaModificacion: '13/12/2024 13:04', activo: 'N' },
  { id: 5, codigoActividad: 'ACT005', descActividad: 'Validación CMO actividad', codigoS4: 'S4-005', cmo: 'CMO SOPORTE', usuarioModificacion: 'u573795', fechaModificacion: '15/12/2025 14:31', activo: 'S' },
  { id: 6, codigoActividad: 'ACT006', descActividad: 'Relación CMO administrativa', codigoS4: 'S4-006', cmo: 'CMO BACKOFFICE', usuarioModificacion: 'z002456', fechaModificacion: '15/12/2025 14:31', activo: 'S' },
  { id: 7, codigoActividad: 'ACT007', descActividad: 'Monitoreo ejecución actividad', codigoS4: 'S4-007', cmo: 'CMO OPERACIONES', usuarioModificacion: 'z002456', fechaModificacion: '22/07/2025 11:09', activo: 'S' },
  { id: 8, codigoActividad: 'ACT008', descActividad: 'Actividad de cierre contratista', codigoS4: 'S4-008', cmo: 'CMO CONTRATISTA', usuarioModificacion: 'u573795', fechaModificacion: '22/07/2025 11:09', activo: 'S' },
  { id: 9, codigoActividad: 'ACT009', descActividad: 'Actividad general de redes', codigoS4: 'S4-009', cmo: 'CMO RED CLIENTE', usuarioModificacion: 'z002456', fechaModificacion: '03/03/2026 09:20', activo: 'S' },
  { id: 10, codigoActividad: 'ACT010', descActividad: 'Control integracion CMO', codigoS4: 'S4-010', cmo: 'CMO INTEGRACION', usuarioModificacion: 'u573795', fechaModificacion: '12/04/2026 12:45', activo: 'S' },
  { id: 11, codigoActividad: 'ACT011', descActividad: 'Soporte CMO actividad', codigoS4: 'S4-011', cmo: 'CMO SOPORTE NIVEL 2', usuarioModificacion: 'z002456', fechaModificacion: '18/05/2026 10:20', activo: 'S' },
  { id: 12, codigoActividad: 'ACT012', descActividad: 'Actividad prueba masiva', codigoS4: 'S4-012', cmo: 'CMO PRUEBAS', usuarioModificacion: 'u573795', fechaModificacion: '04/06/2026 08:35', activo: 'S' }
]

export const useCmoActividadStore = defineStore('cmoActividad', {
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
        // ACA TIENE QUE CONECTAR EL BACKEND - BUSCAR RELACIONES CMO-ACTIVIDAD
        // Endpoint legacy estimado:
        // /pc/configuraCmoActividad/search.html
        // Reemplazar este mock por la llamada real y mapear la respuesta con la
        // misma estructura usada por cmoActividadColumns.
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
