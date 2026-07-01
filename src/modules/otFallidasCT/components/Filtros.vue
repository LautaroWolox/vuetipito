<template>
    <div class="card" id="cajon">
        <div class="grid">
            <div class="col-3">
               <NroOT />
            </div>
            <div class="col-3">
               <FechaDesde />
            </div>
            <div class="col-3">
                <FechaHasta />
            </div>
            <div class="col-3">
                <Contratista />
            </div>
            <div class="col-3">
                <DescError />
            </div>
            <div class="col-3">
                <Excluida />
            </div>
            <div class="col-3">
                <Pais />
            </div>
        </div>
        <div class="flex flex-row justify-content-center gap-6 mt-3" >
            <Button id="BotonBuscar" label="BUSCAR" severity="info" rounded @click="buscar" size="large" />
            <Button id="BotonLimpiar" class="text-primary border-primary" label="LIMPIAR" severity="info" rounded outlined @click="limpiar" size="large" />
        </div>

    </div>
</template>

<script setup lang="js">
import Contratista from './elementos/Contratista.vue';
import DescError from './elementos/DescError.vue';
import Excluida from './elementos/Excluida.vue';
import FechaDesde from './elementos/FechaDesde.vue';
import FechaHasta from './elementos/FechaHasta.vue';
import NroOT from './elementos/NroOT.vue';
import Pais from './elementos/Pais.vue';

const limpiar = (event) => {
   alert("limpiar")
}

const buscar = async (event) => {
    alert("buscar")
}


</script>


<style lang="css" scoped>
</style>