<template>
  <Dialog :visible="visible" modal header="Nota" :style="{ width: '42rem' }" class="otf-note-dialog" @update:visible="$emit('update:visible', $event)">
    <div class="otf-note-body">
      <label>Nota</label>
      <Textarea v-model="nota" rows="5" class="w-full" placeholder="Ingrese una nota" />
    </div>
    <template #footer>
      <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" @click="cerrar" />
      <Button label="ACEPTAR" class="fm-btn fm-btn--primary" @click="confirmar" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Textarea from 'primevue/textarea'
import { useFallidasCtStore } from '../store/CtFallidaStore'

const props = defineProps({ visible: Boolean, row: { type: Object, default: null } })
const emit = defineEmits(['update:visible'])
const store = useFallidasCtStore()
const nota = ref('')

watch(() => props.visible, (value) => {
  if (value) nota.value = props.row?.nota || ''
})

const cerrar = () => {
  emit('update:visible', false)
}

const confirmar = () => {
  store.updateNota(props.row, nota.value)
  cerrar()
}
</script>

<style scoped>
.otf-note-body{padding:8px 0;color:#222;font-size:16px}.otf-note-body label{display:block;margin:0 0 8px;font-weight:500}.otf-note-body :deep(textarea){resize:vertical;font-size:15px}.otf-note-dialog :deep(.p-dialog-header){font-size:24px;font-weight:400}.otf-note-dialog :deep(.p-dialog-footer){padding-top:18px}
</style>
