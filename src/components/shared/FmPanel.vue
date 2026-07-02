<template>
  <section class="fm-card">
    <header v-if="title || $slots.header" class="fm-card__header">
      <slot name="header">
        <span>{{ title }}</span>
      </slot>
      <slot name="headerActions" />
    </header>
    <div class="fm-card__body" :class="{ 'fm-card__body--accent': accent }">
      <slot />
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  accent: { type: Boolean, default: false }
})
</script>
