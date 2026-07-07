<template>
  <div class="fm-field fm-field--span-2 otf-filter-element otf-filter-element--excluida">
    <label for="otf-excluida">Excluida</label>
    <Select
      inputId="otf-excluida"
      :modelValue="modelValue"
      :options="options"
      optionLabel="name"
      class="w-full"
      showClear
      :disabled="disabled"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import Select from 'primevue/select'

defineProps({
  modelValue: { type: [Object, String, null], default: null },
  options: { type: Array, default: () => [] },
  disabled: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.otf-filter-element label {
  white-space: nowrap;
}

.otf-filter-element :deep(.p-select) {
  width: 100%;
}
</style>
