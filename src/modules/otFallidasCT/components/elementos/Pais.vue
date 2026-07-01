<template>
    <div class="flex flex-column px-2">
        <label for="pais">País</label>
        <Select id="pais" v-model="selectedPais" :options="paises" optionLabel="valor" class="w-full md:w-56" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedPais = ref();
const paises = ref ([
    {'id': 1, 'valor': 'ARG'},
    {'id': 2, 'valor': 'UY'},
    {'id': 3, 'valor': 'PY'},
])

</script>

<style scoped>
</style>
