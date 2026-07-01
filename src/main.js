import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/css/nuestros.css';
import Lara from '@primeuix/themes/lara';

import { definePreset } from '@primeuix/themes';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { strings } from './strings.js'
import { fmPrimePassThrough } from './components/shared/primePassThrough.js'

import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import Tooltip from 'primevue/tooltip';
import App from './App.vue';
import router from './router';

// Componentes globales de primevue
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Select from 'primevue/select';
import ProgressSpinner from 'primevue/progressspinner';
import MultiSelect from 'primevue/multiselect'
import Dialog from 'primevue/dialog';


const pinia = createPinia();
pinia.use(piniaPluginPersistedState);

const MyPreset = definePreset(Lara, {
    semantic: {
        primary: {
            50: '#e0fafa',
            100: '#b3f1f1',
            200: '#80e7e8',
            300: '#4ddddd',
            400: '#26d4d4',
            500: '#00b4b5', // color base
            600: '#009fa0',
            700: '#008b8c',
            800: '#007678',
            900: '#006364',
            950: '#004445'
        }
    }
});

const app = createApp(App)
app.use(pinia);
app.use(router);
app.use(ToastService);
app.use(ConfirmationService);
app.use(PrimeVue, {
    theme: {
        preset: MyPreset,
        options: {
            prefix: '',
            cssLayer: {
                name: 'primevue',
                order: 'primevue, nuestros'
            },
            darkModeSelector: false
        }
    },
    pt: fmPrimePassThrough,
    ripple: true,
    inputVariant: "filled",
    locale: strings.locale
});

// Componentes globales
app.component('Accordion', Accordion);
app.component('AccordionPanel', AccordionPanel);
app.component('AccordionHeader', AccordionHeader);
app.component('AccordionContent', AccordionContent);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);
app.component('CheckBox', Checkbox);
app.component('ProgressSpinner', ProgressSpinner);
app.component('MultiSelect', MultiSelect);
app.component('Dialog', Dialog);
app.component('Select',Select);

app.directive('tooltip', Tooltip);
app.mount('#app');

