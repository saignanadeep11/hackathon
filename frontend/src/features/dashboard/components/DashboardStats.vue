<template>
  <div class="row q-col-gutter-md q-py-sm">
    <!-- Stat Cards -->
    <div 
      v-for="card in stats" 
      :key="card.title" 
      class="col-12 col-sm-6 col-lg-3"
    >
      <q-card 
        class="stat-card full-height justify-between column"
        :style="{ '--glow-color': card.glowColor }"
      >
        <q-card-section class="q-pb-none">
          <!-- Top Row: Icon and Category Tag -->
          <div class="row justify-between items-center no-wrap">
            <div 
              class="icon-wrapper flex flex-center"
              :style="{ backgroundColor: card.iconBg, color: card.iconColor }"
            >
              <q-icon :name="card.icon" size="20px" />
            </div>
            
            <div class="text-caption text-grey-7 font-outfit text-weight-medium">
              {{ card.title }}
            </div>
          </div>

          <!-- Middle Row: Big Number Value -->
          <div class="q-mt-md">
            <div class="text-h3 text-bold font-outfit">
              {{ card.value }}
            </div>
          </div>
        </q-card-section>

        <!-- Bottom Row: Subtext / Growth Info -->
        <q-card-section class="q-pt-sm">
          <div class="row items-center q-gutter-x-xs font-outfit text-caption">
            <!-- If we have a green status percentage -->
            <span 
              v-if="card.trend" 
              class="text-weight-bold text-positive"
            >
              {{ card.trend }}
            </span>
            <span class="text-grey-7">{{ card.subtext }}</span>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatCard {
  title: string;
  value: string;
  subtext: string;
  trend?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  glowColor: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Available',
    value: '1,248',
    subtext: 'this month',
    trend: '+12%',
    icon: 'assignment_turned_in',
    iconBg: 'rgba(59, 130, 246, 0.15)',
    iconColor: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.25)',
  },
  {
    title: 'Allocated',
    value: '3,892',
    subtext: 'Active assignments',
    icon: 'swap_horiz',
    iconBg: 'rgba(168, 85, 247, 0.15)',
    iconColor: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.25)',
  },
  {
    title: 'Maintenance',
    value: '14',
    subtext: 'Scheduled today',
    icon: 'schedule',
    iconBg: 'rgba(245, 158, 11, 0.15)',
    iconColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.25)',
  },
  {
    title: 'High Priority',
    value: '18',
    subtext: 'Overdue returns',
    icon: 'warning',
    iconBg: 'rgba(239, 68, 68, 0.15)',
    iconColor: '#ef4444',
    glowColor: 'rgba(239, 68, 68, 0.25)',
  },
];
</script>

<style lang="scss">
.stat-card {
  border-radius: 16px !important;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  overflow: hidden;
  position: relative;
  
  // Left active glow indicator
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: transparent;
    transition: background-color 0.3s ease;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px var(--glow-color) !important;
    
    &::before {
      background-color: var(--glow-color);
    }
  }
}


.icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  flex-shrink: 0;
}
</style>
