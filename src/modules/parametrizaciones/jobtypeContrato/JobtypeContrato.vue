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
                  <Button
                    icon="pi pi-download"
                    text
                    rounded
                    class="fm-grid-action-final jobtype-grid-action"
                    title="Exportar"
                    aria-label="Exportar"
                    v-tooltip.top="'Exportar'"
                    @click="exportarExcel"
                  />
                  <Button
                    icon="pi pi-trash"
                    text
                    rounded
                    class="fm-grid-action-final jobtype-grid-action"
                    :disabled="!store.hasSelection"
                    title="Eliminar"
                    aria-label="Eliminar"
                    v-tooltip.top="'Eliminar'"
                    @click="eliminar"
                  />
                  <Button
                    icon="pi pi-pencil"
                    text
                    rounded
                    class="fm-grid-action-final jobtype-grid-action"
                    :disabled="!store.hasSelection"
                    title="Editar"
                    aria-label="Editar"
                    v-tooltip.top="'Editar'"
                    @click="abrirEdicion"
                  />
                  <Button
                    icon="pi pi-plus"
                    text
                    rounded
                    class="fm-grid-action-final jobtype-grid-action"
                    title="Nueva Relación"
                    aria-label="Nueva Relación"
                    v-tooltip.top="'Nueva Relación'"
                    @click="abrirAlta"
                  />
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
      header="Alta Jobtype - Contrato"
      class="fm-dialog jobtype-popup jobtype-popup--alta"
      appendTo="body"
      :modal="false"
      :draggable="true"
      :resizable="false"
      :style="{ width: '760px', maxWidth: 'calc(100vw - 48px)' }"
    >
      <div class="jobtype-alta-form">
        <div class="jobtype-field jobtype-field--pais">
          <label for="alta-pais">Pais</label>
          <Select
            id="alta-pais"
            v-model="altaForm.pais"
            :options="paisOptions"
            optionLabel="label"
            optionValue="value"
            class="jobtype-select"
          />
        </div>

        <div class="jobtype-field">
          <label for="alta-jobtype">Jobtype</label>
          <InputText id="alta-jobtype" v-model="altaForm.jobtype" class="jobtype-input" />
        </div>

        <div class="jobtype-field">
          <label for="alta-contrato">Contrato</label>
          <InputText id="alta-contrato" v-model="altaForm.contrato" class="jobtype-input" />
        </div>

        <Button
          label="AGREGAR"
          class="jobtype-popup-button jobtype-popup-button--add"
          :disabled="!canAgregarRelacion"
          @click="agregarRelacionPreview"
        />
      </div>

      <DataTable
        class="fm-pass-grid jobtype-popup-grid"
        :value="altaRows"
        dataKey="id"
        tableStyle="table-layout: fixed; width: 100%; min-width: 100%"
        scrollable
        scrollHeight="150px"
        paginator
        :rows="5"
        v-model:selection="altaSelectedRow"
        selectionMode="single"
        paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        currentPageReportTemplate="Página {currentPage} de {totalPages}"
        showGridlines
        @row-click="onAltaRowClick"
      >
        <Column field="codigoTarea" header="CODIGO_TAREA" :style="popupColumnStyle('150px')" />
        <Column field="tarea" header="TAREA" :style="popupColumnStyle('250px')" />
        <Column field="nombreContrato" header="NOMBRE_CONTRATO" :style="popupColumnStyle('210px')" />
        <Column field="pais" header="PAIS" :style="popupColumnStyle('90px')" />

        <template #paginatorstart>
          <Button
            icon="pi pi-trash"
            text
            rounded
            class="fm-grid-action-final jobtype-grid-action jobtype-popup-trash"
            :disabled="!altaSelectedRow"
            title="Eliminar"
            aria-label="Eliminar"
            v-tooltip.top="'Eliminar'"
            @click="eliminarAltaPreview"
          />
        </template>
      </DataTable>

      <template #footer>
        <Button
          label="RELACIONAR"
          class="jobtype-popup-button jobtype-popup-button--relacionar"
          :disabled="altaRows.length === 0"
          @click="relacionar"
        />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showEdicion"
      header="Edición Jobtype-Contrato"
      class="fm-dialog jobtype-popup jobtype-popup--edicion"
      appendTo="body"
      :modal="false"
      :draggable="true"
      :resizable="false"
      :style="{ width: '500px', maxWidth: 'calc(100vw - 48px)' }"
    >
      <div class="jobtype-edit-form">
        <div class="jobtype-field">
          <label for="edit-jobtype">JobType</label>
          <InputText id="edit-jobtype" v-model="editForm.jobtype" class="jobtype-input" disabled />
        </div>

        <div class="jobtype-field">
          <label for="edit-contrato-actual">Contrato</label>
          <InputText id="edit-contrato-actual" v-model="editForm.contratoActual" class="jobtype-input" disabled />
        </div>

        <div class="jobtype-field jobtype-field--offset">
          <InputText id="edit-contrato-nuevo" v-model="editForm.contratoNuevo" class="jobtype-input jobtype-input--active" />
        </div>
      </div>

      <template #footer>
        <Button
          label="ACTUALIZAR"
          class="jobtype-popup-button jobtype-popup-button--update"
          @click="actualizarRelacion"
        />
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

const popupColumnStyle = (width) => ({
  width,
  minWidth: width,
  maxWidth: width
})

const rowClass = (data) => ({
  'fm-selected-row': store.selectedRow?.id === data?.id,
  'jobtype-row-selected': store.selectedRow?.id === data?.id
})

const onRowClick = (event) => {
  if (event?.data) store.setSelectedRow(event.data)
}

const onAltaRowClick = (event) => {
  altaSelectedRow.value = event?.data || null
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
  showAlta.value = true
}

const agregarRelacionPreview = () => {
  if (!canAgregarRelacion.value) return

  altaRows.value = [
    ...altaRows.value,
    {
      id: Date.now(),
      codigoTarea: altaForm.jobtype.trim().toUpperCase(),
      tarea: altaForm.jobtype.trim(),
      nombreContrato: altaForm.contrato.trim(),
      pais: altaForm.pais
    }
  ]

  altaForm.jobtype = ''
  altaForm.contrato = ''
}

const eliminarAltaPreview = () => {
  if (!altaSelectedRow.value) return
  altaRows.value = altaRows.value.filter((row) => row.id !== altaSelectedRow.value.id)
  altaSelectedRow.value = null
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
  // Por ahora queda habilitado al seleccionar una fila.
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

.jobtype-contrato-grid :deep(.p-datatable-table) {
  table-layout: fixed !important;
}

.jobtype-contrato-grid :deep(.p-datatable-thead > tr > th),
.jobtype-contrato-grid :deep(.p-datatable-tbody > tr > td) {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr:hover > td) {
  background: rgba(0, 180, 181, .06) !important;
}

.jobtype-contrato-grid :deep(.p-datatable-tbody > tr.jobtype-row-selected > td),
.jobtype-contrato-grid :deep(.p-datatable-tbody > tr.p-highlight > td) {
  background: #e8f8fb !important;
  color: #0f2f3d !important;
  font-weight: 600 !important;
}

.jobtype-contrato-grid :deep(.p-column-header-content) {
  display: flex !important;
  align-items: center !important;
  gap: 4px !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: visible !important;
}

.jobtype-contrato-grid :deep(.p-column-title) {
  flex: 1 1 auto !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.jobtype-contrato-grid :deep(.p-sortable-column-icon),
.jobtype-contrato-grid :deep(.p-column-resizer) {
  flex: 0 0 auto !important;
  min-width: 12px !important;
  overflow: visible !important;
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
  outline: none !important;
  overflow: visible !important;
  transform: none !important;
}

.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:hover),
.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:focus),
.jobtype-grid-actions :deep(.p-button.jobtype-grid-action:focus-visible) {
  color: #008fa1 !important;
  background: transparent !important;
  background-color: transparent !important;
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
  overflow: visible !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:global(.jobtype-popup.p-dialog) {
  border-radius: 2px !important;
  box-shadow: 0 12px 28px rgba(21, 37, 50, .18) !important;
  overflow: hidden !important;
}

:global(.jobtype-popup .p-dialog-header) {
  min-height: 40px !important;
  padding: 9px 14px !important;
  border-bottom: 1px solid #e2e9ee !important;
  cursor: move !important;
}

:global(.jobtype-popup .p-dialog-title) {
  color: #456273 !important;
  font-size: 18px !important;
  font-weight: 400 !important;
}

:global(.jobtype-popup .p-dialog-header-close) {
  width: 24px !important;
  height: 24px !important;
  color: #9eb1bc !important;
}

:global(.jobtype-popup .p-dialog-content) {
  padding: 14px 16px 10px !important;
  overflow: hidden !important;
}

:global(.jobtype-popup .p-dialog-footer) {
  padding: 10px 16px 14px !important;
  border-top: 1px solid #edf2f5 !important;
  display: flex !important;
  justify-content: flex-end !important;
}

.jobtype-alta-form,
.jobtype-edit-form {
  display: grid;
  align-items: end;
}

.jobtype-alta-form {
  grid-template-columns: 120px minmax(0, 1fr) minmax(0, 1fr) 112px;
  gap: 14px;
  margin-bottom: 16px;
}

.jobtype-edit-form {
  grid-template-columns: 1fr 1fr;
  column-gap: 20px;
  row-gap: 14px;
}

.jobtype-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.jobtype-field label {
  color: #000000;
  font-size: 12px;
  font-weight: 700;
}

.jobtype-input,
.jobtype-select {
  width: 100% !important;
  height: 32px !important;
  min-height: 32px !important;
  font-size: 13px !important;
}

.jobtype-select :deep(.p-select-label) {
  padding-top: 6px !important;
  padding-bottom: 6px !important;
  font-size: 13px !important;
}

.jobtype-input--active {
  border-color: #00b4b5 !important;
}

.jobtype-field--offset {
  grid-column: 2 / 3;
}

.jobtype-popup-button,
.jobtype-popup-button:enabled:hover,
.jobtype-popup-button:enabled:focus {
  min-width: 108px !important;
  height: 32px !important;
  padding: 0 18px !important;
  border-radius: 18px !important;
  border: 1px solid #00a9bd !important;
  background: #00a9bd !important;
  color: #ffffff !important;
  box-shadow: 0 3px 7px rgba(0, 169, 189, .18) !important;
  font-size: 12px !important;
  font-weight: 700 !important;
}

.jobtype-popup-button:disabled,
.jobtype-popup-button.p-disabled {
  background: #b8c6ce !important;
  border-color: #b8c6ce !important;
  color: #ffffff !important;
  box-shadow: none !important;
  opacity: 1 !important;
}

.jobtype-popup-button--add {
  align-self: end;
  justify-self: stretch;
}

.jobtype-popup-button--relacionar,
.jobtype-popup-button--update {
  min-width: 116px !important;
}

.jobtype-popup-grid {
  min-height: 190px;
  border: 1px solid #d7e1e7;
}

.jobtype-popup-grid :deep(.p-datatable-wrapper) {
  overflow-x: hidden !important;
}

.jobtype-popup-grid :deep(.p-datatable-table) {
  width: 100% !important;
  min-width: 100% !important;
  table-layout: fixed !important;
}

.jobtype-popup-grid :deep(.p-datatable-thead > tr > th) {
  height: 36px !important;
  padding: 0 10px !important;
  color: #456273 !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
}

.jobtype-popup-grid :deep(.p-datatable-tbody > tr > td) {
  height: 32px !important;
  padding: 0 10px !important;
  font-size: 12px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.jobtype-popup-grid :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

.jobtype-popup-grid :deep(.p-datatable-tbody > tr:hover > td),
.jobtype-popup-grid :deep(.p-datatable-tbody > tr.p-highlight > td) {
  background: #e8f8fb !important;
  color: #0f2f3d !important;
}

.jobtype-popup-grid :deep(.p-paginator) {
  min-height: 42px !important;
  padding: 4px 8px !important;
  justify-content: center !important;
  border-top: 1px solid #edf2f5 !important;
}

.jobtype-popup-grid :deep(.p-paginator-left-content) {
  margin-right: auto !important;
}

.jobtype-popup-grid :deep(.p-paginator-page),
.jobtype-popup-grid :deep(.p-paginator-first),
.jobtype-popup-grid :deep(.p-paginator-prev),
.jobtype-popup-grid :deep(.p-paginator-next),
.jobtype-popup-grid :deep(.p-paginator-last) {
  min-width: 24px !important;
  width: 24px !important;
  height: 24px !important;
  margin: 0 1px !important;
  font-size: 12px !important;
}

.jobtype-popup-trash {
  width: 16px !important;
  height: 16px !important;
}

@media (max-width: 820px) {
  .jobtype-alta-form {
    grid-template-columns: 1fr 1fr;
  }

  .jobtype-popup-button--add {
    justify-self: start;
    width: 112px;
  }
}
</style>
