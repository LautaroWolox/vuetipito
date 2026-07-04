<template>
  <Dialog :visible="visible" modal header="Nota" :style="{ width: '42rem' }" class="fm-dialog fm-dialog-nota" @update:visible="$emit('update:visible', $event)">
    <div class="fm-note-body">
      <label>Nota</label>
      <div class="fm-note-readonly">{{ nota || 'Sin nota registrada' }}</div>
    </div>
    <template #footer>
      <Button label="CERRAR" class="fm-btn fm-btn--primary" @click="cerrar" />
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ visible: Boolean, row: { type: Object, default: null } })
defineEmits(['update:visible'])

const emit = defineEmits(['update:visible'])
const nota = computed(() => props.row?.nota || '')

const cerrar = () => {
  emit('update:visible', false)
}
</script>

<style scoped>
.fm-note-readonly {
  width: 100%;
  min-height: 96px;
  padding: 13px 14px;
  border: 1px solid #c8d3dc;
  border-radius: 4px;
  background: #ffffff;
  color: #263746;
  font-size: 18px;
  line-height: 1.45;
  white-space: pre-wrap;
}
</style>
