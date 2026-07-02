<template>
  <FmTypingLoader v-if="store.loading" title="Procesando OTs" message="Consultando datos y preparando la grilla..." />
  <div class="ot-fallidas-ct mx-2">
    <Accordion v-model:value="active" multiple class="otf-accordion">
      <AccordionPanel value="0">
        <AccordionHeader>FILTROS DE BUSQUEDA</AccordionHeader>
        <AccordionContent>
          <Filtros />
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader>OTS FALLIDAS REPROCESO</AccordionHeader>
        <AccordionContent>
          <Table />
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useFallidasCtStore } from './store/CtFallidaStore'
import Table from './components/Table.vue'
import Filtros from './components/Filtros.vue'
import FmTypingLoader from '@/components/shared/FmTypingLoader.vue'

const store = useFallidasCtStore()
const active = ref(['0', '1'])

onMounted(async () => {
  store.rows = []
  store.selectedRows = []
  await store.setMotivos()
})
</script>

<style scoped>
.ot-fallidas-ct{font-size:13px;color:#111}
.otf-accordion :deep(.p-accordionpanel){border:1px solid var(--fm-border);background:#fff;margin-bottom:6px}
.otf-accordion :deep(.p-accordionheader){height:30px;min-height:30px;padding:0 10px;background:#f7f7f7;border:0;border-bottom:1px solid var(--fm-border);font-size:14px;font-weight:400;color:#111}
.otf-accordion :deep(.p-accordioncontent-content){padding:0;background:#fff}
.otf-accordion :deep(.p-accordionheader-toggle-icon){margin-left:auto;width:12px;height:12px;color:#111}
</style>
