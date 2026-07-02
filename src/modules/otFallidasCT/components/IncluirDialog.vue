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

  <Dialog v-model:visible="showAlert" modal header="Alerta" :style="{ width: '42rem' }" class="otf-validation-alert">
    <div class="otf-alert-body">
      <div class="otf-alert-triangle">!</div>
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

<style scoped>
.otf-dialog-body{padding:8px 0;color:#222;font-size:16px}.otf-dialog-body p{margin:0 0 18px}.otf-dialog-body label{display:block;margin:12px 0 7px;font-weight:500}.otf-dialog-select{max-width:420px}.otf-dialog-body :deep(textarea){resize:vertical;font-size:15px}.otf-include-dialog :deep(.p-dialog-header),.otf-validation-alert :deep(.p-dialog-header){font-size:24px;font-weight:400}.otf-include-dialog :deep(.p-dialog-footer),.otf-validation-alert :deep(.p-dialog-footer){padding-top:18px}.otf-alert-body{display:flex;align-items:center;gap:34px;min-height:112px;padding:18px 8px;font-size:17px;color:#263238}.otf-alert-triangle{width:58px;height:50px;display:flex;align-items:center;justify-content:center;color:#d73333;font-size:38px;font-weight:800;line-height:1;position:relative}.otf-alert-triangle:before{content:"";position:absolute;left:0;top:0;width:0;height:0;border-left:29px solid transparent;border-right:29px solid transparent;border-bottom:50px solid #d73333}.otf-alert-triangle:after{content:"";position:absolute;left:7px;top:7px;width:0;height:0;border-left:22px solid transparent;border-right:22px solid transparent;border-bottom:38px solid white}.otf-alert-triangle{z-index:1}.otf-alert-triangle::first-letter{position:relative;z-index:3}
</style>
