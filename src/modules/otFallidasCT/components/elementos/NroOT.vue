<template>
    <div class="flex flex-column px-2">
        <label for="ot">Nro OT</label>
        <InputText type="text" id="ot" v-model="nroOt"/>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import InputText from 'primevue/inputtext';

const nroOt = ref(null);



</script>

<style scoped>
</style>
