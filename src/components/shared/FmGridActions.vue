<template>
  <div class="fm-grid-actions fm-ui-grid-actions">
    <Button
      v-if="showExport"
      icon="pi pi-download"
      text
      rounded
      class="fm-ui-icon-button fm-grid-action-button"
      title="Exportar"
      aria-label="Exportar"
      @click="$emit('export')"
    />

    <Button
      v-if="showDelete"
      icon="pi pi-trash"
      text
      rounded
      class="fm-ui-icon-button fm-grid-action-button"
      title="Excluir seleccionados"
      aria-label="Excluir seleccionados"
      @click="$emit('delete')"
    />

    <Button
      v-if="showRefresh"
      icon="pi pi-refresh"
      text
      rounded
      class="fm-ui-icon-button fm-grid-action-button"
      title="Reprocesar"
      aria-label="Reprocesar"
      @click="$emit('refresh')"
    />
  </div>
</template>

<script setup>
import Button from 'primevue/button'

defineProps({
  showExport: { type: Boolean, default: true },
  showDelete: { type: Boolean, default: true },
  showRefresh: { type: Boolean, default: true }
})

defineEmits(['export', 'delete', 'refresh'])
</script>
