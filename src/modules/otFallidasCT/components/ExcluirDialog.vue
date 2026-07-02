<template>
  <Dialog
    :visible="visible"
    modal
    header="Alerta"
    :style="{ width: '58rem' }"
    class="otf-excluir-dialog"
    @update:visible="onVisibleChange"
  >
    <div v-if="step === 'form'" class="otf-dialog-body">
      <p>¿Confirma que desea excluir la OT seleccionada?</p>

      <label>Motivo</label>
      <Select v-model="motivoSelected" :options="motivos" optionLabel="name" class="w-full otf-dialog-select" />

      <label>Nota</label>
      <Textarea v-model="nota" rows="4" class="w-full" placeholder="Opcional" />
    </div>

    <div v-else class="otf-dialog-body">
      <p>¿Está seguro que desea confirmar?</p>

      <div class="otf-confirm-summary">
        <div class="otf-confirm-row">
          <div class="otf-confirm-label">MOTIVO</div>
          <div class="otf-confirm-value">{{ motivoSelected?.name }}</div>
        </div>
        <div class="otf-confirm-row">
          <div class="otf-confirm-label">NOTA</div>
          <div class="otf-confirm-value">{{ nota || 'Sin nota cargada' }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" @click="cerrar" />
      <Button label="ACEPTAR" class="fm-btn fm-btn--primary" @click="aceptar" />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import Textarea from 'primevue/textarea'
import { useFallidasCtStore } from '../store/CtFallidaStore'

const props = defineProps({
  visible: Boolean,
  selectedRows: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible'])
const store = useFallidasCtStore()
const motivos = store.motivos
const motivoSelected = ref(null)
const nota = ref('')
const step = ref('form')

watch(() => props.visible, (value) => {
  if (value) reset()
})

const reset = () => {
  motivoSelected.value = null
  nota.value = ''
  step.value = 'form'
}

const cerrar = () => {
  reset()
  emit('update:visible', false)
}

const onVisibleChange = (value) => {
  if (!value) cerrar()
}

const aceptar = async () => {
  if (!props.selectedRows.length) {
    window.alert('Debe seleccionar al menos una OT para excluir.')
    return
  }

  if (!motivoSelected.value) {
    window.alert('Debe seleccionar un motivo.')
    return
  }

  if (step.value === 'form') {
    step.value = 'confirm'
    return
  }

  await store.sendExcluidas(store.getNotExcluded, motivoSelected.value, nota.value)
  cerrar()
}
</script>

<style scoped>
.otf-dialog-body{padding:8px 0;color:#222;font-size:16px}.otf-dialog-body p{margin:0 0 18px;font-size:18px}.otf-dialog-body label{display:block;margin:16px 0 8px;font-weight:500}.otf-dialog-select{max-width:420px}.otf-dialog-body :deep(textarea){resize:vertical;font-size:15px}.otf-excluir-dialog :deep(.p-dialog-header){font-size:24px;font-weight:400}.otf-excluir-dialog :deep(.p-dialog-footer){padding-top:18px}.otf-confirm-summary{border:1px solid #dce8ec;border-radius:6px;background:#f7fcfd;overflow:hidden}.otf-confirm-row{display:grid;grid-template-columns:190px 1fr;gap:12px;padding:14px 18px;border-bottom:1px solid #e4eef2}.otf-confirm-row:last-child{border-bottom:0}.otf-confirm-label{font-size:14px;color:#6d8798;font-weight:500}.otf-confirm-value{font-size:15px;color:#263238;font-weight:700;white-space:pre-wrap}
</style>
