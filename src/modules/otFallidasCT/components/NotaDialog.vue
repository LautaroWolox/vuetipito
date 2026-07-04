<template>
  <Dialog :visible="visible" modal header="Nota" :style="{ width: '34rem' }" class="fm-dialog fm-dialog-nota" @update:visible="$emit('update:visible', $event)">
    <div class="fm-note-body">
      <label>Nota</label>
      <div class="fm-note-readonly">{{ nota }}</div>
    </div>
    <template #footer>
      <Button label="CERRAR" class="fm-btn fm-btn--primary" @click="cerrar" />
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
</style>
