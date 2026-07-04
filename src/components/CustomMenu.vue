<template>
  <div class="menu-container">
    <Menubar :model="items" class="main-menu">
      <template #end>
        <div class="user-section">
          <Button class="user-profile" text rounded type="button" @click="toggleDropdown">
            <span class="user-avatar" aria-hidden="true">{{ userInitials }}</span>
            <span class="username">{{ userLabel }}</span>
            <i class="pi pi-chevron-down dropdown-icon" :class="{ rotated: showDropdown }"></i>
          </Button>

          <div v-if="showDropdown" class="dropdown-content">
            <Button class="logout-btn" text type="button" icon="pi pi-sign-out" label="Cerrar Sesión" @click="logout" />
          </div>
        </div>
      </template>
    </Menubar>
    <div class="color-gradient"></div>
    <div class="spacer"></div>
  </div>
</template>

<script setup lang="ts">
import Menubar from 'primevue/menubar';
import Button from 'primevue/button';
import router from '@/router';
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '@/store/auth';
import 'primeicons/primeicons.css';
import { getRutas } from './rutas';

const authStore = useAuthStore()

const nombre = authStore.usuario?.nombre ?? ''
const legajo = authStore.usuario?.legajo ?? ''
const rutas = authStore.rutas;
const showDropdown = ref(false);
const items = ref(getRutas(rutas));

const userLabel = computed(() => nombre || legajo || 'Usuario')
const userInitials = computed(() => {
  const value = userLabel.value.trim()
  if (!value) return 'US'
  const parts = value.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return value.slice(0, 2).toUpperCase()
})

const logout = () => {
  authStore.logout()
  router.push({ name: 'login2fa' })
}

const toggleDropdown = (event: MouseEvent) => {
  event.stopPropagation();
  showDropdown.value = !showDropdown.value;
};

const closeDropdown = () => {
  showDropdown.value = false;
};

const handleClickOutside = (event: any) => {
  const userSection = document.querySelector('.user-section');
  const dropdown = document.querySelector('.dropdown-content');

  if (!userSection?.contains(event.target) && (!dropdown || !dropdown.contains(event.target))) {
    closeDropdown();
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
.menu-container {
  width: 100%;
  position: relative;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.barra {
  font-size: 1.1rem;
}

.main-menu {
  background: linear-gradient(135deg, #2c3e50, #3498db);
  border: none;
  border-radius: 0;
  padding: 0 2rem;
  height: 53px;
}

.user-section {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: auto;
}

.user-profile,
:deep(.user-profile.p-button) {
  display: flex !important;
  align-items: center !important;
  gap: 7px !important;
  min-height: 34px !important;
  height: 34px !important;
  padding: 0 9px 0 8px !important;
  border-radius: 0 !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  background: transparent !important;
  border: 0 !important;
  color: #ffffff !important;
  box-shadow: none !important;
}

.user-profile:hover,
:deep(.user-profile.p-button:hover) {
  background: rgba(255, 255, 255, 0.12) !important;
  color: #ffffff !important;
  box-shadow: none !important;
  transform: none !important;
}

.user-avatar {
  width: 27px;
  height: 27px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #0096a4;
  background: #ffffff;
  font-size: 11px;
  font-weight: 500;
  line-height: 1;
  flex: 0 0 27px;
}

.username {
  color: #ffffff;
  font-weight: 600;
  font-size: 11px;
  max-width: 120px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  color: #ffffff;
  font-size: 9px;
  margin-left: 1px;
  transition: transform 0.2s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  min-width: 152px;
  background: #ffffff;
  border-radius: 0;
  box-shadow: 0 6px 14px rgba(18, 34, 50, 0.11);
  z-index: 1000;
  overflow: hidden;
  animation: dropdownFadeIn 0.18s ease-out;
  border: 1px solid #e5edf2;
  border-top: 0;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logout-btn,
:deep(.logout-btn.p-button) {
  width: 100% !important;
  min-height: 32px !important;
  padding: 0 11px !important;
  border-radius: 0 !important;
  background: #ffffff !important;
  border: 0 !important;
  color: #e52424 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 7px !important;
  font-weight: 500 !important;
  box-shadow: none !important;
}

.logout-btn:hover,
:deep(.logout-btn.p-button:hover) {
  background: #fff5f5 !important;
  color: #d51f1f !important;
}

.logout-btn :deep(.p-button-icon),
.logout-btn :deep(.pi) {
  font-size: 12px !important;
}

.logout-btn :deep(.p-button-label) {
  font-size: 11px !important;
  font-weight: 500 !important;
}

.color-gradient {
  height: 5px;
  width: 100%;
  background: linear-gradient(
    to right,
    #3fc1cb 0%, #3bb9c2 2%, #009a97 16%,
    #97a96b 24%, #ebbb1d 32%, #f28cb9 48%,
    #e30f72 66%, #91268f 82%, #024da1 100%
  );
}

.spacer {
  height: 30px;
  background-color: #f8f9fa;
}

/* Estilos para el menú principal */
:deep(.p-menubar) {
  background: transparent;
  border: none;
  padding: 0;
}

:deep(.p-menubar .p-menubar-root-list) {
  gap: 0.5rem;
}

:deep(.p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-content .p-menuitem-link) {
  padding: 1rem 1.5rem;
  color: white !important;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 4px;
}

:deep(.p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-content .p-menuitem-link:hover) {
  background: rgba(255, 255, 255, 0.15) !important;
}

:deep(.p-menubar .p-menuitem-content .p-menuitem-link .p-menuitem-text) {
  font-size: 0.95rem;
}

:deep(.p-menubar .p-submenu-list) {
  background: white;
  border: none;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

:deep(.p-menubar .p-submenu-list .p-menuitem-content .p-menuitem-link) {
  padding: 0.75rem 1.25rem;
  color: #495057 !important;
}

:deep(.p-menubar .p-submenu-list .p-menuitem-content .p-menuitem-link:hover) {
  background: #f8f9fa !important;
}

:deep(.p-menubar .p-submenu-list .p-menuitem-content .p-menuitem-link .p-menuitem-text) {
  font-size: 0.9rem;
}
</style>
