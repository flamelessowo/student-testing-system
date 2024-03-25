<script setup lang="ts">
import { EmitEvents } from '@/core/service/constants';

const emits = defineEmits(['typeChoose']);

</script>
<template>
  <q-btn-dropdown
    color="teal"
    rounded
    label="Додати запитання"
  >
    <q-list ref="list">
      <q-item clickable v-close-popup @click="emits('typeChoose', EmitEvents.ONE_ANSWER)">
        <q-item-section>
          <q-item-label>Одна відповідь</q-item-label>
        </q-item-section>
      </q-item>

      <q-item clickable v-close-popup @click="emits('typeChoose', EmitEvents.MANY_ANSWERS)">
        <q-item-section>
          <q-item-label>Багато відповідей</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>
<style scoped></style>
