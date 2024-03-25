<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { axiosProtected } from '../../core/service/http.service';

const table = ref();

const columns = ref([
  { name: 'givenName', align: 'center', label: 'Студент', field: 'givenName', sortable: true },
])

const rows = ref([])

const props = defineProps({
  courseId: String
})

function tryFindStudent(student: string) {
  return rows.value.find(u => student === u.givenName);
}

function fillColumns() {
  const unique = [...new Set(table.value.map(el => el.testName))];
  unique.forEach(testName => {
    columns.value.push({ name: testName, align: 'center', label: testName, field: testName, sortable: true})
  })
}

function fillRows() {
  for (let row of table.value) {
    const student = tryFindStudent(row.givenName);
    if (student) {
      student[row.testName] = row.grade;
      return;
    }
    let userObj = {givenName: row.givenName};
    userObj[row.testName] = row.grade;
    rows.value.push(userObj);
  }
}

onMounted(async () => {
  const response = await axiosProtected.get(`/course/${props.courseId}/grades`);
  table.value = response.data;
  fillColumns();
  fillRows();

})
</script>
<template>
  <div class="q-pa-md">
    <q-table
      title="Оцінки"
      :rows="rows"
      :columns="columns"
      row-key="givenName"
    />
  </div>
</template>
