<script setup lang="ts">
const emits = defineEmits(['deleteEvent', 'editEvent'])
</script>
<template>
  <q-btn color="white" round flat icon="more_vert">
    <q-menu cover auto-close>
      <q-list>
        <q-item @click="emits('editEvent')" clickable>
          <q-item-section>Редагувати</q-item-section>
        </q-item>
        <q-item @click="emits('deleteEvent')" clickable>
          <q-item-section>Видалити</q-item-section>
        </q-item>
        <slot></slot>
      </q-list>
    </q-menu>
  </q-btn>
</template>
