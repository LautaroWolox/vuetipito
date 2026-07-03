<template>
  <div class="fm-grid-actions fm-ui-grid-actions">
    <button v-if="showExport" class="fm-icon-btn fm-ui-icon-button" type="button" title="Exportar" aria-label="Exportar" @click="$emit('export')">
      <svg class="fm-grid-icon fm-ui-grid-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3v11m0 0 4-4m-4 4-4-4M5 21h14" />
      </svg>
    </button>

    <button v-if="showDelete" class="fm-icon-btn fm-ui-icon-button" type="button" title="Excluir seleccionados" aria-label="Excluir seleccionados" @click="$emit('delete')">
      <svg class="fm-grid-icon fm-ui-grid-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M10 11v6M14 11v6M6 7l1 14h10l1-14M9 7V4h6v3" />
      </svg>
    </button>

    <button v-if="showRefresh" class="fm-icon-btn fm-ui-icon-button" type="button" title="Reprocesar" aria-label="Reprocesar" @click="$emit('refresh')">
      <svg class="fm-grid-icon fm-ui-grid-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20 6v5h-5M4 18v-5h5M19 11a7 7 0 0 0-12-4M5 13a7 7 0 0 0 12 4" />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  showExport: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  showRefresh: {
    type: Boolean,
    default: true
  }
})

defineEmits(['export', 'delete', 'refresh'])
</script>
