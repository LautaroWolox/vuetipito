<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="fm-action-button"
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
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }
})

defineEmits(['click'])

const variantClass = computed(() => {
  return props.variant === 'outline' ? 'fm-action-button--outline' : 'fm-action-button--primary'
})
</script>
