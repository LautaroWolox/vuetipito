<template>
  <Dialog :visible="visible" modal header="Alerta" :style="{ width: '44rem' }" class="fm-dialog fm-dialog-incluir" @update:visible="$emit('update:visible', $event)">
    <div class="fm-dialog-body">
      <p>¿Confirma que desea recuperar la OT seleccionada?</p>
      <label>Motivo</label>
      <Select v-model="motivo" :options="store.motivos" optionLabel="name" class="w-full fm-dialog-select" />
      <label>Nota</label>
      <Textarea v-model="nota" rows="4" class="w-full" placeholder="Opcional" />
    </div>
    <template #footer>
      <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" @click="cerrar" />
      <Button label="ACEPTAR" class="fm-btn fm-btn--primary" @click="confirmar" />
    </template>
  </Dialog>

  <Dialog v-model:visible="showAlert" modal header="Alerta" :style="{ width: '42rem' }" class="fm-dialog-alert">
    <div class="fm-alert-body">
      <div class="fm-alert-triangle"><span>!</span></div>
      <span>Debe seleccionar un motivo.</span>
    </div>
    <template #footer>
      <Button label="CERRAR" outlined class="fm-btn fm-btn--outline" @click="showAlert = false" />
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
const motivo = ref(null)
const nota = ref('')
const showAlert = ref(false)

watch(() => props.visible, (value) => {
  if (value) {
    motivo.value = null
    nota.value = props.row?.nota || ''
    showAlert.value = false
  }
})

const cerrar = () => {
  emit('update:visible', false)
}

const confirmar = async () => {
  if (!motivo.value) {
    showAlert.value = true
    return
  }
  await store.incluir(props.row, motivo.value, nota.value)
  cerrar()
}
</script>
