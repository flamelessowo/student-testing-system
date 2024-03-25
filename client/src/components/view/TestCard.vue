<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { date } from 'quasar'
const { addToDate } = date

const deadline = ref();

const props = defineProps({
  name: String,
  description: String,
  deadline: Date
})
onMounted(() => {
  if (props.deadline && !props.deadline.toString().startsWith("00")) {
    console.log(props.deadline);
    const d = addToDate(new Date(props.deadline), {hours: 3});
    deadline.value = "Дедлайн: " + d.toLocaleString("uk-UA");
  }
})
</script>
<template>
  <q-card class="my-card" flat bordered>
    <q-card-section horizontal>
      <q-card-section class="q-pt-xs">
        <div class="text-h5 q-mt-sm q-mb-xs">{{props.name}}</div>
      </q-card-section>
    </q-card-section>
    <q-separator />
    <q-card-actions>
        <span v-if="props.deadline">
          {{ deadline }}
        </span>
      <q-btn style="margin-left: 15px;" flat color="primary">
        Перейти
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
