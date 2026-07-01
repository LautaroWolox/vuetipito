<template>
    <div class="flex flex-column px-2">
        <label for="contratista">Contratista</label>
        <Select id="contratista" v-model="selectedContratista" :options="contratistas" optionLabel="nombre" class="w-full md:w-56" />
    </div>
</template>

<script setup>
import { ref } from "vue";

const selectedContratista = ref();

const contratistas = ref([
    {'id': 1, 'nombre': 'cont1'},
    {'id': 2, 'nombre': 'cont2'},
    {'id': 3, 'nombre': 'cont3'},
    {'id': 4, 'nombre': 'cont4'},
]);


</script>

<style scoped>
</style>

