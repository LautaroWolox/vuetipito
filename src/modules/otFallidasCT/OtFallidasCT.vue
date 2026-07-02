<template>
  <FmTypingLoader v-if="store.loading" title="Procesando OTs" message="Consultando datos y preparando la grilla..." />
  <div class="fm-screen fm-screen--pad ot-fallidas-ct">
    <Accordion v-model:value="active" multiple class="fm-accordion">
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
