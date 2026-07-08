<template>
  <div class="fm-screen fm-screen--pad cmo-actividad-page">
    <Accordion v-model:value="activePanels" multiple class="fm-accordion cmo-actividad-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS DE BÚSQUEDA</AccordionHeader>
        <AccordionContent>
          <div class="cmo-actividad-filters">
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
            loading-message="Consultando relaciones cmo-actividad"
          >
            <DataTable
              id="tabla-cmo-actividad"
              ref="dt"
              class="fm-pass-grid cmo-actividad-grid"
              :value="store.rows"
              dataKey="id"
              tableStyle="table-layout: fixed; width: 100%; min-width: 100%"
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
                <div class="cmo-grid-actions" aria-label="Acciones de grilla">
                  <Button icon="pi pi-download" text rounded class="fm-grid-action-final cmo-grid-action" title="Exportar" aria-label="Exportar" v-tooltip.top="'Exportar'" @click="exportarExcel" />
                  <Button icon="pi pi-plus" text rounded class="fm-grid-action-final cmo-grid-action" title="Nueva Relación" aria-label="Nueva Relación" v-tooltip.top="'Nueva Relación'" @click="agregar" />
                  <Button icon="pi pi-pencil" text rounded class="fm-grid-action-final cmo-grid-action" :disabled="!store.hasSelection" title="Editar" aria-label="Editar" v-tooltip.top="'Editar'" @click="editar" />
                  <Button icon="pi pi-trash" text rounded class="fm-grid-action-final cmo-grid-action" :disabled="!store.hasSelection" title="Eliminar" aria-label="Eliminar" v-tooltip.top="'Eliminar'" @click="eliminar" />
                </div>
              </template>

              <template #paginatorend>
                <span class="fm-grid-counter" v-if="store.rows.length">
                  Mostrando {{ firstVisibleRow }} - {{ lastVisibleRow }} de {{ store.rows.length }}
                </span>
                <span class="fm-grid-counter" v-else>No hay resultados</span>
              </template>

              <template #empty>
                <div class="fm-grid-empty cmo-grid-empty">No hay resultados</div>
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
                  <div class="fm-filter-cell cmo-filter-cell">
                    <span class="fm-filter-prefix">~</span>
                    <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
                    <span class="fm-filter-more">...</span>
                  </div>
                </template>

                <template #body="{ data }">
                  <span class="fm-cell-text cmo-cell-text" :title="String(data[col.field] ?? '')">
                    {{ data[col.field] ?? '' }}
                  </span>
                </template>
              </Column>
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import Button from 'primevue/button'
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

const filters = ref(
  Object.fromEntries(
    columns.value.map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])
  )
)

const selectedRow = computed({
  get: () => store.selectedRow,
  set: (value) => store.setSelectedRow(value)
})

const firstVisibleRow = computed(() => (store.rows.length ? 1 : 0))
const lastVisibleRow = computed(() => Math.min(10, store.rows.length))

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
  'cmo-row-selected': store.selectedRow?.id === data?.id
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

const agregar = () => {
  // ACA TIENE QUE CONECTAR EL BACKEND - ALTA RELACION CMO-ACTIVIDAD
}

const editar = () => {
  if (!store.selectedRow) return
  // ACA TIENE QUE CONECTAR EL BACKEND - EDITAR RELACION CMO-ACTIVIDAD
}

const eliminar = () => {
  if (!store.selectedRow) return
  // ACA TIENE QUE CONECTAR EL BACKEND - ELIMINAR/DESACTIVAR RELACION CMO-ACTIVIDAD
}
</script>
