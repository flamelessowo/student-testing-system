<script setup lang="ts">
const emits = defineEmits(['addEvent'])
</script>
<template>
  <q-btn @click="emits('addEvent')" round color="secondary" icon="add" />
</template>
<style scoped>
</style>
