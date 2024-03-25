<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
const router = useRouter();
const route = useRoute();
const props = defineProps({
  id: String,
  name: String,
  description: String,
})

function redirectToCourse() {
  router.push({ name: 'course', params: { courseId: props.id }});
}

</script>
<template>
  <q-card @click="redirectToCourse" flat bordered class="course-card">
    <div class="text-h5 q-mt-sm q-mb-xs q-pa-md">{{ props.name }}</div>
    <q-card-section>
      <div>
        {{ props.description }}
      </div>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.course-card {
  transition: background-color 0.3s;
}
.course-card:hover {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
