<template>
  <div class="fm-field fm-field--span-2 otf-filter-element otf-filter-element--fecha-hasta">
    <label for="otf-fecha-hasta">Fecha Cierre OT Hasta</label>
    <CtDatePicker
      inputId="otf-fecha-hasta"
      :modelValue="modelValue"
      placeholder="Hasta"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import CtDatePicker from '../CtDatePicker.vue'

defineProps({
  modelValue: { type: [Date, String, null], default: null }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.otf-filter-element label {
  white-space: nowrap;
}

.otf-filter-element :deep(.p-datepicker),
.otf-filter-element :deep(.ct-date-picker) {
  width: 100%;
}
</style>
