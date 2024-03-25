<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { axiosProtected } from '../../core/service/http.service'
import type { User } from '../../core/interfaces/UserT'
const selectedUsers = ref([])
const globalUsers = ref([] as Array<User>);

onMounted(async () => {
  const response = await axiosProtected.get('/account');
  const users = response.data.map(el => el.email); 
  const courseUsers = props.courseUsers.map(el => el.email); 
  globalUsers.value = users.filter(el => !courseUsers.includes(el));
})

const props = defineProps({
  courseUsers: Array<User>
})

function emitUsers() {
  selectedUsers.value.length && emits('addMany', selectedUsers.value);
}

const emits = defineEmits(['addMany'])
</script>
<template>
  <q-select
  @popup-hide="emitUsers"
  filled
  v-model="selectedUsers"
  multiple
  :options="globalUsers"
  label="Додати користувачів"
  style="width: 300px"
/>
</template>
