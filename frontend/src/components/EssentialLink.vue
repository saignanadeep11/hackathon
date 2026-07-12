<template>
  <q-item clickable v-bind="linkProps">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { computed } from 'vue';

export interface EssentialLinkProps {
  label: string;
  caption?: string;
  link?: string;
  icon?: string;
}

const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
});

const isExternal = computed(() => {
  return typeof props.link === 'string' && props.link.startsWith('http');
});

const linkProps = computed(() => {
  if (isExternal.value) {
    return {
      tag: 'a',
      href: props.link,
      target: '_blank',
    };
  }
  return {
    to: props.link,
  };
});
</script>
