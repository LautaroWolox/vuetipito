<template>
  <div class="fm-panel-content fm-panel-content--accent otf-filters">
    <div class="grid">
      <div class="col-4">
        <label>Nro. OT</label>
        <InputText v-model="store.filters.nroOt" class="w-full" />
      </div>
      <div class="col-2">
        <label>Fecha Cierre OT Desde</label>
        <InputText v-model="store.filters.fechaDesde" class="w-full" placeholder="Seleccionar fecha" />
      </div>
      <div class="col-2">
        <label>Fecha Cierre OT Hasta</label>
        <InputText v-model="store.filters.fechaHasta" class="w-full" placeholder="Seleccionar fecha" />
      </div>
      <div class="col-4">
        <label>Contratista</label>
        <Select v-model="store.filters.contratista" :options="store.contratistas" optionLabel="name" class="w-full" showClear />
      </div>
      <div class="col-4">
        <label>Descripcion Error</label>
        <InputText v-model="store.filters.descripcionError" class="w-full" />
      </div>
      <div class="col-2">
        <label>Excluida</label>
        <Select v-model="store.filters.excluida" :options="excluidaOptions" optionLabel="name" class="w-full" showClear />
      </div>
      <div class="col-2">
        <label>Pais</label>
        <Select v-model="store.filters.pais" :options="store.paises" optionLabel="name" class="w-full" showClear />
      </div>
    </div>

    <div class="flex flex-row justify-content-center gap-2 mt-3">
      <Button class="fm-btn fm-btn--primary" label="BUSCAR" icon="pi pi-search" :loading="store.loading" @click="buscar" />
      <Button class="fm-btn fm-btn--outline" label="LIMPIAR" icon="pi pi-filter-slash" outlined @click="limpiar" />
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import { useFallidasCtStore } from '../store/CtFallidaStore'

const store = useFallidasCtStore()
const excluidaOptions = [{ name: 'S', code: 'S' }, { name: 'N', code: 'N' }]

const limpiar = () => {
  store.clearFilters()
}

const buscar = async () => {
  await store.search()
}
</script>

<style scoped>
.otf-filters{padding:14px 22px 12px}
.otf-filters label{display:block;margin-bottom:6px;font-weight:700;color:#111;font-size:13px}
.otf-filters :deep(.p-inputtext),.otf-filters :deep(.p-select){height:30px;min-height:30px;font-size:13px}
.otf-filters :deep(.p-select-label){padding-top:4px;padding-bottom:4px}
</style>
