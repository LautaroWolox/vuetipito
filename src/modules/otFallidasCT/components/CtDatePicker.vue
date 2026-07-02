<template>
  <div ref="root" class="ct-date-picker">
    <button type="button" class="ct-date-button" :class="{ active: open }" @click="open = !open">
      <span>{{ displayValue }}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v3M17 2v3M4 8h16M6 4h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" /></svg>
    </button>
    <div v-if="open" class="ct-calendar">
      <div class="ct-calendar-head">
        <button type="button" class="ct-nav" @click="previousMonth">‹</button>
        <div class="ct-calendar-title">
          <strong>{{ monthNames[viewMonth] }}</strong>
          <select v-model.number="viewYear">
            <option v-for="year in years" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <button type="button" class="ct-nav" @click="nextMonth">›</button>
      </div>
      <div class="ct-weekdays"><span v-for="day in weekdays" :key="day">{{ day }}</span></div>
      <div class="ct-days">
        <button v-for="day in calendarDays" :key="day.key" type="button" :class="{ outside: !day.current, selected: isSelected(day.date), today: isToday(day.date) }" @click="selectDay(day.date)">{{ day.date.getDate() }}</button>
      </div>
      <div class="ct-calendar-actions">
        <button type="button" @click="clear">Borrar</button>
        <button type="button" @click="selectToday">Hoy</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
const props = defineProps({ modelValue: { type: [Date, String, null], default: null }, placeholder: { type: String, default: 'Seleccionar fecha' } })
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
const selectDay = date => { emit('update:modelValue', new Date(date)); open.value = false }
const selectToday = () => { const today = new Date(); viewMonth.value = today.getMonth(); viewYear.value = today.getFullYear(); selectDay(today) }
const clear = () => { emit('update:modelValue', null); open.value = false }
const previousMonth = () => { if (viewMonth.value === 0) { viewMonth.value = 11; viewYear.value-- } else viewMonth.value-- }
const nextMonth = () => { if (viewMonth.value === 11) { viewMonth.value = 0; viewYear.value++ } else viewMonth.value++ }
const close = event => { if (!root.value || root.value.contains(event.target)) return; open.value = false }
watch(selectedDate, value => { if (value) { viewMonth.value = value.getMonth(); viewYear.value = value.getFullYear() } })
onMounted(() => document.addEventListener('mousedown', close))
onBeforeUnmount(() => document.removeEventListener('mousedown', close))
</script>
<style scoped>
.ct-date-picker{position:relative;width:100%}.ct-date-button{width:100%;height:30px;border:1px solid #c7d1d8;border-radius:3px;background:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 8px;color:#34465b;font-size:13px;cursor:pointer;text-align:left}.ct-date-button svg{width:16px;height:16px;fill:none;stroke:var(--fm-cyan);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.ct-date-button:hover,.ct-date-button.active{border-color:var(--fm-cyan);box-shadow:0 0 0 2px rgba(0,188,212,.14)}.ct-calendar{position:absolute;z-index:9900;top:35px;left:0;width:268px;background:#fff;border:1px solid var(--fm-cyan);border-radius:6px;box-shadow:0 12px 30px rgba(0,0,0,.2);padding:10px}.ct-calendar-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.ct-nav{width:26px;height:26px;border:1px solid #d4e3e8;background:#fff;border-radius:50%;cursor:pointer;color:var(--fm-cyan);font-size:22px;line-height:20px}.ct-nav:hover{background:var(--fm-cyan-soft)}.ct-calendar-title{display:flex;align-items:center;justify-content:center;gap:7px;min-width:168px}.ct-calendar-title strong{font-size:13px;color:#263238}.ct-calendar-title select{height:26px;border:1px solid #c7d1d8;border-radius:3px;background:#fff;color:#263238;font-size:12px;padding:2px 5px}.ct-weekdays,.ct-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}.ct-weekdays span{font-size:10px;font-weight:700;text-align:center;color:#607d8b;padding:3px 0}.ct-days button{height:28px;border:0;background:#fff;border-radius:50%;cursor:pointer;font-size:12px;color:#263238}.ct-days button:hover{background:var(--fm-cyan-soft)}.ct-days button.outside{color:#b0bec5}.ct-days button.today{box-shadow:inset 0 0 0 1px var(--fm-cyan)}.ct-days button.selected{background:var(--fm-cyan)!important;color:#fff!important;font-weight:700}.ct-calendar-actions{display:flex;justify-content:space-between;margin-top:8px;border-top:1px solid #edf2f5;padding-top:8px}.ct-calendar-actions button{border:0;background:transparent;color:var(--fm-cyan);cursor:pointer;font-size:12px}.ct-calendar-actions button:hover{color:var(--fm-cyan-strong);text-decoration:underline}
</style>
