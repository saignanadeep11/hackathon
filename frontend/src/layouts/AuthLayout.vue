<template>
  <q-layout view="hHh lpr fFf" class="auth-layout">
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style lang="scss" scoped>
.auth-layout {
  background: $dark-page;
  min-height: 100vh;
}
</style>
