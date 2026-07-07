<template>
  <div ref="root" class="fm-date-picker ct-date-picker" :class="{ 'ct-date-picker--disabled': disabled }">
    <button type="button" class="fm-date-button ct-date-button" :class="{ active: open }" :disabled="disabled" @click="toggleOpen">
      <span>{{ displayValue }}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v3M17 2v3M4 8h16M6 4h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
    </button>
    <div v-if="open" class="fm-calendar ct-calendar">
      <div class="fm-calendar-head ct-calendar-head">
        <button type="button" class="fm-calendar-nav ct-nav" @click="previousMonth">‹</button>
        <div class="fm-calendar-title ct-calendar-title">
          <strong>{{ monthNames[viewMonth] }}</strong>
          <select v-model.number="viewYear">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <button type="button" class="fm-calendar-nav ct-nav" @click="nextMonth">›</button>
      </div>
      <div class="fm-weekdays ct-weekdays"><span v-for="day in weekdays" :key="day">{{ day }}</span></div>
      <div class="fm-days ct-days">
        <button v-for="day in calendarDays" :key="day.key" type="button" :class="{ outside: !day.current, selected: isSelected(day.date), today: isToday(day.date) }" @click="selectDay(day.date)">{{ day.date.getDate() }}</button>
      </div>
      <div class="fm-calendar-actions ct-calendar-actions">
        <button type="button" @click="clear">Borrar</button>
        <button type="button" @click="selectToday">Hoy</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props = defineProps({ modelValue: { type: [Date, String, null], default: null }, placeholder: { type: String, default: 'Seleccionar fecha' }, inputId: { type: String, default: undefined }, disabled: { type: Boolean, default: false } })
const emit = defineEmits(['update:modelValue'])
const root = ref(null)
const open = ref(false)
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const weekdays = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA']
const now = new Date()
const selectedDate = computed(() => props.modelValue ? new Date(props.modelValue) : null)
const viewMonth = ref(selectedDate.value?.getMonth() ?? now.getMonth())
const viewYear = ref(selectedDate.value?.getFullYear() ?? now.getFullYear())
const years = computed(() => Array.from({ length: 15 }, (_, index) => now.getFullYear() - 7 + index))
const two = value => String(value).padStart(2, '0')
const sameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
const displayValue = computed(() => selectedDate.value ? `${two(selectedDate.value.getDate())}/${two(selectedDate.value.getMonth() + 1)}/${selectedDate.value.getFullYear()}` : props.placeholder)
const calendarDays = computed(() => {
  const first = new Date(viewYear.value, viewMonth.value, 1)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return { key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, date, current: date.getMonth() === viewMonth.value }
  })
})
const isSelected = date => sameDay(date, selectedDate.value)
const isToday = date => sameDay(date, now)
const toggleOpen = () => { if (!props.disabled) open.value = !open.value }
const selectDay = date => { if (props.disabled) return; emit('update:modelValue', new Date(date)); open.value = false }
const selectToday = () => { if (props.disabled) return; const today = new Date(); viewMonth.value = today.getMonth(); viewYear.value = today.getFullYear(); selectDay(today) }
const clear = () => { if (props.disabled) return; emit('update:modelValue', null); open.value = false }
const previousMonth = () => { if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- } else viewMonth.value-- }
const nextMonth = () => { if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ } else viewMonth.value++ }
const close = event => { if (!root.value || root.value.contains(event.target)) return; open.value = false }
watch(selectedDate, value => { if (value) { viewMonth.value = value.getMonth(); viewYear.value = value.getFullYear() } })
watch(() => props.disabled, value => { if (value) open.value = false })
onMounted(() => document.addEventListener('mousedown', close))
onBeforeUnmount(() => document.removeEventListener('mousedown', close))
</script>

<style scoped>
.ct-date-picker--disabled {
  opacity: .72;
  pointer-events: none;
}
</style>
