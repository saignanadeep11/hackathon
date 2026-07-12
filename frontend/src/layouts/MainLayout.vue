<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Header App Bar -->
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />
        <q-toolbar-title class="font-outfit text-weight-bold text-subtitle1 q-pl-md">
          AssetFlow
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Sidebar Drawer -->
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="260"
    >
      <div class="column full-height q-pa-md justify-between">
        <!-- Bottom / Main Navigation Section -->
        <div>
          <!-- Branding -->
          <div class="q-mb-xl q-px-sm">
            <div class="text-h5 text-bold tracking-wide font-outfit">
              AssetFlow
            </div>
            <div class="text-caption text-grey-6 text-weight-medium">
              Enterprise Resource Mgmt
            </div>
          </div>

          <!-- Navigation Links -->
          <q-list class="q-gutter-y-xs">
            <q-item
              v-for="item in menuItems"
              :key="item.name"
              clickable
              v-ripple
              :active="activeItem === item.name"
              @click="onMenuItemClick(item.name)"
              class="navigation-item q-py-sm"
              active-class="active-nav-item"
            >
              <q-item-section avatar class="min-width-auto q-pr-md">
                <q-icon 
                  :name="item.icon" 
                  size="20px" 
                  :color="activeItem === item.name ? 'primary' : 'grey-5'" 
                />
              </q-item-section>

              <q-item-section class="text-weight-medium text-body2">
                {{ item.label }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </q-drawer>

    <!-- Page Container -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const leftDrawerOpen = ref(true);
const activeItem = ref('dashboard');

const menuItems = [
  { name: 'dashboard', label: 'Dashboard', icon: 'space_dashboard' }
];

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function onMenuItemClick(name: string) {
  activeItem.value = name;
  if (leftDrawerOpen.value && window.innerWidth < 1024) {
    leftDrawerOpen.value = false;
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');

.font-outfit {
  font-family: 'Outfit', sans-serif;
}


.navigation-item {
  transition: all 0.3s ease;
  border-radius: 8px;
  margin: 0 4px;
  color: #94a3b8;
  
  &:hover {
    background: rgba(255, 255, 255, 0.03);
    color: #ffffff !important;
    .q-icon {
      color: #ffffff !important;
    }
  }
}

.active-nav-item {
  background: rgba(59, 130, 246, 0.15) !important;
  border-left: 3px solid #3b82f6;
  border-radius: 0 8px 8px 0;
  margin-left: -16px;
  padding-left: 13px !important;
  
  .q-icon {
    color: #3b82f6 !important;
  }
}

.min-width-auto {
  min-width: auto !important;
}

.quick-scan-btn {
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  }
}
</style>
