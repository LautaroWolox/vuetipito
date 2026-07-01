<template>
    <div class="flex flex-column px-2">
        <label for="date">Fecha Hasta</label>
        <DatePicker id="date" dateFormat="dd/mm/yy" :manualInput="false" class="w-auto"
        v-model="fechaSelected" @date-select="capturarFecha($event)" variant="filled"
        @clear-click="borrarFecha($event)" showIcon selectOtherMonths showButtonBar />
    </div>
</template>

<script setup>

import DatePicker from 'primevue/datepicker';
import { ref, watch } from "vue";
import dayjs from 'dayjs';

const fechaSelected = ref(null);
const capturarFecha = (event) => {
    alert("fecha")
}
const borrarFecha = (event) => {
    alert("borrar")
}

</script>

<style scoped>
</style>
