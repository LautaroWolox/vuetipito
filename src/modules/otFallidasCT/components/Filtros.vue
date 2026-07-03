<template>
  <div class="fm-panel-content fm-panel-content--accent fm-filters">
    <div class="fm-filter-grid">
      <div class="fm-field fm-field--span-4">
        <label>Nro. OT</label>
        <InputText v-model="store.filters.nroOt" />
      </div>
      <div class="fm-field fm-field--span-2">
        <label>Fecha Cierre OT Desde</label>
        <CtDatePicker v-model="store.filters.fechaDesde" />
      </div>
      <div class="fm-field fm-field--span-2">
        <label>Fecha Cierre OT Hasta</label>
        <CtDatePicker v-model="store.filters.fechaHasta" />
      </div>
      <div class="fm-field fm-field--span-4">
        <label>Contratista</label>
        <Select v-model="store.filters.contratista" :options="store.contratistas" optionLabel="name" showClear />
      </div>
      <div class="fm-field fm-field--span-4">
        <label>Descripcion Error</label>
        <InputText v-model="store.filters.descripcionError" />
      </div>
      <div class="fm-field fm-field--span-2">
        <label>Excluida</label>
        <Select v-model="store.filters.excluida" :options="excluidaOptions" optionLabel="name" showClear />
      </div>
      <div class="fm-field fm-field--span-2">
        <label>Pais</label>
        <Select v-model="store.filters.pais" :options="store.paises" optionLabel="name" showClear />
      </div>
    </div>

    <div class="fm-actions fm-filter-actions">
      <FmButton class="fm-filter-action-button" :label="store.loading ? 'BUSCANDO...' : 'BUSCAR'" icon="pi-search" :disabled="store.loading" @click="buscar" />
      <FmButton class="fm-filter-action-button" label="LIMPIAR" icon="pi-filter-slash" variant="outline" @click="limpiar" />
    </div>
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'
import CtDatePicker from './CtDatePicker.vue'
import { useFallidasCtStore } from '../store/CtFallidaStore'

const store = useFallidasCtStore()
const excluidaOptions = [{ name: '', code: '' }, { name: 'Si', code: 'S' }, { name: 'No', code: 'N' }]

const limpiar = () => {
  // Aca se conecta el backend si limpiar tambien debe pedir datos nuevos.
  store.clearFilters()
}

const buscar = async () => {
  // Aca se conecta el backend para buscar OTs fallidas CT.
  await store.search()
}
</script>