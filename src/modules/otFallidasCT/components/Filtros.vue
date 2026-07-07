<template>
  <div class="fm-panel-content fm-panel-content--accent fm-filters otf-filters">
    <div class="fm-filter-grid otf-filter-grid">
      <NroOT v-model="store.filters.nroOt" />
      <FechaDesde v-model="store.filters.fechaDesde" />
      <FechaHasta v-model="store.filters.fechaHasta" />
      <Contratista v-model="store.filters.contratista" :options="store.contratistas" />
      <DescripcionError v-model="store.filters.descripcionError" />
      <Excluida v-model="store.filters.excluida" :options="store.excluidas" />
      <Pais v-model="store.filters.pais" :options="store.paises" />
    </div>

    <div class="fm-actions fm-filter-actions otf-filter-actions">
      <FmButton class="fm-filter-action-button" label="BUSCAR" icon="pi-search" :disabled="store.loading" @click="buscar" />
      <FmButton class="fm-filter-action-button" label="LIMPIAR" icon="pi-filter-slash" variant="outline" @click="limpiar" />
    </div>
  </div>
</template>

<script setup>
import { useFallidasCtStore } from '../store/CtFallidaStore'
import NroOT from './elementos/NroOT.vue'
import FechaDesde from './elementos/FechaDesde.vue'
import FechaHasta from './elementos/FechaHasta.vue'
import Contratista from './elementos/Contratista.vue'
import DescripcionError from './elementos/DescripcionError.vue'
import Excluida from './elementos/Excluida.vue'
import Pais from './elementos/Pais.vue'

const store = useFallidasCtStore()
const limpiar = () => store.clearFilters()
const buscar = async () => store.search()
</script>

<style scoped>
.otf-filters {
  width: 100%;
}

.otf-filter-grid {
  align-items: end;
}

.otf-filter-actions {
  margin-top: 14px !important;
}

.otf-filter-actions :deep(.p-button),
.otf-filter-actions :deep(.fm-action-button) {
  min-width: 104px;
}
</style>
