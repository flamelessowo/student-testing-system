<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { date } from 'quasar'
const { addToDate } = date
import { useRouter, useRoute } from 'vue-router';
import { useNotifyService } from '@/core/service/message.service';
import Input from '../components/editor/Input.vue'
import { axiosProtected } from '@/core/service/http.service';
import RuntimeQA from '../components/runtime/RuntimeQA.vue';
import { useUserStore } from '@/stores/userstore';
const route = useRoute();
const router = useRouter();
const notify = useNotifyService();
const userstore = useUserStore();

const test = ref("description");
const runtimeQA = ref();
const testDescription = ref();
const testWrite = ref({});
const testRuntime = ref([]);
const testStart = ref(false);
const testEndDate = ref(addToDate(new Date(), { hours: 2 }).toLocaleString('en-US', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}));

function collectQA() {
  return runtimeQA.value.map((component: any) => {
    return component.collectSelf();
  })
}

async function saveAnswer() {
  const qa = collectQA();
  const completedTest = {id: testWrite.value.id, name: testWrite.value.name, description: testDescription.value.answer, questions: qa};
  const response = await axiosProtected.post("/test", completedTest);
  notify.success(`Ви пройшли тест ${testWrite.value.name}. Оцінка: ${response.data}`);
  router.push({name: `course`, params: {courseId: route.params.courseId}})
}

async function setDeadline() {
  const response = await axiosProtected.get(`/test/original-test/${route.params.testId}`);
  const originalTest = response.data;
  originalTest.deadline = new Date(testEndDate.value);
  console.log(originalTest)
  await axiosProtected.put(`/test/update-test/`, originalTest);
  notify.success(`Успішно встановлено дедлайн на ${testEndDate.value}`)
}

async function getTest() {
  const response = await axiosProtected.get(`/test/${route.params.testId}`);
  testWrite.value = response.data;
  testRuntime.value = testWrite.value.questions;
}

async function deleteTest() {
  await axiosProtected.delete(`/test/${route.params.courseId}/delete-test/${route.params.testId}`);
  notify.success(`Тест успішно видалений`);
  router.push( {name: 'course', params: { courseId: route.params.courseId } });
}

function redirectToEditTest() {
  router.push({name: 'course-test-edit', params: { courseId: route.params.courseId, testId: route.params.testId }})
}

function toggleTestStart() {
  testStart.value = true;
}

onMounted(async () => {
  await getTest();
  testDescription.value.readonly = true;
  testDescription.value.answer = testWrite.value.description;
})

</script>
<template>
  <q-tabs
    v-model="test"
    class="bg-teal text-white shadow-2"
  >
    <q-tab title="Опис тесту" name="description" icon="description"></q-tab>
    <q-tab title="Тест" name="test" icon="quiz"></q-tab>
    <q-tab v-if="userstore.hasRole" title="Налаштування" name="settings" icon="settings"></q-tab>
  </q-tabs>
  <q-tab-panels keep-alive v-model="test" animated>

    <q-tab-panel name="description" class="q-pa-none">
      <q-card class="my-card">
        <q-card-section>
          <q-input readonly v-model="testWrite.name" label="Назва тесту" />
        </q-card-section>
        <q-card-section>
          <Input readonly style="height: 50vh;" ref="testDescription"/>
        </q-card-section>
      </q-card>
    </q-tab-panel>

    <q-tab-panel  name="test" class="q-pa-none">
      <div style="display: flex;justify-content: center;align-items: center;">
        <q-btn style="margin-top: 30px;" v-if="!testStart" @click="toggleTestStart" color="secondary" label="Почати тест"/>
      </div>
      <div v-if="testRuntime.length" ref="testRunContainer" class="test-container q-pa-md q-gutter-sm">
        <div v-if="testStart">
          <RuntimeQA qreadonly runtime-mode ref="runtimeQA" v-for="qa in testRuntime" :id="qa.id" :question="qa.question" :type="qa.type" :options="qa.options" />
          <div style="display: flex; justify-content: center; align-items: center;">
            <q-btn @click="saveAnswer" style="margin-top: 30px;" color="primary" label="Закінчити тест"/>
          </div>
        </div>
      </div>
    </q-tab-panel>
    <q-tab-panel v-if="userstore.hasRole" name="settings" class="q-pa-none">
      <div style="display: flex; gap: 25px; flex-direction: column; justify-content: center; align-items: center;">
        <div style="display: flex; margin-top: 15px;">
          <q-date v-model="testEndDate" mask="MM/DD/YYYY, HH:mm" color="secondary"/>
          <q-time @update:model-value="setDeadline" format24h v-model="testEndDate" mask="MM/DD/YYYY, HH:mm" color="secondary"/>
        </div>
        <div>
          <q-btn @click="deleteTest" color="red" label="Видалити тест"/>
          <q-btn @click="redirectToEditTest" color="orange" label="Змінити тест"/>
        </div>
      </div>
    </q-tab-panel>
  </q-tab-panels>
</template>
<style scoped>
.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
}
</style>
