<template>
  <div class="fm-screen fm-screen--pad reporte-sas-page">
    <Accordion v-model:value="activePanels" multiple class="fm-accordion reporte-sas-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>Reporte SAS</AccordionHeader>
        <AccordionContent>
          <Message v-if="error" severity="error" class="mb-3">
            Error al cargar los datos del reporte SAS.
          </Message>

          <FmGridShell
            :loading="isFetching"
            loading-title="Cargando Reporte SAS"
            loading-message="Consultando extracción de datos GM"
          >
            <DataTable
              id="tabla-reporte-sas"
              ref="dt"
              class="fm-pass-grid reporte-sas-grid"
              :value="processedData"
              dataKey="nroOT"
              tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
              scrollable
              scrollHeight="430px"
              removableSort
              sortMode="multiple"
              filterDisplay="row"
              v-model:filters="filters"
              paginator
              :rows="5"
              :rowsPerPageOptions="[5, 10, 20, 50, 100, 200]"
              paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
              currentPageReportTemplate="{first} to {last} of {totalRecords}"
              :resizableColumns="true"
              columnResizeMode="expand"
              showGridlines
            >
              <template #paginatorstart>
                <Button
                  type="button"
                  icon="pi pi-download"
                  class="reporte-sas-export-button"
                  title="Exportar"
                  aria-label="Exportar"
                  @click="exportarExcel"
                />
              </template>

              <template #empty>
                <div class="fm-grid-empty">No hay resultados</div>
              </template>

              <Column
                v-for="col in visibleColumns"
                :key="col.field"
                :field="col.field"
                :header="col.header"
                :sortable="col.sort !== false"
                :filter="col.filter !== false"
                :filterField="col.field"
                :showFilterMenu="false"
                :exportable="col.exportable"
                :style="columnStyle(col)"
                :headerStyle="columnStyle(col)"
                :bodyStyle="columnStyle(col)"
              >
                <template #filter="{ filterModel, filterCallback }">
                  <div v-if="col.filter !== false" class="fm-filter-cell reporte-sas-filter-cell">
                    <span class="fm-filter-prefix">~</span>
                    <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
                    <span class="fm-filter-more">...</span>
                  </div>
                </template>

                <template #body="{ data, index }">
                  <div v-if="col.type === 'legajoList'" class="reporte-sas-legajo-cell">
                    <div class="reporte-sas-legajo-box" :class="{ 'reporte-sas-legajo-box--open': isExpanded(index, col.field) }">
                      <button
                        type="button"
                        class="reporte-sas-legajo-toggle"
                        @click.stop="toggleExpand(index, col.field)"
                        @keydown.enter.stop="toggleExpand(index, col.field)"
                      >
                        <span>{{ getPreview(data[col.field]) }}</span>
                        <i v-if="isExpandable(data[col.field])" :class="isExpanded(index, col.field) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
                      </button>

                      <div v-if="isExpanded(index, col.field)" class="reporte-sas-legajo-list">
                        <span v-for="(legajo, idx) in getLegajosArray(data[col.field])" :key="idx" class="reporte-sas-legajo-item">
                          {{ legajo }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span v-else class="fm-cell-text reporte-sas-cell-text" :title="String(data[col.field] ?? '')">{{ data[col.field] ?? '' }}</span>
                </template>
              </Column>
            </DataTable>
          </FmGridShell>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useFetch } from '@vueuse/core'
import { FilterMatchMode } from '@primevue/core/api'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Message from 'primevue/message'
import { useExcelExport } from '../../composables/useExportExcel'
import type { IDataReportSass } from './interfaces/index'
import { reporteSasColumns } from './columns/reporteSas'

interface ExpandedState { [key: string]: boolean }
interface ReporteColumn {
  field: string
  header: string
  hidden?: boolean
  exportable?: boolean
  filter?: boolean
  sort?: boolean
  width?: string
  minWidth?: string
  type?: string
}

const dt = ref()
const activePanels = ref(['0'])
const columns = ref<ReporteColumn[]>(reporteSasColumns)
const expandedCells = ref<ExpandedState>({})
const { exportToExcel, parseDataFromTable } = useExcelExport()

const visibleColumns = computed(() => columns.value.filter(col => !col.hidden))
const filters = ref(Object.fromEntries(visibleColumns.value.map(col => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])))

const { data, isFetching, error } = useFetch('/pc/extraccionDatosGM/searchMatDescargados.html', {
  immediate: true,
  onFetchError(ctx) {
    console.error('Error al cargar reporte SAS:', ctx.error)
    return ctx
  }
}).json<IDataReportSass[]>()

watch(error, newError => {
  if (newError) console.error('Error detectado:', newError)
})

const processedData = computed<IDataReportSass[]>(() => {
  return (data.value ?? []).map(item => ({
    ...item,
    legajoNOLDAP: normalizeLegajos(item.legajoNOLDAP)
  }))
})

const columnStyle = (col: ReporteColumn) => ({
  width: col.width || '120px',
  minWidth: col.minWidth || '58px',
  maxWidth: 'none'
})

const normalizeLegajos = (value: unknown): string => {
  return getLegajosArray(value).join(',')
}

const getExpandKey = (rowIndex: number, fieldName: string): string => `${rowIndex}_${fieldName}`
const isExpanded = (rowIndex: number, fieldName: string): boolean => expandedCells.value[getExpandKey(rowIndex, fieldName)] || false
const toggleExpand = (rowIndex: number, fieldName: string): void => {
  const key = getExpandKey(rowIndex, fieldName)
  expandedCells.value[key] = !expandedCells.value[key]
}

const getLegajosArray = (value: unknown): string[] => {
  if (!value) return []
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)
  return String(value).split(',').map(item => item.trim()).filter(Boolean)
}

const isExpandable = (value: unknown): boolean => getLegajosArray(value).length > 1

const getPreview = (value: unknown): string => {
  const items = getLegajosArray(value)
  if (items.length <= 1) return items.join('')
  return `${items[0]} (+${items.length - 1} más)`
}

const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  const fields = parsed.fields.filter((field: string) => {
    const col = columns.value.find(column => column.field === field)
    return col && col.exportable !== false
  })

  exportToExcel({
    rows: parsed.rows,
    fields,
    columns: reporteSasColumns,
    filename: 'reporteSAS.xlsx',
    columnTypes: {},
    groupField: 'codTarea'
  })
}
</script>

<style scoped>
.reporte-sas-page {
  width: 100%;
}

.reporte-sas-page :deep(.reporte-sas-accordion) {
  display: flex !important;
  flex-direction: column !important;
  gap: 14px !important;
}

.reporte-sas-grid :deep(.p-datatable-table) {
  table-layout: fixed !important;
}

.reporte-sas-grid :deep(.p-datatable-thead > tr > th),
.reporte-sas-grid :deep(.p-datatable-tbody > tr > td) {
  overflow: hidden !important;
  vertical-align: middle !important;
}

.reporte-sas-grid :deep(.p-column-header-content),
.reporte-sas-cell-text {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

.reporte-sas-filter-cell,
.reporte-sas-filter-cell :deep(.p-inputtext),
.reporte-sas-grid :deep(.fm-filter-cell),
.reporte-sas-grid :deep(.fm-column-filter) {
  min-width: 0 !important;
  width: 100% !important;
}

.reporte-sas-export-button,
:deep(.reporte-sas-export-button.p-button) {
  width: 170px !important;
  min-width: 170px !important;
  height: 32px !important;
  padding: 0 !important;
  border: 0 !important;
  border-radius: 4px !important;
  background: #00a9bd !important;
  color: #ffffff !important;
  box-shadow: 0 3px 8px rgba(0, 169, 189, .24) !important;
}

.reporte-sas-export-button:hover,
:deep(.reporte-sas-export-button.p-button:hover) {
  background: #008fa1 !important;
  color: #ffffff !important;
}

.reporte-sas-export-button :deep(.p-button-label) {
  display: none !important;
}

.reporte-sas-export-button :deep(.p-button-icon),
.reporte-sas-export-button :deep(.pi) {
  font-size: 15px !important;
}

.reporte-sas-legajo-cell {
  width: 100%;
  min-width: 0;
}

.reporte-sas-legajo-box {
  width: 100%;
  min-width: 0;
  border: 1px solid #d9e3e8;
  border-radius: 4px;
  background: #ffffff;
  overflow: hidden;
}

.reporte-sas-legajo-box--open {
  border-color: #00a9bd;
  box-shadow: 0 0 0 2px rgba(0, 169, 189, .12);
}

.reporte-sas-legajo-toggle {
  width: 100%;
  min-width: 0;
  min-height: 32px;
  padding: 0 8px;
  border: 0;
  background: #ffffff;
  color: #263746;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  cursor: pointer;
  text-align: left;
  font-size: 12px;
}

.reporte-sas-legajo-toggle span {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.reporte-sas-legajo-toggle:hover {
  background: #eefcff;
}

.reporte-sas-legajo-list {
  padding: 6px;
  border-top: 1px solid #e2edf1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 150px;
  overflow: auto;
  background: #fbfdfe;
}

.reporte-sas-legajo-item {
  padding: 4px 6px;
  border-radius: 3px;
  background: #eefcff;
  color: #263746;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
