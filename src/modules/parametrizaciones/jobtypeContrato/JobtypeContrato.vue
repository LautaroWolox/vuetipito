<template>
  <div class="fm-screen fm-screen--pad jobtype-contrato-page">
    <Accordion v-model:value="activePanels" multiple class="fm-accordion jobtype-contrato-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS DE BÚSQUEDA</AccordionHeader>
        <AccordionContent>
          <div class="jobtype-contrato-filters">
            <FmButton
              label="BUSCAR"
              icon="pi-search"
              :loading="store.loading"
              loading-label="BUSCANDO..."
              @click="buscar"
            />
          </div>
        </AccordionContent>
      </AccordionPanel>

      <AccordionPanel v-if="store.searched || store.loading" value="1">
        <AccordionHeader>RELACIONES JOBTYPE-CONTRATO</AccordionHeader>
        <AccordionContent>
          <FmGridShell
            :loading="store.loading"
            loading-title="Cargando Jobtype-Contrato"
            loading-message="Consultando relaciones jobtype-contrato"
          >
            <DataTable
              id="tabla-jobtype-contrato"
              ref="dt"
              class="fm-pass-grid jobtype-contrato-grid"
              :value="store.rows"
              dataKey="id"
              tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
              scrollable
              scrollHeight="430px"
              removableSort
              sortMode="multiple"
              filterDisplay="row"
              v-model:filters="filters"
              v-model:selection="selectedRow"
              selectionMode="single"
              :rowClass="rowClass"
              paginator
              :rows="10"
              :rowsPerPageOptions="[10, 20, 50, 100]"
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="Pagina {currentPage} de {totalPages}"
              :resizableColumns="true"
              columnResizeMode="expand"
              showGridlines
              @row-click="onRowClick"
            >
              <template #paginatorstart>
                <div class="jobtype-grid-actions" aria-label="Acciones de grilla">
                  <Button icon="pi pi-download" text rounded class="fm-grid-action-final jobtype-grid-action" title="Exportar" aria-label="Exportar" v-tooltip.top="'Exportar'" @click="exportarExcel" />
                  <Button icon="pi pi-trash" text rounded class="fm-grid-action-final jobtype-grid-action" :disabled="!store.hasSelection" title="Eliminar" aria-label="Eliminar" v-tooltip.top="'Eliminar'" @click="eliminar" />
                  <Button icon="pi pi-pencil" text rounded class="fm-grid-action-final jobtype-grid-action" :disabled="!store.hasSelection" title="Editar" aria-label="Editar" v-tooltip.top="'Editar'" @click="abrirEdicion" />
                  <Button icon="pi pi-plus" text rounded class="fm-grid-action-final jobtype-grid-action" title="Nueva Relación" aria-label="Nueva Relación" v-tooltip.top="'Nueva Relación'" @click="abrirAlta" />
                </div>
              </template>

              <template #paginatorend>
                <span class="fm-grid-counter">
                  Mostrando {{ store.rows.length ? 1 : 0 }} - {{ Math.min(10, store.rows.length) }} de {{ store.rows.length }}
                </span>
              </template>

              <template #empty>
                <div class="fm-grid-empty">No hay resultados</div>
              </template>

              <Column
                v-for="col in columns"
                :key="col.field"
                :field="col.field"
                :sortField="col.field"
                :filterField="col.field"
                :header="col.header"
                sortable
                filter
                :showFilterMenu="false"
                :exportable="col.exportable"
                :style="columnStyle(col)"
                :headerStyle="columnStyle(col)"
                :bodyStyle="columnStyle(col)"
              >
                <template #filter="{ filterModel, filterCallback }">
                  <div class="fm-filter-cell jobtype-filter-cell">
                    <span class="fm-filter-prefix">~</span>
                    <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
                    <span class="fm-filter-more">...</span>
                  </div>
                </template>

                <template #body="{ data }">
                  <span class="fm-cell-text jobtype-cell-text" :title="String(data[col.field] ?? '')">
                    {{ data[col.field] ?? '' }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <Dialog
      v-model:visible="showAlta"
      class="jobtype-modal jobtype-modal--alta"
      appendTo="body"
      :modal="true"
      :draggable="true"
      :resizable="false"
      :closable="false"
      :style="{ width: '780px', maxWidth: 'calc(100vw - 64px)' }"
    >
      <template #header>
        <div class="jobtype-modal-header">
          <span class="jobtype-modal-title">Alta Jobtype - Contrato</span>
          <span
            role="button"
            tabindex="0"
            class="jobtype-modal-close"
            aria-label="Cerrar"
            @click="showAlta = false"
            @keydown.enter.prevent="showAlta = false"
            @keydown.space.prevent="showAlta = false"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </span>
        </div>
      </template>

      <div class="jobtype-modal-form">
        <div class="jobtype-modal-field jobtype-modal-field--pais">
          <label for="alta-pais">Pais</label>
          <Select id="alta-pais" v-model="altaForm.pais" :options="paisOptions" optionLabel="label" optionValue="value" class="jobtype-modal-select" />
        </div>

        <div class="jobtype-modal-field">
          <label for="alta-jobtype">Jobtype</label>
          <InputText id="alta-jobtype" v-model="altaForm.jobtype" class="jobtype-modal-input" />
        </div>

        <div class="jobtype-modal-field">
          <label for="alta-contrato">Contrato</label>
          <InputText id="alta-contrato" v-model="altaForm.contrato" class="jobtype-modal-input" />
        </div>

        <Button label="AGREGAR" class="jobtype-modal-button jobtype-modal-button--add" :disabled="!canAgregarRelacion" @click="agregarRelacionPreview" />
      </div>

      <div class="jobtype-popup-grid-shell">
        <DataTable
          id="tabla-alta-jobtype-contrato"
          class="fm-pass-grid jobtype-popup-datatable"
          :value="altaRows"
          dataKey="id"
          tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
          scrollable
          scrollHeight="210px"
          removableSort
          sortMode="multiple"
          filterDisplay="row"
          v-model:filters="altaTableFilters"
          v-model:selection="altaSelectedRow"
          selectionMode="single"
          :rowClass="altaRowClass"
          paginator
          :rows="5"
          :rowsPerPageOptions="[5, 10, 20]"
          paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
          currentPageReportTemplate="Página {currentPage} de {totalPages}"
          :resizableColumns="true"
          columnResizeMode="expand"
          showGridlines
          @row-click="onAltaRowClick"
        >
          <template #paginatorstart>
            <Button icon="pi pi-trash" text rounded class="fm-grid-action-final jobtype-grid-action jobtype-modal-icon-button" :disabled="!altaSelectedRow" title="Eliminar" aria-label="Eliminar" v-tooltip.top="'Eliminar'" @click="eliminarAltaPreview" />
          </template>

          <template #empty>
            <div class="jobtype-popup-grid-empty">No hay relaciones agregadas</div>
          </template>

          <Column
            v-for="col in altaGridColumns"
            :key="col.key"
            :field="col.key"
            :sortField="col.key"
            :filterField="col.key"
            :header="col.label"
            sortable
            filter
            :showFilterMenu="false"
            :style="altaColumnStyle(col)"
            :headerStyle="altaColumnStyle(col)"
            :bodyStyle="altaColumnStyle(col)"
          >
            <template #filter="{ filterModel, filterCallback }">
              <div class="fm-filter-cell jobtype-filter-cell jobtype-popup-filter-cell">
                <span class="fm-filter-prefix">~</span>
                <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
                <span class="fm-filter-more">...</span>
              </div>
            </template>

            <template #body="{ data }">
              <span class="fm-cell-text jobtype-cell-text" :title="String(data[col.key] ?? '')">
                {{ data[col.key] ?? '' }}
              </span>
            </template>
          </Column>
        </DataTable>
      </div>

      <template #footer>
        <Button label="RELACIONAR" class="jobtype-modal-button jobtype-modal-button--relacionar" :disabled="altaRows.length === 0" @click="relacionar" />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showEdicion"
      class="jobtype-modal jobtype-modal--edicion"
      appendTo="body"
      :modal="true"
      :draggable="true"
      :resizable="false"
      :closable="false"
      :style="{ width: '500px', maxWidth: 'calc(100vw - 64px)' }"
    >
      <template #header>
        <div class="jobtype-modal-header">
          <span class="jobtype-modal-title">Edición Jobtype-Contrato</span>
          <span
            role="button"
            tabindex="0"
            class="jobtype-modal-close"
            aria-label="Cerrar"
            @click="showEdicion = false"
            @keydown.enter.prevent="showEdicion = false"
            @keydown.space.prevent="showEdicion = false"
          >
            <i class="pi pi-times" aria-hidden="true"></i>
          </span>
        </div>
      </template>

      <div class="jobtype-edit-form">
        <div class="jobtype-modal-field">
          <label for="edit-jobtype">JobType</label>
          <InputText id="edit-jobtype" v-model="editForm.jobtype" class="jobtype-modal-input" disabled />
        </div>

        <div class="jobtype-modal-field">
          <label for="edit-contrato-actual">Contrato</label>
          <InputText id="edit-contrato-actual" v-model="editForm.contratoActual" class="jobtype-modal-input" disabled />
        </div>

        <div class="jobtype-modal-field jobtype-field--offset">
          <InputText id="edit-contrato-nuevo" v-model="editForm.contratoNuevo" class="jobtype-modal-input jobtype-input--active" />
        </div>
      </div>

      <template #footer>
        <Button label="ACTUALIZAR" class="jobtype-modal-button jobtype-modal-button--update" @click="actualizarRelacion" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import { FilterMatchMode } from '@primevue/core/api'
import { useExcelExport } from '@/composables/useExportExcel'
import { jobtypeContratoColumns } from './columns'
import { useJobtypeContratoStore } from './store'

const store = useJobtypeContratoStore()
const dt = ref()
const activePanels = ref(['0'])
const columns = ref(jobtypeContratoColumns)
const { exportToExcel, parseDataFromTable } = useExcelExport()

const showAlta = ref(false)
const showEdicion = ref(false)
const altaRows = ref([])
const altaSelectedRow = ref(null)
const altaSelectedCell = ref(null)

const altaGridColumns = ref([
  { key: 'codigoTarea', label: 'CODIGO_TAREA', width: '170px', minWidth: '140px' },
  { key: 'tarea', label: 'TAREA', width: '250px', minWidth: '180px' },
  { key: 'nombreContrato', label: 'NOMBRE_CONTRATO', width: '210px', minWidth: '170px' },
  { key: 'pais', label: 'PAIS', width: '100px', minWidth: '90px' }
])

const paisOptions = [
  { label: '', value: '' },
  { label: 'ARG/UY', value: 'ARG/UY' },
  { label: 'ARG', value: 'ARG' },
  { label: 'UY', value: 'UY' }
]

const altaForm = reactive({
  pais: '',
  jobtype: '',
  contrato: ''
})

const editForm = reactive({
  jobtype: '',
  contratoActual: '',
  contratoNuevo: ''
})

const filters = ref(
  Object.fromEntries(
    columns.value.map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])
  )
)

const altaTableFilters = ref(
  Object.fromEntries(
    altaGridColumns.value.map((col) => [col.key, { value: null, matchMode: FilterMatchMode.CONTAINS }])
  )
)

const selectedRow = computed({
  get: () => store.selectedRow,
  set: (value) => store.setSelectedRow(value)
})

const canAgregarRelacion = computed(() => Boolean(altaForm.jobtype.trim() && altaForm.contrato.trim() && altaForm.pais))

const buscar = async () => {
  activePanels.value = ['0', '1']
  await store.search()
  activePanels.value = ['0', '1']
}

const columnStyle = (col) => ({
  width: col.width || '140px',
  minWidth: col.minWidth || col.width || '100px',
  maxWidth: 'none'
})

const altaColumnStyle = (col) => ({
  width: col.width || '140px',
  minWidth: col.minWidth || col.width || '100px',
  maxWidth: 'none'
})

const rowClass = (data) => ({
  'fm-selected-row': store.selectedRow?.id === data?.id,
  'jobtype-row-selected': store.selectedRow?.id === data?.id
})

const altaRowClass = (data) => ({
  'fm-selected-row': altaSelectedRow.value?.id === data?.id,
  'jobtype-row-selected': altaSelectedRow.value?.id === data?.id
})

const onRowClick = (event) => {
  if (event?.data) store.setSelectedRow(event.data)
}

const onAltaRowClick = (event) => {
  if (event?.data) {
    altaSelectedRow.value = event.data
    altaSelectedCell.value = { rowId: event.data.id, field: 'codigoTarea' }
  }
}

const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  exportToExcel({
    rows: parsed.rows,
    fields: parsed.fields,
    columns: columns.value,
    filename: 'jobtype_contrato.xlsx',
    columnTypes: {},
    groupField: null
  })
}

const abrirAlta = () => {
  altaForm.pais = ''
  altaForm.jobtype = ''
  altaForm.contrato = ''
  altaRows.value = []
  altaSelectedRow.value = null
  altaSelectedCell.value = null
  Object.values(altaTableFilters.value).forEach((filter) => {
    filter.value = null
  })
  showAlta.value = true
}

const agregarRelacionPreview = () => {
  if (!canAgregarRelacion.value) return

  const newRow = {
    id: Date.now(),
    codigoTarea: altaForm.jobtype.trim().toUpperCase(),
    tarea: altaForm.jobtype.trim(),
    nombreContrato: altaForm.contrato.trim(),
    pais: altaForm.pais
  }

  altaRows.value = [...altaRows.value, newRow]
  altaSelectedRow.value = newRow
  altaSelectedCell.value = { rowId: newRow.id, field: 'codigoTarea' }
  altaForm.jobtype = ''
  altaForm.contrato = ''
}

const eliminarAltaPreview = () => {
  if (!altaSelectedRow.value) return
  const deletedId = altaSelectedRow.value.id
  altaRows.value = altaRows.value.filter((row) => row.id !== deletedId)
  altaSelectedRow.value = null
  altaSelectedCell.value = null
}

const relacionar = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - ALTA RELACION JOBTYPE-CONTRATO
  // Enviar altaRows.value al servicio real y refrescar la grilla principal.
  showAlta.value = false
}

const abrirEdicion = () => {
  if (!store.selectedRow) return

  editForm.jobtype = store.selectedRow.tarea || store.selectedRow.codigoTarea || ''
  editForm.contratoActual = store.selectedRow.nombreContrato || ''
  editForm.contratoNuevo = ''
  showEdicion.value = true
}

const actualizarRelacion = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - ACTUALIZAR RELACION JOBTYPE-CONTRATO
  // Usar store.selectedRow y editForm.contratoNuevo para actualizar la relacion.
  showEdicion.value = false
}

const eliminar = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - ELIMINAR RELACION JOBTYPE-CONTRATO
}
</script>

<style scoped>
.jobtype-contrato-page {
  width: 100%;
}

.jobtype-contrato-page :deep(.jobtype-contrato-accordion) {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.jobtype-contrato-page :deep(.p-accordionpanel + .p-accordionpanel) {
  margin-top: 4px !important;
}

.jobtype-contrato-filters {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
}

.jobtype-contrato-grid :deep(.p-datatable-table),
.jobtype-popup-datatable :deep(.p-datatable-table) {
  table-layout: fixed !important;
}

.jobtype-contrato-grid :deep(.p-datatable-thead > tr > th),
.jobtype-contrato-grid :deep(.p-datatable-tbody > tr > td),
.jobtype-popup-datatable :deep(.p-datatable-thead > tr > th),
.jobtype-popup-datatable :deep(.p-datatable-tbody > tr > td) {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr),
.jobtype-popup-datatable :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr:hover > td),
.jobtype-popup-datatable :deep(.p-datatable-tbody > tr:hover > td) {
  background: rgba(0, 180, 181, .06) !important;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr.jobtype-row-selected > td),
.jobtype-contrato-grid :deep(.p-datatable-tbody > tr.p-highlight > td),
.jobtype-popup-datatable :deep(.p-datatable-tbody > tr.jobtype-row-selected > td),
.jobtype-popup-datatable :deep(.p-datatable-tbody > tr.p-highlight > td) {
  background: #e8f8fb !important;
  color: #0f2f3d !important;
  font-weight: 600 !important;
}

.jobtype-cell-text {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.jobtype-grid-actions {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 12px !important;
  overflow: visible !important;
  line-height: 1 !important;
}

.jobtype-grid-actions :deep(.p-button.jobtype-grid-action) {
  width: 16px !important;
  min-width: 16px !important;
  max-width: 16px !important;
  height: 16px !important;
  min-height: 16px !important;
  max-height: 16px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  color: #4f6673 !important;
  box-shadow: none !important;
}

.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:hover),
.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:focus) {
  color: #008fa1 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:disabled),
.jobtype-grid-actions :deep(.p-button.jobtype-grid-action.p-disabled) {
  color: #b7c1c8 !important;
  opacity: .68 !important;
  cursor: not-allowed !important;
}

.jobtype-grid-actions :deep(.p-button-label) {
  display: none !important;
}

.jobtype-grid-actions :deep(.p-button-icon),
.jobtype-grid-actions :deep(.pi) {
  width: 12px !important;
  min-width: 12px !important;
  height: 12px !important;
  min-height: 12px !important;
  font-size: 12px !important;
  line-height: 12px !important;
  margin: 0 !important;
}
</style>
