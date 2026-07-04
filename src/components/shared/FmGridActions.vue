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

<style scoped>
.fm-grid-actions {
  display: inline-flex !important;
  align-items: center !important;
  gap: 6px !important;
  overflow: visible !important;
}

.fm-grid-actions :deep(.p-button.fm-grid-action-button),
.fm-grid-actions :deep(.p-button.fm-ui-icon-button) {
  width: 18px !important;
  min-width: 18px !important;
  max-width: 18px !important;
  height: 18px !important;
  min-height: 18px !important;
  max-height: 18px !important;
  padding: 0 !important;
  margin: 0 !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  color: #4f6673 !important;
  box-shadow: none !important;
  outline: none !important;
  overflow: visible !important;
  transform: none !important;
}

.fm-grid-actions :deep(.p-button.fm-grid-action-button:hover),
.fm-grid-actions :deep(.p-button.fm-ui-icon-button:hover),
.fm-grid-actions :deep(.p-button.fm-grid-action-button:focus),
.fm-grid-actions :deep(.p-button.fm-ui-icon-button:focus),
.fm-grid-actions :deep(.p-button.fm-grid-action-button:focus-visible),
.fm-grid-actions :deep(.p-button.fm-ui-icon-button:focus-visible) {
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  background-color: transparent !important;
  color: #008fa1 !important;
  box-shadow: none !important;
  outline: none !important;
  overflow: visible !important;
  transform: none !important;
}

.fm-grid-actions :deep(.p-button-label) {
  display: none !important;
}

.fm-grid-actions :deep(.p-button-icon),
.fm-grid-actions :deep(.pi) {
  width: 13px !important;
  min-width: 13px !important;
  height: 13px !important;
  min-height: 13px !important;
  font-size: 13px !important;
  line-height: 13px !important;
  margin: 0 !important;
  overflow: visible !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
}
</style>
