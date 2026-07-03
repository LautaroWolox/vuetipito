<template>
  <DatePicker
    :inputId="inputId"
    v-model="internalValue"
    dateFormat="dd/mm/yy"
    :manualInput="false"
    :placeholder="placeholder"
    class="fm-date-picker ct-date-picker"
    panelClass="fm-calendar ct-calendar"
    variant="filled"
    showIcon
    selectOtherMonths
    showButtonBar
    @date-select="onDateSelect"
    @clear-click="onClearClick"
  />
</template>

<script setup>
import { computed } from 'vue'
import DatePicker from 'primevue/datepicker'

const props = defineProps({
  modelValue: { type: [Date, String, null], default: null },
  placeholder: { type: String, default: 'Seleccionar fecha' },
  inputId: { type: String, default: undefined }
})

const emit = defineEmits(['update:modelValue', 'date-select', 'clear-click'])

const internalValue = computed({
  get: () => props.modelValue ? new Date(props.modelValue) : null,
  set: (value) => emit('update:modelValue', value)
})

const onDateSelect = (value) => {
  emit('date-select', value)
}

const onClearClick = () => {
  emit('clear-click')
  emit('update:modelValue', null)
}
</script>

<style scoped>
.ct-date-picker {
  width: 100%;
}

.ct-date-picker :deep(.p-inputtext) {
  width: 100%;
  min-width: 0;
}

.ct-date-picker :deep(.p-datepicker-dropdown) {
  flex: 0 0 auto;
}
</style>
