<template>
  <Dialog :visible="visible" modal header="Nota" :style="{ width: '34rem' }" class="fm-dialog fm-dialog-nota" @update:visible="$emit('update:visible', $event)">
    <div class="fm-note-body">
      <label>Nota</label>
      <div class="fm-note-readonly">{{ nota }}</div>
    </div>
    <template #footer>
      <div class="fm-note-footer">
        <Button label="CERRAR" class="fm-btn fm-btn--primary fm-note-close-button" @click="cerrar" />
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ visible: Boolean, row: { type: Object, default: null } })
const emit = defineEmits(['update:visible'])
const nota = computed(() => props.row?.nota || '')

const cerrar = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
.fm-note-readonly {
  width: 100%;
  min-height: 74px;
  padding: 12px 14px;
  border: 1px solid #c8d3dc;
  border-radius: 4px;
  background: #ffffff;
  color: #263746;
  font-size: 16px;
  line-height: 1.4;
  white-space: pre-wrap;
}

.fm-note-footer {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.fm-note-footer :deep(.fm-note-close-button),
.fm-note-footer :deep(.p-button.fm-note-close-button) {
  height: 56px !important;
  min-height: 56px !important;
  min-width: 172px !important;
  padding: 0 28px !important;
  border: 1px solid #00a9bd !important;
  border-radius: 7px !important;
  background: #00a9bd !important;
  background-color: #00a9bd !important;
  color: #ffffff !important;
  box-shadow: none !important;
  font-size: 24px !important;
  font-weight: 800 !important;
  line-height: 1 !important;
  letter-spacing: .2px !important;
}

.fm-note-footer :deep(.fm-note-close-button:hover),
.fm-note-footer :deep(.fm-note-close-button:focus),
.fm-note-footer :deep(.fm-note-close-button:focus-visible) {
  border-color: #008fa1 !important;
  background: #008fa1 !important;
  background-color: #008fa1 !important;
  color: #ffffff !important;
  box-shadow: none !important;
  transform: none !important;
}
</style>
