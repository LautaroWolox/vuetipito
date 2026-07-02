<template>
  <div class="otf-table-wrap">
    <DataTable
      id="tabla"
      ref="dt"
      class="fm-pass-grid otf-table"
      :value="store.rows"
      dataKey="id"
      tableStyle="table-layout: fixed; width: max-content; min-width: 100%"
      scrollable
      scrollHeight="430px"
      :rowClass="rowClass"
      :resizableColumns="true"
      columnResizeMode="expand"
      removableSort
      sortMode="multiple"
      filterDisplay="row"
      v-model:filters="filters"
      v-model:selection="selectedRows"
      selectionMode="multiple"
      :isDataSelectable="isRowSelectable"
      :selectAll="allSelectableSelected"
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 50, 100, 500]"
      paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Pagina {currentPage} de {totalPages}"
      showGridlines
      @row-click="onRowClick"
      @select-all-change="onSelectAllChange"
    >
      <template #paginatorstart>
        <div class="otf-footer-icons">
          <button class="fm-icon-btn otf-grid-icon" type="button" title="Exportar" @click="exportarExcel">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v11m0 0 4-4m-4 4-4-4M5 21h14" /></svg>
          </button>
          <button class="fm-icon-btn otf-grid-icon" type="button" title="Excluir seleccionadas" @click="excluir">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" /></svg>
          </button>
          <button class="fm-icon-btn otf-grid-icon" type="button" title="Reprocesar" @click="reprocesar">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6v5h-5M4 18v-5h5M19 11a7 7 0 0 0-12-4M5 13a7 7 0 0 0 12 4" /></svg>
          </button>
        </div>
      </template>

      <template #paginatorend>
        <span class="otf-counter">Mostrando {{ store.rows.length ? 1 : 0 }} - {{ Math.min(10, store.rows.length) }} de {{ store.rows.length }}</span>
      </template>

      <template #empty>
        <div class="otf-empty">No hay resultados</div>
      </template>

      <Column selectionMode="multiple" headerStyle="width: 3rem; min-width: 3rem" bodyStyle="width: 3rem; min-width: 3rem" />

      <Column
        v-for="col in cols"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        :sortable="col.sort !== false"
        :filter="col.filter !== false"
        :filterField="col.field"
        :showFilterMenu="false"
        :hidden="col.hidden"
        :exportable="col.exportable"
        :style="columnStyle(col)"
        :headerStyle="columnStyle(col)"
        :bodyStyle="columnStyle(col)"
      >
        <template #filter="{ filterModel, filterCallback }">
          <div v-if="col.filter !== false" class="otf-filter-cell">
            <span class="otf-filter-prefix">~</span>
            <InputText type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
            <span class="otf-filter-more">...</span>
          </div>
        </template>
        <template #body="{ data }">
          <button v-if="col.field === 'tieneNota'" class="otf-icon-cell" type="button" @click.stop="abrirNota(data)"><i class="pi pi-file-edit"></i></button>
          <button v-else-if="col.field === 'incluir' && data.excluida === 'S'" class="otf-icon-cell otf-icon-cell--include" type="button" @click.stop="abrirIncluir(data)"><i class="pi pi-replay"></i></button>
          <span v-else-if="col.field !== 'tieneNota' && col.field !== 'incluir'" class="otf-cell-text">{{ data[col.field] ?? '' }}</span>
        </template>
      </Column>
    </DataTable>

    <ExcluirDialog v-model:visible="showExcluir" :selected-rows="selectedRows" />
    <IncluirDialog v-model:visible="showIncluir" :row="includeRow" />
    <NotaDialog v-model:visible="showNota" :row="noteRow" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'
import { columns } from './columns'
import { useFallidasCtStore } from '../store/CtFallidaStore'
import ExcluirDialog from './ExcluirDialog.vue'
import IncluirDialog from './IncluirDialog.vue'
import NotaDialog from './NotaDialog.vue'
import { useExcelExport } from '@/composables/useExportExcel'

const store = useFallidasCtStore()
const cols = ref(columns)
const dt = ref()
const showExcluir = ref(false)
const showIncluir = ref(false)
const showNota = ref(false)
const includeRow = ref(null)
const noteRow = ref(null)
const { exportToExcel, parseDataFromTable } = useExcelExport()

const filters = ref(Object.fromEntries(columns.filter((col) => !col.hidden).map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])))
const selectableRows = computed(() => store.rows.filter((row) => row.excluida !== 'S'))
const allSelectableSelected = computed(() => selectableRows.value.length > 0 && selectableRows.value.every((row) => store.selectedRows.includes(row.id)))
const selectedRows = computed({
  get: () => store.rows.filter((row) => store.selectedRows.includes(row.id)),
  set: (value) => store.setSelectedRows(value.map((row) => row.id))
})

const columnStyle = (col) => ({
  width: col.width || '120px',
  minWidth: col.minWidth || col.width || '80px'
})

const rowClass = (data) => ({
  'otf-disabled-row': data?.excluida === 'S',
  'otf-enabled-row': data?.excluida === 'N',
  'otf-selected-row': store.selectedRows.includes(data?.id)
})
const isRowSelectable = (event) => event?.data?.excluida !== 'S'
const onSelectAllChange = () => store.setSelectedRows(allSelectableSelected.value ? [] : selectableRows.value.map((row) => row.id))
const onRowClick = (event) => { if (event?.data) store.toggleSelectedRow(event.data) }
const abrirNota = (row) => { noteRow.value = row; showNota.value = true }
const abrirIncluir = (row) => { includeRow.value = row; showIncluir.value = true }
const excluir = () => { if (store.selectedRows.length > 0) showExcluir.value = true; else window.alert('Debe seleccionar al menos una OT para excluir.') }
const reprocesar = async () => { if (store.selectedRows.length === 0) return window.alert('Debe seleccionar al menos una OT para reprocesar.'); await store.reprocesar() }
const exportarExcel = () => {
  const parsed = parseDataFromTable(dt)
  const rows = parsed.rows
  const fields = parsed.fields.filter((field) => {
    const col = cols.value.find((column) => column.field === field)
    return col && col.exportable !== false
  })
  exportToExcel({ rows, fields, columns: cols.value, filename: 'Ot_FallidasReproceso.xlsx', columnTypes: {}, groupField: null })
}
</script>

<style scoped>
.otf-table-wrap{border-left:4px solid var(--fm-cyan);background:#fff}.otf-footer-icons{display:flex;align-items:center;gap:10px;padding-left:4px}.otf-counter{font-size:12px;color:#222;padding-right:8px}.otf-empty{padding:48px 32px;font-size:14px;color:#407080;text-align:center}.otf-grid-icon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.otf-icon-cell{border:0;background:transparent;color:#006f80;cursor:pointer;padding:0;font-size:15px;display:inline-flex;align-items:center;justify-content:center}.otf-icon-cell .pi{font-size:16px}.otf-icon-cell:hover{color:var(--fm-cyan-strong);transform:translateY(-1px)}.otf-icon-cell--include{color:#006f80}.fm-icon-btn .pi{font-size:16px}.otf-cell-text{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.otf-filter-cell{display:flex;align-items:center;gap:3px;width:100%;min-width:0}.otf-filter-prefix,.otf-filter-more{font-size:11px;color:#000;flex:0 0 auto}:deep(.p-datatable-tbody > tr){cursor:pointer}:deep(.p-datatable-table){border-collapse:collapse!important;table-layout:fixed!important}:deep(.p-datatable-thead > tr > th),:deep(.p-datatable-tbody > tr > td){border-right:1px solid #c9d3da!important;border-bottom:1px solid #dce3e8!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}:deep(.p-datatable-thead > tr > th){height:35px!important;padding:4px 7px!important;background:#f4f7f9!important;color:#263f50!important;font-size:11px!important;font-weight:700!important;position:relative}:deep(.p-datatable-thead > tr.p-filter-row > th){height:34px!important;padding:3px 5px!important;background:#fff!important}:deep(.p-datatable-tbody > tr > td){height:35px!important;padding:5px 8px!important;color:#263238!important;font-size:12px!important}:deep(.p-column-resizer){width:8px!important;right:-4px!important;cursor:col-resize!important;background:transparent!important}:deep(.p-column-resizer:hover){background:rgba(0,169,189,.35)!important}:deep(.otf-disabled-row td){color:#8b8b8b!important;background:#fff!important}:deep(.otf-enabled-row:hover td),:deep(.otf-disabled-row:hover td){background:#edfafd!important}:deep(.otf-selected-row > td),:deep(.p-datatable-tbody > tr.otf-selected-row > td),:deep(.p-datatable-tbody > tr.p-highlight > td),:deep(.p-datatable-tbody > tr.p-datatable-row-selected > td){background:#9eeff7!important;color:#263238!important}:deep(.otf-selected-row .otf-icon-cell),:deep(.p-datatable-tbody > tr.p-highlight .otf-icon-cell),:deep(.p-datatable-tbody > tr.p-datatable-row-selected .otf-icon-cell){color:#263238!important}:deep(.p-checkbox-checked .p-checkbox-box),:deep(.p-checkbox.p-highlight .p-checkbox-box){background:#00a9bd!important;border-color:#00a9bd!important}:deep(.p-checkbox-checked .p-checkbox-icon),:deep(.p-checkbox.p-highlight .p-checkbox-icon){color:#111!important}:deep(.p-column-filter){height:25px!important;font-size:12px!important;width:100%!important;min-width:0!important}:deep(.p-datatable-wrapper){min-height:186px;max-height:470px}:deep(.p-datatable-empty-message td){height:110px!important;background:#eafcff!important;text-align:center!important}:deep(.p-paginator){justify-content:center;position:relative}:deep(.p-paginator-left-content){position:absolute;left:8px}:deep(.p-paginator-right-content){position:absolute;right:8px}
</style>