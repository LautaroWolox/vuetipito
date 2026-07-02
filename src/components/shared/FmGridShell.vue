<template>
  <section class="fm-grid-shell">
    <header v-if="title || $slots.title || $slots.actions" class="fm-grid-title">
      <slot name="title">
        <span>{{ title }}</span>
      </slot>
      <slot name="actions" />
    </header>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' }
})
</script>
