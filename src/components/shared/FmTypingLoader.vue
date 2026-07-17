<template>
  <div
    class="fm-typing-loader"
    :class="loaderClasses"
    role="status"
    aria-live="polite"
    :aria-label="accessibleMessage"
  >
    <div class="fm-typing-loader__box">
      <div class="fm-coder-loader" aria-hidden="true">
        <div class="fm-coder-loader__desk">
          <div class="fm-coder-loader__monitor">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="fm-coder-loader__keyboard"></div>
        </div>

        <div class="fm-coder-loader__chair-wrap">
          <div class="fm-coder-loader__chair">
            <div class="fm-coder-loader__head"></div>
            <div class="fm-coder-loader__body"></div>
            <div class="fm-coder-loader__arm fm-coder-loader__arm--left"></div>
            <div class="fm-coder-loader__arm fm-coder-loader__arm--right"></div>
            <div class="fm-coder-loader__seat"></div>
            <div class="fm-coder-loader__wheel fm-coder-loader__wheel--left"></div>
            <div class="fm-coder-loader__wheel fm-coder-loader__wheel--right"></div>
          </div>
        </div>
      </div>

      <strong v-if="showTitle && displayTitle" class="fm-typing-loader__title">{{ displayTitle }}</strong>
      <div v-if="showMessage" class="fm-typing-loader__message">
        {{ message }}<span class="fm-typing-loader__dots" aria-hidden="true"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

/**
 * Loader global Field Manager.
 * --------------------------------------------------------------------------
 * Loader CSS sin imagen externa: tipito codeando con silla girando.
 *
 * COMO USAR EN OTRAS PANTALLAS:
 *
 * 1) Pantalla completa / cambio de ruta:
 *    <FmTypingLoader fullscreen title="Cargando" message="Cargando pantalla" />
 *
 * 2) Dentro de una grilla:
 *    <FmGridShell :loading="loading" loading-message="Cargando grilla">
 *      <DataTable :value="rows" />
 *    </FmGridShell>
 *
 * 3) Dentro de un popup/dialog:
 *    <Dialog v-model:visible="visible" modal header="Alerta" class="fm-dialog">
 *      <div class="fm-dialog-body">...</div>
 *      <FmTypingLoader v-if="loading" overlay variant="dialog" title="Procesando" message="Guardando cambios" />
 *    </Dialog>
 *
 * No repetir CSS scoped para este loader. La estetica esta en:
 * src/assets/css/components/loaders/fm-loader.css
 */

const props = defineProps({
  title: { type: String, default: 'Cargando' },
  message: { type: String, default: 'Procesando información' },
  variant: { type: String, default: 'inline' },
  fullscreen: { type: Boolean, default: false },
  overlay: { type: Boolean, default: false },
  inline: { type: Boolean, default: false },
  showTitle: { type: Boolean, default: true },
  showMessage: { type: Boolean, default: true }
})

const displayTitle = computed(() => props.title || props.message)
const accessibleMessage = computed(() => `${displayTitle.value}. ${props.message}`.trim())

const loaderClasses = computed(() => ({
  'fm-typing-loader--fullscreen': props.fullscreen,
  'fm-typing-loader--overlay': props.overlay,
  'fm-typing-loader--inline': props.inline || (!props.fullscreen && !props.overlay),
  [`fm-typing-loader--${props.variant}`]: Boolean(props.variant)
}))
</script>
