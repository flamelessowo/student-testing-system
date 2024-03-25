<script setup lang="ts">
import { ref } from 'vue'
const opened = ref(false);
defineExpose({
  opened
})
</script>
<template>
  <q-dialog v-model="opened">
    <slot></slot>
  </q-dialog>  
</template>
