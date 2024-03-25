<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import { useNotifyService } from '@/core/service/message.service';
import Editor from '@/components/Editor.vue';
import Input from '@/components/editor/Input.vue';
import type { EditorT, QuestionT } from '@/core/interfaces/EditorT';
import { axiosProtected } from '@/core/service/http.service';

const notify = useNotifyService();
const router = useRouter();
const route = useRoute();

const tab = ref('info');
const splitterModel = ref(15)
const testName = ref('');
const inputRef = ref();
const editorLoaded = ref(false);
const editorRef = ref();
const editor: Ref<EditorT> = ref({
  name: '',
  description: '',
  questions: [] as Array<QuestionT>
});

async function save() {
  if (!editorLoaded.value) {
    notify.warning('Створіть запитання щоби зберегти!');
    return;
  }
  const questions: Array<QuestionT> = editorRef.value.collectQA();
  editor.value.name = testName.value;
  editor.value.description = inputRef.value.answer;
  editor.value.questions = questions;
  console.log(editor.value);
  await axiosProtected.post(`test/${route.params.courseId}/add-test`, editor.value);
  notify.success(`Ви успішно створили тест ${testName.value}`);
  router.push({ name: 'course', params: { courseId: route.params.courseId }})
}
</script>
<template>
  <div>
    <q-splitter
      v-model="splitterModel"
      style="height: 89vh"
    >
      <template v-slot:before>
        <q-tabs
          v-model="tab"
          vertical
          class="text-teal"
        >
          <q-tab name="info" icon="feed" label="Інформація" />
          <q-tab name="edit" icon="history_edu" label="Питання" />
          <q-tab name="save" icon="pending_actions" label="Управління" />
        </q-tabs>
      </template>

      <template v-slot:after>
        <q-tab-panels
          keep-alive
          v-model="tab"
          animated
          vertical
          transition-prev="jump-up"
          transition-next="jump-up"
        >
          <q-tab-panel name="info">
            <q-card class="my-card">
              <q-card-section>
                <q-input v-model="testName" label="Назва тесту" />
              </q-card-section>

              <q-card-section>
                <Input :readonly="false" ref="inputRef"/>
              </q-card-section>
            </q-card>
          </q-tab-panel>

          <q-tab-panel name="edit">
            <Editor @loaded="editorLoaded = true" ref="editorRef"/>
          </q-tab-panel>

          <q-tab-panel name="save">
            <q-btn color="secondary" label="Зберегти тест" @click="save" />
          </q-tab-panel>
        </q-tab-panels>
      </template>

    </q-splitter>
  </div>
</template>
<style></style>
