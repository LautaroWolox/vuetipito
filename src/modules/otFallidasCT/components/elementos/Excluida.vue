<template>
    <div class="flex flex-column px-2">
        <label for="excl">Excluida</label>
        <Select id="excl" v-model="selectedExcluida" :options="excluida" optionLabel="valor"class="w-full md:w-56" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedExcluida = ref();
const excluida = ref ([
    {'id': 1, 'valor': 'SI'},
    {'id': 2, 'valor': 'NO'},
])

</script>

<style scoped>
</style>
