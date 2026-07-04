<template>
  <div class="menu-container">
    <Menubar :model="items" class="main-menu">
      <template #end>
        <div class="user-section">
          <Button class="user-profile" text rounded type="button" @click="toggleDropdown">
            <span class="user-avatar" aria-hidden="true">
              <i class="pi pi-user"></i>
            </span>
            <span class="username">{{ userLabel }}</span>
            <i class="pi pi-chevron-down dropdown-icon" :class="{ rotated: showDropdown }"></i>
          </Button>

          <div v-if="showDropdown" class="dropdown-content">
            <div class="dropdown-arrow"></div>

            <div class="dropdown-header">
              <div class="dropdown-avatar" aria-hidden="true">
                <i class="pi pi-user"></i>
              </div>
              <div class="dropdown-title-block">
                <span class="dropdown-eyebrow">Usuario activo</span>
                <strong class="dropdown-title">{{ userLabel }}</strong>
              </div>
            </div>

            <div class="user-info">
              <div class="info-item">
                <span class="info-icon" aria-hidden="true">
                  <i class="pi pi-id-card"></i>
                </span>
                <span class="info-text">Legajo: {{ legajo }}</span>
              </div>
            </div>

            <div class="divider"></div>

            <Button class="logout-btn" text type="button" @click="logout">
              <template #icon>
                <i class="pi pi-sign-out"></i>
              </template>
              <span>Cerrar Sesión</span>
            </Button>
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
  min-height: 44px !important;
  padding: 0 11px 0 3px !important;
  border-radius: 999px !important;
  cursor: pointer !important;
  transition: all 0.25s ease !important;
  background: rgba(0, 123, 137, 0.28) !important;
  backdrop-filter: blur(7px);
  border: 1px solid rgba(255, 255, 255, 0.24) !important;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .18), 0 6px 18px rgba(0, 0, 0, .10) !important;
  color: #ffffff !important;
}

.user-profile:hover,
:deep(.user-profile.p-button:hover) {
  background: rgba(0, 123, 137, 0.36) !important;
  transform: translateY(-1px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .22), 0 8px 22px rgba(0, 0, 0, .14) !important;
  color: #ffffff !important;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  background: rgba(255, 255, 255, .18);
  border: 1px solid rgba(255, 255, 255, .30);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .22);
  flex: 0 0 34px;
  margin-left: -1px;
}

.user-avatar i {
  font-size: 16px;
}

.username {
  color: white;
  font-weight: 700;
  font-size: 0.92rem;
  max-width: 160px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-icon {
  color: white;
  font-size: 0.78rem;
  margin-left: 3px;
  transition: transform 0.25s ease;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 11px);
  right: 0;
  width: 292px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 16px 38px rgba(18, 34, 50, 0.16);
  z-index: 1000;
  overflow: visible;
  animation: dropdownFadeIn 0.2s ease-out;
  border: 1px solid rgba(226, 236, 241, .92);
}

.dropdown-content::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  pointer-events: none;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .95);
}

.dropdown-arrow {
  position: absolute;
  top: -7px;
  right: 26px;
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-left: 1px solid rgba(226, 236, 241, .92);
  border-top: 1px solid rgba(226, 236, 241, .92);
  transform: rotate(45deg);
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 14px 8px;
}

.dropdown-avatar {
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: linear-gradient(135deg, #00a9bd, #42cbd6);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px rgba(0, 169, 189, .20);
  flex: 0 0 38px;
}

.dropdown-avatar i {
  font-size: 17px;
}

.dropdown-title-block {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.dropdown-eyebrow {
  color: #7a8994;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.dropdown-title {
  color: #1d3444;
  font-size: 15px;
  line-height: 1.15;
  max-width: 190px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-info {
  padding: 5px 14px 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 10px 11px;
  border-radius: 12px;
  background: #f7fbfc;
  border: 1px solid #e2edf1;
  transition: all 0.2s ease;
}

.info-item:hover {
  background: #eefcff;
  border-color: rgba(0, 169, 189, .28);
}

.info-icon {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #008fa1;
  background: rgba(0, 169, 189, .10);
  flex: 0 0 28px;
}

.info-icon i {
  font-size: 14px;
}

.info-text {
  font-size: 13px;
  color: #40515e;
  font-weight: 600;
}

.divider {
  height: 1px;
  background: #e8eef2;
  margin: 0 14px;
}

.logout-btn,
:deep(.logout-btn.p-button) {
  width: calc(100% - 20px) !important;
  margin: 10px !important;
  min-height: 38px !important;
  padding: 0 12px !important;
  border-radius: 12px !important;
  background: #f2fcfd !important;
  border: 1px solid rgba(0, 169, 189, .16) !important;
  color: #008fa1 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 9px !important;
  font-weight: 500 !important;
  box-shadow: none !important;
}

.logout-btn:hover,
:deep(.logout-btn.p-button:hover) {
  background: #e9fbfd !important;
  border-color: rgba(0, 169, 189, .28) !important;
  color: #007d8d !important;
}

.logout-btn i {
  font-size: 15px;
}

.logout-btn span {
  font-size: 13px;
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
