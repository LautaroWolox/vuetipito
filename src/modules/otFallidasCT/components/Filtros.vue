<template>
  <div class="fm-panel-content fm-panel-content--accent otf-filters">
    <div class="grid">
      <div class="col-4">
        <label>Nro. OT</label>
        <InputText v-model="store.filters.nroOt" class="w-full" />
      </div>
      <div class="col-2">
        <label>Fecha Cierre OT Desde</label>
        <CtDatePicker v-model="store.filters.fechaDesde" />
      </div>
      <div class="col-2">
        <label>Fecha Cierre OT Hasta</label>
        <CtDatePicker v-model="store.filters.fechaHasta" />
      </div>
      <div class="col-4">
        <label>Contratista</label>
        <Select v-model="store.filters.contratista" :options="store.contratistas" optionLabel="name" class="w-full otf-select" showClear />
      </div>
      <div class="col-4">
        <label>Descripcion Error</label>
        <InputText v-model="store.filters.descripcionError" class="w-full" />
      </div>
      <div class="col-2">
        <label>Excluida</label>
        <Select v-model="store.filters.excluida" :options="excluidaOptions" optionLabel="name" class="w-full otf-select" showClear />
      </div>
      <div class="col-2">
        <label>Pais</label>
        <Select v-model="store.filters.pais" :options="store.paises" optionLabel="name" class="w-full otf-select" showClear />
      </div>
    </div>

    <div class="otf-actions">
      <button class="otf-btn otf-btn-primary" type="button" :disabled="store.loading" @click="buscar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1-5.3 12.8Zm5.5-2 5 5" /></svg>
        <span>{{ store.loading ? 'BUSCANDO...' : 'BUSCAR' }}</span>
      </button>
      <button class="otf-btn otf-btn-outline" type="button" @click="limpiar">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16M7 5l5 6v6l3 2v-8l5-6M4 12h5" /></svg>
        <span>LIMPIAR</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import CtDatePicker from './CtDatePicker.vue'
import { useFallidasCtStore } from '../store/CtFallidaStore'

const store = useFallidasCtStore()
const excluidaOptions = [{ name: 'Si', code: 'S' }, { name: 'No', code: 'N' }]

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
.otf-filters :deep(.p-inputtext),.otf-filters :deep(.p-select){height:30px;min-height:30px;font-size:13px;border-color:#c7d1d8;border-radius:3px;background:#fff}
.otf-filters :deep(.p-inputtext:focus),.otf-filters :deep(.p-select.p-focus){border-color:var(--fm-cyan)!important;box-shadow:0 0 0 2px rgba(0,188,212,.14)!important}
.otf-filters :deep(.p-select-label){padding-top:4px;padding-bottom:4px;font-size:13px}
.otf-filters :deep(.p-select-dropdown){width:30px;color:#42526e}
.otf-actions{display:flex;justify-content:center;gap:8px;margin-top:18px}
.otf-btn{height:32px;min-width:107px;display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:4px;padding:0 16px;font-size:12px;font-weight:500;cursor:pointer;box-shadow:0 3px 8px rgba(0,0,0,.12);transition:background-color .15s ease,color .15s ease,border-color .15s ease,box-shadow .15s ease}.otf-btn svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.otf-btn-primary{background:var(--fm-cyan);border:1px solid var(--fm-cyan);color:#fff}.otf-btn-primary:hover:not(:disabled){background:var(--fm-cyan-strong);border-color:var(--fm-cyan-strong);box-shadow:0 5px 12px rgba(0,143,161,.28)}.otf-btn-outline{background:#fff;border:1px solid var(--fm-cyan);color:var(--fm-cyan)}.otf-btn-outline:hover{background:var(--fm-cyan-soft);border-color:var(--fm-cyan-strong);color:var(--fm-cyan-strong);box-shadow:0 5px 12px rgba(0,143,161,.18)}.otf-btn:disabled{opacity:.55;cursor:not-allowed}
</style>
