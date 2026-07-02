<template>
  <Dialog :visible="visible" modal header="Alerta" :style="{ width: '44rem' }" class="otf-include-dialog" @update:visible="$emit('update:visible', $event)">
    <div class="otf-dialog-body">
      <p>¿Confirma que desea recuperar la OT seleccionada?</p>
      <label>Motivo</label>
      <Select v-model="motivo" :options="store.motivos" optionLabel="name" class="w-full otf-dialog-select" />
      <label>Nota</label>
      <Textarea v-model="nota" rows="4" class="w-full" placeholder="Opcional" />
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
const motivo = ref(null)
const nota = ref('')

watch(() => props.visible, (value) => {
  if (value) {
    motivo.value = null
    nota.value = props.row?.nota || ''
  }
})

const cerrar = () => {
  emit('update:visible', false)
}

const confirmar = async () => {
  if (!motivo.value) return window.alert('Debe seleccionar un motivo.')
  await store.incluir(props.row, motivo.value, nota.value)
  cerrar()
}
</script>

<style scoped>
.otf-dialog-body{padding:8px 0;color:#222;font-size:16px}.otf-dialog-body p{margin:0 0 18px}.otf-dialog-body label{display:block;margin:12px 0 7px;font-weight:500}.otf-dialog-select{max-width:420px}.otf-dialog-body :deep(textarea){resize:vertical;font-size:15px}.otf-include-dialog :deep(.p-dialog-header){font-size:24px;font-weight:400}.otf-include-dialog :deep(.p-dialog-footer){padding-top:18px}
</style>
