<script setup lang="ts">
import { ref, onMounted } from 'vue'

const group = ref();
const options = ref([
])
const text = ref('');
const inputField = ref();
const addQuestionClicked = ref(false);
const rightAnswer = ref('');

function addOption() {
  options.value.push({ label: text.value, value: text.value} );
  text.value = '';
  addQuestionClicked.value = false;
}

function selectRightOption() {
  options.value.forEach(o => {
    if (o.isRight) {
      rightAnswer.value = o.value;
      group.value = o.value;
    }
  })
}

function handleInputQuestion() {
  addQuestionClicked.value = true;
}

function setRightAnswer(chosenValue: string) {
  rightAnswer.value = chosenValue;

}

function collectEditorModel() {
  for (let el of options.value) {
    el.isRight = false;
    if (el.value === group.value) {
      el.isRight = true;
      if (props.runtimeMode) el.isChecked = true;
    }
  }
  return {
    type: 'radioGroup',
    options: options.value,
  }
}

const props = defineProps({
  readonly: Boolean,
  runtimeMode: Boolean,
  options: Array
})

defineExpose({
  collectEditorModel,
  options,
  selectRightOption
})

onMounted(() => {
  if (props.options) {
    options.value = props.options as never[];
  }
  if (!props.runtimeMode) {
    selectRightOption();
  }
})

</script>
<template>
  <q-btn v-if="!props.runtimeMode" class="input-question" color="secondary" label="Додати варіант відповіді" @click="handleInputQuestion" />
  <q-option-group
  @update:model-value="setRightAnswer"
  :options="options"
  type="radio"
  v-model="group"
  />
  <q-input @blur="addOption" ref="inputField" v-if="addQuestionClicked" dense v-model="text" label="Введіть питання" @keyup.enter="addOption" />

</template>
<style scoped>
.input-question {
  margin-top: 10px;
}

</style>
