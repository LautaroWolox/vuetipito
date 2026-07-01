<template>
  <div class="fm-loader" :class="{ inline: inline }">
    <div class="fm-loader-card">
      <div class="fm-loader-head"></div>
      <div class="fm-loader-screen"><span></span><span></span><span></span></div>
      <strong>{{ title }}</strong>
      <p>{{ message }}</p>
    </div>
  </div>
</template>
<script setup>
defineProps({ title: { type: String, default: 'Cargando' }, message: { type: String, default: 'Procesando información...' }, inline: { type: Boolean, default: false } })
</script>
