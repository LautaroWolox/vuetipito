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
      paginator
      :rows="10"
      :rowsPerPageOptions="[10, 50, 100, 500]"
      paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown"
      currentPageReportTemplate="Pagina {currentPage} de {totalPages}"
      showGridlines
    >
      <template #paginatorstart>
        <div class="otf-footer-icons">
          <button class="fm-icon-btn" type="button" v-tooltip.top="'Exportar a Excel'" @click="exportarExcel"><i class="pi pi-download"></i></button>
          <button class="fm-icon-btn" type="button" v-tooltip.top="'Excluir seleccionadas'" @click="excluir"><i class="pi pi-trash"></i></button>
          <button class="fm-icon-btn" type="button" v-tooltip.top="'Reprocesar'" @click="reprocesar"><i class="pi pi-refresh"></i></button>
        </div>
      </template>
      <template #paginatorend>
        <span class="otf-counter">Mostrando 1 - {{ Math.min(10, store.rows.length) }} de {{ store.rows.length }}</span>
      </template>
      <template #empty><div class="otf-empty">No se encontraron resultados.</div></template>
      <Column selectionMode="multiple" headerStyle="width: 3rem" />
      <Column v-for="col in cols" :key="col.field" :field="col.field" :header="col.header" :sortable="col.sort !== false" :filter="col.filter !== false" :filterField="col.field" :showFilterMenu="false" :hidden="col.hidden" :exportable="col.exportable" :style="{ minWidth: col.width || '120px' }">
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-if="col.filter !== false" type="text" v-model="filterModel.value" @input="filterCallback()" class="fm-column-filter" />
        </template>
        <template #body="{ data }">
          <button v-if="col.field === 'tieneNota' && data.nota" class="otf-icon-cell" type="button" @click.stop="verNota(data)"><i class="pi pi-file-edit"></i></button>
          <button v-else-if="col.field === 'incluir' && data.excluida === 'S'" class="otf-icon-cell otf-icon-cell--include" type="button" @click.stop="incluir(data)"><i class="pi pi-replay"></i></button>
          <span v-else-if="col.field !== 'tieneNota' && col.field !== 'incluir'">{{ data[col.field] ?? '' }}</span>
        </template>
      </Column>
    </DataTable>
    <ExcluirDialog v-model:visible="showExcluir" :selected-rows="selectedRows" />
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue'
import InputText from 'primevue/inputtext'
import { FilterMatchMode } from '@primevue/core/api'
import { columns } from './columns'
import { useFallidasCtStore } from '../store/CtFallidaStore'
import ExcluirDialog from './ExcluirDialog.vue'
import { useExcelExport } from '@/composables/useExportExcel'
const store = useFallidasCtStore()
const cols = ref(columns)
const dt = ref()
const showExcluir = ref(false)
const { exportToExcel, parseDataFromTable } = useExcelExport()
const filters = ref(Object.fromEntries(columns.filter((col) => !col.hidden).map((col) => [col.field, { value: null, matchMode: FilterMatchMode.CONTAINS }])))
const selectedRows = computed({ get: () => store.rows.filter((row) => store.selectedRows.includes(row.id)), set: (value) => store.setSelectedRows(value.map((row) => row.id)) })
const rowClass = (data) => ({ 'otf-disabled-row': data?.excluida === 'S', 'otf-enabled-row': data?.excluida === 'N' })
const verNota = (row) => window.alert(row.nota || 'Sin nota cargada')
const incluir = async (row) => store.incluir(row, 'Recupero manual', row.nota)
const excluir = () => { if (store.selectedRows.length > 0) showExcluir.value = true; else window.alert('Debe seleccionar al menos una OT para excluir.') }
const reprocesar = async () => { if (store.selectedRows.length === 0) return window.alert('Debe seleccionar al menos una OT para reprocesar.'); await store.reprocesar() }
const exportarExcel = () => { const parsed = parseDataFromTable(dt); const rows = parsed.rows; const fields = parsed.fields.filter((field) => { const col = cols.value.find((column) => column.field === field); return col && col.exportable !== false }); exportToExcel({ rows, fields, columns: cols.value, filename: 'Ot_FallidasReproceso.xlsx', columnTypes: {}, groupField: null }) }
onMounted(async () => { await store.setData(); await store.setMotivos() })
</script>
<style scoped>
.otf-table-wrap{border-left:4px solid var(--fm-cyan);background:#fff}.otf-footer-icons{display:flex;align-items:center;gap:8px;padding-left:4px}.otf-counter{font-size:12px;color:#222;padding-right:8px}.otf-empty{padding:18px 32px;font-size:14px;color:#607d8b}.otf-icon-cell{border:0;background:transparent;color:var(--fm-cyan);cursor:pointer;padding:0;font-size:15px;display:inline-flex;align-items:center;justify-content:center}.otf-icon-cell:hover{color:var(--fm-cyan-strong);transform:translateY(-1px)}.otf-icon-cell--include{color:var(--fm-cyan)}:deep(.otf-disabled-row td){color:#8b8b8b!important;background:#fff!important}:deep(.otf-enabled-row:hover td){background:#edfafd!important}:deep(.p-datatable-thead > tr > th){height:36px!important;padding:4px 7px!important}:deep(.p-datatable-tbody > tr > td){height:36px!important;padding:4px 7px!important}:deep(.p-filter-row > th){height:34px!important;background:#fff!important}:deep(.p-column-filter){height:25px!important;font-size:12px!important}:deep(.p-datatable-wrapper){min-height:430px;max-height:470px}:deep(.p-paginator){justify-content:center;position:relative}:deep(.p-paginator-left-content){position:absolute;left:8px}:deep(.p-paginator-right-content){position:absolute;right:8px}
</style>
