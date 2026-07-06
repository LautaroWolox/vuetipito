<template>
  <div class="fm-screen fm-screen--pad jobtype-contrato-page cmo-actividad-page">
    <Accordion v-model:value="activePanels" multiple class="fm-accordion jobtype-contrato-accordion cmo-actividad-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS DE BÚSQUEDA</AccordionHeader>
        <AccordionContent>
          <div class="jobtype-contrato-filters cmo-actividad-filters">
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
        <AccordionHeader>RELACIONES CMO-ACTIVIDAD</AccordionHeader>
        <AccordionContent>
          <FmGridShell
            :loading="store.loading"
            loading-title="Cargando CMO-Actividad"
            loading-message="Consultando relaciones CMO-Actividad"
          >
            <div class="cmo-actividad-grid-wrap">
              <DataTable
                id="tabla-cmo-actividad"
                ref="dt"
                class="fm-pass-grid jobtype-contrato-grid cmo-actividad-grid"
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
                paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Pagina {currentPage} de {totalPages}"
                :resizableColumns="true"
                columnResizeMode="expand"
                showGridlines
                @row-click="onRowClick"
              >
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
                    <div class="fm-filter-cell jobtype-filter-cell cmo-actividad-filter-cell">
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

              <div class="cmo-actividad-grid-actions-fixed" aria-label="Acciones de grilla">
                <Button icon="pi pi-download" text rounded class="cmo-actividad-grid-action" title="Exportar" aria-label="Exportar" v-tooltip.top="'Exportar'" @click="exportarExcel" />
                <Button icon="pi pi-plus" text rounded class="cmo-actividad-grid-action" title="Nueva Relación" aria-label="Nueva Relación" v-tooltip.top="'Nueva Relación'" @click="abrirAlta" />
                <Button icon="pi pi-pencil" text rounded class="cmo-actividad-grid-action" :disabled="!store.hasSelection" title="Editar" aria-label="Editar" v-tooltip.top="'Editar'" @click="abrirEdicion" />
                <Button icon="pi pi-trash" text rounded class="cmo-actividad-grid-action" :disabled="!store.hasSelection" title="Eliminar" aria-label="Eliminar" v-tooltip.top="'Eliminar'" @click="eliminar" />
              </div>
            </div>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>

    <Dialog
      v-model:visible="showAlta"
      class="jobtype-modal jobtype-modal--alta cmo-actividad-modal cmo-actividad-modal--alta"
      appendTo="body"
      :modal="true"
      :draggable="true"
      :resizable="false"
      :closable="false"
      :style="{ width: '780px', maxWidth: 'calc(100vw - 64px)' }"
    >
      <template #header>
        <div class="jobtype-modal-header">
          <span class="jobtype-modal-title">Alta CMO - Actividad</span>
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

      <div class="cmo-actividad-popup-placeholder">
        <span>Popup CMO-Actividad preparado para adaptar el flujo específico.</span>
      </div>

      <template #footer>
        <Button label="RELACIONAR" class="jobtype-modal-button jobtype-modal-button--relacionar" disabled />
      </template>
    </Dialog>

    <Dialog
      v-model:visible="showEdicion"
      class="jobtype-modal jobtype-modal--edicion cmo-actividad-modal cmo-actividad-modal--edicion"
      appendTo="body"
      :modal="true"
      :draggable="true"
      :resizable="false"
      :closable="false"
      :style="{ width: '500px', maxWidth: 'calc(100vw - 64px)' }"
    >
      <template #header>
        <div class="jobtype-modal-header">
          <span class="jobtype-modal-title">Edición CMO-Actividad</span>
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

      <div class="cmo-actividad-popup-placeholder">
        <span>Popup de edición CMO-Actividad preparado para adaptar el flujo específico.</span>
      </div>

      <template #footer>
        <Button label="ACTUALIZAR" class="jobtype-modal-button jobtype-modal-button--update" disabled />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'
import { useExcelExport } from '@/composables/useExportExcel'
import { cmoActividadColumns } from './columns'
import { useCmoActividadStore } from './store'

const store = useCmoActividadStore()
const dt = ref()
const activePanels = ref(['0'])
const columns = ref(cmoActividadColumns)
const { exportToExcel, parseDataFromTable } = useExcelExport()

const showAlta = ref(false)
const showEdicion = ref(false)

const filters = ref(
  Object.fromEntries(
    columns.value.map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])
  )
)

const selectedRow = computed({
  get: () => store.selectedRow,
  set: (value) => store.setSelectedRow(value)
})

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

const rowClass = (data) => ({
  'fm-selected-row': store.selectedRow?.id === data?.id,
  'jobtype-row-selected': store.selectedRow?.id === data?.id,
  'cmo-actividad-row-selected': store.selectedRow?.id === data?.id
})

const onRowClick = (event) => {
  if (event?.data) store.setSelectedRow(event.data)
}

const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  exportToExcel({
    rows: parsed.rows,
    fields: parsed.fields,
    columns: columns.value,
    filename: 'cmo_actividad.xlsx',
    columnTypes: {},
    groupField: null
  })
}

const abrirAlta = () => {
  showAlta.value = true
}

const abrirEdicion = () => {
  if (!store.selectedRow) return
  showEdicion.value = true
}

const eliminar = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - ELIMINAR RELACION CMO-ACTIVIDAD
}
</script>

<style scoped>
.cmo-actividad-page {
  width: 100%;
}

.cmo-actividad-page :deep(.cmo-actividad-accordion) {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.cmo-actividad-page :deep(.p-accordionpanel + .p-accordionpanel) {
  margin-top: 4px !important;
}

.cmo-actividad-filters {
  min-height: 86px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
}

.cmo-actividad-grid-wrap {
  position: relative;
  width: 100%;
  min-width: 0;
}

.cmo-actividad-grid-wrap::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 35px;
  width: 2px;
  background: #00a9bd;
  z-index: 7;
  pointer-events: none;
}

.cmo-actividad-grid-wrap :deep(.p-datatable),
.cmo-actividad-grid-wrap :deep(.p-datatable-wrapper),
.cmo-actividad-grid-wrap :deep(.p-datatable-table-container) {
  border-left-width: 0 !important;
}

.cmo-actividad-grid-wrap :deep(.p-paginator) {
  min-height: 34px !important;
  height: 34px !important;
  padding-left: 136px !important;
  padding-right: 210px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 5px !important;
}

.cmo-actividad-grid-wrap :deep(.p-paginator .p-select),
.cmo-actividad-grid-wrap :deep(.p-paginator .p-dropdown) {
  margin-left: 8px !important;
}

.cmo-actividad-grid-wrap :deep(.p-paginator-end) {
  position: absolute !important;
  right: 10px !important;
}

.cmo-actividad-grid :deep(.p-datatable-table) {
  table-layout: fixed !important;
}

.cmo-actividad-grid :deep(.p-datatable-thead > tr > th),
.cmo-actividad-grid :deep(.p-datatable-tbody > tr > td) {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.cmo-actividad-grid :deep(.p-datatable-tbody > tr) {
  cursor: pointer;
}

.cmo-actividad-grid :deep(.p-datatable-tbody > tr:hover > td) {
  background: rgba(0, 180, 181, .06) !important;
}

.cmo-actividad-grid :deep(.p-datatable-tbody > tr.cmo-actividad-row-selected > td),
.cmo-actividad-grid :deep(.p-datatable-tbody > tr.jobtype-row-selected > td),
.cmo-actividad-grid :deep(.p-datatable-tbody > tr.p-highlight > td) {
  background: #e8f8fb !important;
  color: #0f2f3d !important;
  font-weight: 600 !important;
}

.cmo-actividad-grid-actions-fixed {
  position: absolute;
  left: 10px;
  bottom: 9px;
  z-index: 9;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  width: 96px;
  height: 18px;
  overflow: visible;
  pointer-events: auto;
}

.cmo-actividad-grid-action.p-button,
.cmo-actividad-grid-action.p-button:enabled,
.cmo-actividad-grid-action.p-button:hover,
.cmo-actividad-grid-action.p-button:focus,
.cmo-actividad-grid-action.p-button:active,
.cmo-actividad-grid-action.p-button:focus-visible {
  width: 15px !important;
  min-width: 15px !important;
  max-width: 15px !important;
  height: 15px !important;
  min-height: 15px !important;
  max-height: 15px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  background-image: none !important;
  box-shadow: none !important;
  outline: 0 !important;
  color: #002236 !important;
  opacity: 1 !important;
}

.cmo-actividad-grid-action.p-button:disabled,
.cmo-actividad-grid-action.p-button.p-disabled {
  color: #b7c1c8 !important;
  background: transparent !important;
  box-shadow: none !important;
  opacity: .72 !important;
}

.cmo-actividad-grid-action.p-button:enabled:hover,
.cmo-actividad-grid-action.p-button:enabled:focus,
.cmo-actividad-grid-action.p-button:enabled:active {
  color: #008fa1 !important;
  background: transparent !important;
  box-shadow: none !important;
}

.cmo-actividad-grid-action :deep(.p-button-label) {
  display: none !important;
}

.cmo-actividad-grid-action :deep(.p-button-icon),
.cmo-actividad-grid-action :deep(.pi) {
  width: 13px !important;
  min-width: 13px !important;
  height: 13px !important;
  min-height: 13px !important;
  font-size: 13px !important;
  line-height: 13px !important;
  margin: 0 !important;
  color: currentColor !important;
}

.cmo-actividad-popup-placeholder {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #536b7d;
  font-size: 13px;
  border: 1px solid #d5e1e8;
  background: #ffffff;
}
</style>
