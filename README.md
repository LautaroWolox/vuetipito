#Frontend de Field Manager construido con Vue 3 + Vite.

El objetivo del proyecto es migrar pantallas tipo JSP/Field Manager hacia Vue, manteniendo la estética del sistema actual pero con una estructura más limpia, modular y fácil de mantener.

## Stack

- Vue 3
- Vue Router
- Vite
- JavaScript / TypeScript según pantalla
- CSS separado por pantalla y componente
- Servicios preparados para API REST
- Exportación a Excel reutilizable

## Instalación

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Variables de entorno

El proyecto soporta variables por ambiente:

```txt
.env
.env.desa1
.env.inte
.env.uat
.env.production
```

Variables principales:

```env
VITE_FM_MV_URL_2=http://localhost:8080
VITE_AUTH_DEMO=true
VITE_USE_MOCKS=true
```

- `VITE_FM_MV_URL_2`: URL base del backend.
- `VITE_AUTH_DEMO`: permite alternar login demo/local y login real.
- `VITE_USE_MOCKS`: permite alternar datos mock y endpoints reales.

## Estructura general

```txt
src/
├── assets/
│   ├── css/
│   │   ├── nuestros.css
│   │   └── theme.css
│   ├── icons/
│   └── images/
├── components/
│   ├── botones/
│   │   ├── BotonBuscar.vue
│   │   └── BotonLimpiar.vue
│   ├── menu/
│   └── shared/
├── composables/
│   └── useExportExcel.js
├── modules/
│   ├── notaCredito/
│   ├── notaDebito/
│   ├── registroOtsFallidasCT/
│   ├── otFallidasGM/
│   ├── validacionOtRedes/
│   ├── gestionMaterialesOt/
│   ├── configJobtypeContrato/
│   ├── configCmoActividad/
│   ├── consultarActas/
│   └── reporteSas/
├── services/
├── store/
├── utils/
└── views/
```

## Regla para pantallas nuevas

Toda pantalla nueva debe vivir dentro de `src/modules` y tener su propia estructura interna.

```txt
src/modules/nombrePantalla/
├── NombrePantalla.vue
├── components/
│   ├── Filtros.vue
│   ├── Tabla.vue
│   ├── Grilla.vue
│   ├── Popups.vue
│   └── elementos/
├── columns/
│   └── columns.js
├── store/
│   └── nombrePantallaStore.js
├── composables/
│   └── useNombrePantalla.js
├── utils/
│   ├── exportarExcel.js
│   └── helpers.js
├── mocks/
│   └── mockData.js
└── types.js
```

## Regla para tablas y grillas

Cada pantalla debe tener su propia tabla o grilla dentro de su carpeta.

Ejemplo:

```txt
src/modules/notaCredito/components/Tabla.vue
src/modules/notaDebito/components/Tabla.vue
src/modules/registroOtsFallidasCT/components/Tabla.vue
```

No se debe importar una tabla de otra pantalla. Los componentes compartidos quedan solamente para elementos realmente generales, como select, alertas, loaders, botones base o datepickers.

## Componentes compartidos

Los componentes reutilizables generales están en:

```txt
src/components/shared/
src/components/botones/
```

Ejemplos:

- `FmTurquoiseSelect.vue`
- `FmTypingLoader.vue`
- `FmAlertDialog.vue`
- `BotonBuscar.vue`
- `BotonLimpiar.vue`

## Exportar a Excel

La lógica compartida está en:

```txt
src/composables/useExportExcel.js
src/utils/excelExport.js
```

Cada pantalla puede tener además su propio wrapper local en:

```txt
src/modules/nombrePantalla/utils/exportarExcel.js
```

## Pantallas principales trabajadas

- Registro OTs Fallidas CT
- Registro OTs Fallidas Gestión de Materiales
- Validación OT de Redes
- Gestión de Materiales en OTs
- Configuración Jobtype-Contrato
- Configuración CMO-Actividad
- Consultar Actas
- Consultar Nota de Crédito
- Consultar Nota de Débito
- Reporte SAS
- Búsqueda de OTs

## Estado actual

El proyecto sigue siendo una maqueta funcional en proceso de ordenamiento. Las panta
