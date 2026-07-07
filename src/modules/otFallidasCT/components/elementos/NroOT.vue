<template>
  <div class="fm-field fm-field--span-4 otf-filter-element otf-filter-element--nro-ot">
    <label for="otf-nro-ot">Nro. OT</label>
    <InputText
      id="otf-nro-ot"
      :modelValue="modelValue"
      class="w-full"
      type="text"
      autocomplete="off"
      :disabled="disabled"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script setup>
import InputText from 'primevue/inputtext'

defineProps({
  modelValue: { type: [String, Number, null], default: '' },
  disabled: { type: Boolean, default: false }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
.otf-filter-element label {
  white-space: nowrap;
}

.otf-filter-element :deep(.p-inputtext) {
  width: 100%;
}
</style>
