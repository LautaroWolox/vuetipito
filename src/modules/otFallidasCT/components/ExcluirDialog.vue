<template>
  <Dialog
    :visible="visible"
    modal
    header="Alerta"
    :style="{ width: '58rem' }"
    class="fm-dialog fm-dialog-excluir"
    @update:visible="onVisibleChange"
  >
    <div v-if="step === 'form'" class="fm-dialog-body">
      <p>¿Confirma que desea excluir la OT seleccionada?</p>

      <label>Motivo</label>
      <Select v-model="motivoSelected" :options="motivos" optionLabel="name" class="w-full fm-dialog-select" />

      <label>Nota</label>
      <Textarea v-model="nota" rows="4" class="w-full" placeholder="Opcional" />
    </div>

    <div v-else class="fm-dialog-body">
      <p>¿Está seguro que desea confirmar?</p>

      <div class="fm-confirm-summary">
        <div class="fm-confirm-row">
          <div class="fm-confirm-label">MOTIVO</div>
          <div class="fm-confirm-value">{{ motivoSelected?.name }}</div>
        </div>
        <div class="fm-confirm-row">
          <div class="fm-confirm-label">NOTA</div>
          <div class="fm-confirm-value">{{ nota || 'Sin nota cargada' }}</div>
        </div>
      </div>
    </div>

    <template #footer>
      <Button label="CANCELAR" outlined class="fm-btn fm-btn--outline" @click="cerrar" />
      <Button label="ACEPTAR" class="fm-btn fm-btn--primary" @click="aceptar" />
    </template>
  </Dialog>

  <Dialog v-model:visible="showValidationAlert" modal header="Alerta" :style="{ width: '42rem' }" class="fm-dialog-alert">
    <div class="fm-alert-body">
      <div class="fm-alert-triangle"><span>!</span></div>
      <span>{{ validationMessage }}</span>
    </div>
    <template #footer>
      <Button label="CERRAR" outlined class="fm-btn fm-btn--outline" @click="showValidationAlert = false" />
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
const showValidationAlert = ref(false)
const validationMessage = ref('')

watch(() => props.visible, (value) => {
  if (value) reset()
})

const reset = () => {
  motivoSelected.value = null
  nota.value = ''
  step.value = 'form'
  showValidationAlert.value = false
  validationMessage.value = ''
}

const cerrar = () => {
  reset()
  emit('update:visible', false)
}

const onVisibleChange = (value) => {
  if (!value) cerrar()
}

const showAlert = (message) => {
  validationMessage.value = message
  showValidationAlert.value = true
}

const aceptar = async () => {
  if (!props.selectedRows.length) {
    showAlert('Debe seleccionar al menos una OT para excluir.')
    return
  }

  if (!motivoSelected.value) {
    showAlert('Debe seleccionar un motivo.')
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
