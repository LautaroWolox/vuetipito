<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="fm-action-button fm-ui-button"
    :class="variantClass"
    @click="$emit('click', $event)"
  >
    <slot name="icon">
      <i v-if="icon" :class="['pi', icon]"></i>
    </slot>
    <span>{{ loading ? loadingLabel : label }}</span>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  loadingLabel: { type: String, default: 'PROCESANDO...' },
  icon: { type: String, default: '' },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'outline'].includes(value)
  },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

defineEmits(['click'])

const variantClass = computed(() => ({
  'fm-action-button--primary fm-ui-button--primary': props.variant === 'primary',
  'fm-action-button--outline fm-ui-button--outline': props.variant === 'outline'
}))
</script>
