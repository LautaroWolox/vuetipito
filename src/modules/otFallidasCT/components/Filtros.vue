<template>
  <div class="fm-panel-content fm-panel-content--accent fm-filters otf-filters">
    <div class="fm-filter-grid otf-filter-grid">
      <NroOT v-model="store.filters.nroOt" :disabled="nroOtFilterDisabled" />
      <FechaDesde v-model="store.filters.fechaDesde" :disabled="otherFiltersDisabled" />
      <FechaHasta v-model="store.filters.fechaHasta" :disabled="otherFiltersDisabled" />
      <Contratista v-model="store.filters.contratista" :options="store.contratistas" :disabled="otherFiltersDisabled" />
      <DescripcionError v-model="store.filters.descripcionError" :disabled="otherFiltersDisabled" />
      <Excluida v-model="store.filters.excluida" :options="store.excluidas" :disabled="otherFiltersDisabled" />
      <Pais v-model="store.filters.pais" :options="store.paises" :disabled="otherFiltersDisabled" />
    </div>

    <div class="fm-actions fm-filter-actions otf-filter-actions">
      <FmButton class="fm-filter-action-button" :label="store.loading ? 'BUSCANDO...' : 'BUSCAR'" icon="pi-search" :disabled="store.loading" :loading="store.loading" @click="buscar" />
      <FmButton class="fm-filter-action-button" label="LIMPIAR" icon="pi-filter-slash" variant="outline" @click="limpiar" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFallidasCtStore } from '../store/CtFallidaStore'
import NroOT from './elementos/NroOT.vue'
import FechaDesde from './elementos/FechaDesde.vue'
import FechaHasta from './elementos/FechaHasta.vue'
import Contratista from './elementos/Contratista.vue'
import DescripcionError from './elementos/DescripcionError.vue'
import Excluida from './elementos/Excluida.vue'
import Pais from './elementos/Pais.vue'

const store = useFallidasCtStore()
const nroOtFilterDisabled = computed(() => Boolean(store.disableNroOtFilter))
const otherFiltersDisabled = computed(() => Boolean(store.disableOtherFilters))
const limpiar = () => store.clearFilters()
const buscar = async () => store.search()
</script>

<style scoped>
.otf-filters {
  width: 100%;
  border-left-width: 1px !important;
  border-left-style: solid !important;
  border-left-color: #00a9bd !important;
}

.otf-filter-grid {
  display: grid !important;
  grid-template-columns: 180px 300px 300px 520px !important;
  column-gap: 12px !important;
  row-gap: 6px !important;
  align-items: end !important;
  justify-content: center !important;
  width: min(calc(100% - 40px), 1336px) !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

.otf-filter-grid :deep(.otf-filter-element) {
  width: 100% !important;
  min-width: 0 !important;
}

.otf-filter-grid :deep(.otf-filter-element--nro-ot),
.otf-filter-grid :deep(.otf-filter-element--fecha-desde),
.otf-filter-grid :deep(.otf-filter-element--fecha-hasta),
.otf-filter-grid :deep(.otf-filter-element--contratista),
.otf-filter-grid :deep(.otf-filter-element--descripcion-error),
.otf-filter-grid :deep(.otf-filter-element--excluida),
.otf-filter-grid :deep(.otf-filter-element--pais) {
  grid-column: span 1 !important;
}

.otf-filter-actions {
  margin-top: 14px !important;
}

.otf-filter-actions :deep(.p-button),
.otf-filter-actions :deep(.fm-action-button) {
  min-width: 104px;
}

@media (max-width: 1500px) {
  .otf-filter-grid {
    grid-template-columns: 180px 280px 280px 460px !important;
    width: min(calc(100% - 40px), 1236px) !important;
  }
}

@media (max-width: 1200px) {
  .otf-filter-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
    column-gap: 12px !important;
    row-gap: 8px !important;
    width: calc(100% - 32px) !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
}
</style>
