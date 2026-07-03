<template>
  <Dialog :visible="visible" modal header="Nota" :style="{ width: '42rem' }" class="fm-dialog fm-dialog-nota" @update:visible="$emit('update:visible', $event)">
    <div class="fm-note-body">
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
