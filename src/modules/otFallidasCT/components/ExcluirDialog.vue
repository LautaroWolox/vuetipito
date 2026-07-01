<template>
    <Dialog
        :visible="visible"
        modal
        header="ALERTA"
        :style="{ width: '50rem' }"
        @update:visible="$emit('update:visible', $event)"
        >
        <div class="card flex-col justify-center">
            <div>
                Motivo 
                <br/>
                <Select id="motivo" v-model="motivoSelected" :options="motivos" optionLabel="name" />
            </div>
            <div>
                Comentario
                <br/>
                <InputText id="comentario" type="text" v-model="comentario" />
            </div>
        </div>
        <template #footer>
            <Button label="Cancelar" outlined @click="cerrar" />
            <Button label="Aceptar" @click="confirmar" />
        </template>
    </Dialog>
    <ConfirmDialog/>
</template>

<script setup>
    import { ref, computed } from 'vue';
    import { useFallidasCtStore } from '../store/CtFallidaStore';
    import InputText from 'primevue/inputtext';
    import ConfirmDialog from 'primevue/confirmdialog';
    import { useConfirm } from "primevue/useconfirm";

    const props = defineProps({
        visible: Boolean,
        selectedRows: {
            type: Array,
            default: () => []
        }
    })

    const confirm = useConfirm();
    const emit = defineEmits(['update:visible'])
    const store = useFallidasCtStore()  
    const motivos = store.motivos
    const motivoSelected = ref('')
    const comentario = ref('')

    function cerrar() {
        motivoSelected.value = ''
        comentario.value = ''
        emit('update:visible', false)
    }

    function confirmar() {
        console.log('motivo:' + motivoSelected.value.name)
        console.log('comentario: ' + comentario.value)
        console.log('selección: ' + store.selectedRows)
        if(store.selectedRows.length > 0){
        confirm.require({
            message: '¿Confirma que desea excluir la OT seleccionada?',
            header: 'ACEPTAR',
            rejectProps: {label: 'Cancelar'},
            acceptProps: {label: 'Aceptar'},
            accept: async () => {
               let resp = await store.sendExcluidas(store.getNotExcluded,motivoSelected.value,comentario.value)
               console.log('resp: ' + JSON.stringify(resp))
            },
            reject: () => {}
        });
        } else {
            alert('agregar toast de error')
        }
        cerrar()
    }


/*
//BOTON EXCLUIR OT Y LLAMADA A CONTROLLER
const excluirOtFallida = () => {
		var arrData = [];
		var selectedRow = $(OT_FALLIDAS_GRID).jqGrid("getGridParam", 'selrow');
		var arrDataStr;
		var arrSelectedRows = $(OT_FALLIDAS_GRID).jqGrid("getGridParam", 'selarrrow');
		let nota = $("#notaExclusionFallida").val();
		let motivoExclusion = $("#excluirOtFallidaMotivos").val();
		for (var i = 0; i < arrSelectedRows.length; i++) {
			var curr = $(OT_FALLIDAS_GRID).getRowData(arrSelectedRows[i]);
			if(curr.excluida === "N"){
						arrData.push(curr.id); // arrData.push(curr["nroOrdenTrabajo"]);
				}		
			}
		arrDataStr = JSON.stringify(arrData);
		toggleLoader();                                                                                               
		
		$.post("registroOTFallidasReproceso/excluirOTFallida.html", {arrDataStr: arrDataStr, nota: nota,motivoNombreCorto: motivoExclusion },function(data) {
			var page = $(OT_FALLIDAS_GRID).jqGrid("getGridParam", 'page');
			if(data.status) {
				if (validateFilters("filtrosForm")) {
					var filtrosBusqueda = $("#filtrosForm :input").serialize() + "&sinFiltros="+false;
					initotFallidasGrid("registroOT
                    FallidasReproceso/searchFallidas.html", filtrosBusqueda, page);
				} else {
					var filtrosBusqueda = $("#filtrosForm :input").serialize() + "&sinFiltros="+ true;
					initotFallidasGrid("registroOTFallidasReproceso/searchFallidas.html", filtrosBusqueda, page);
				}
			} else {
				let alertConfirm = $("#alertConfirmar");
				alertConfirm.find('#messageModal').html(data.respuesta);
				alertConfirm.modal("show");
			}
			$('#modalExcluirOtFallida').modal('hide');
		}).fail(function(error) {
		}).always(function() {
			toggleLoader();
		});
}
*/
</script>

