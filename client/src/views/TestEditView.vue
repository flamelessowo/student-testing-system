<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { axiosProtected } from '../core/service/http.service';
import { useRouter, useRoute } from 'vue-router'
import Input from '../components/editor/Input.vue'
import RuntimeQA from '../components/runtime/RuntimeQA.vue'

const testEdit = ref({});
const router = useRouter();
const route = useRoute();
const testDescription = ref();
const runtimeQA = ref();
const testRuntime = ref();

async function editSave() {
  const qa = collectQA();
  const editedTest = {id: testEdit.value.id, name: testEdit.value.name, description: testDescription.value.answer, questions: qa};
  console.log(editedTest);
  await axiosProtected.put('test/update-test', editedTest);
  console.log(1);
}

function collectQA() {
  return runtimeQA.value.map((component: any) => {
    return component.collectSelf();
  })
}

async function getTest() {
  const response = await axiosProtected.get(`/test/original-test/${route.params.testId}`);
  testEdit.value = response.data;
}

onMounted(async () => {
  await getTest();
  console.log(testEdit.value);
  testDescription.value.readonly = true;
  testDescription.value.answer = testEdit.value.description;
  testRuntime.value = testEdit.value.questions;
})

</script>
<template>
  <q-card class="my-card">
    <q-card-section>
      <q-input v-model="testEdit.name" label="Назва тесту" />
    </q-card-section>
    <q-card-section>
      <Input ref="testDescription"/>
    </q-card-section>
  </q-card>
  <div ref="testRunContainer" class="test-container q-pa-md q-gutter-sm">
    <RuntimeQA :qreadonly="false" :runtime-mode="false" ref="runtimeQA" v-for="qa in testRuntime" :id="qa.id" :question="qa.question" :type="qa.type" :options="qa.options" :max-grade="qa.maxGrade"/>
    <div style="display: flex; justify-content: center; align-items: center;">
      <q-btn @click="editSave" style="margin-top: 30px;" color="primary" label="Зберегти"/>
    </div>
  </div>
</template>
