<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue'

type Checkbox = {
  label: string,
  value: string,
  color: string,
  isRight: boolean
}

const group = ref([]);
const options: Ref<Array<Checkbox>> = ref([

]);
const checkedOptions = ref([] as Array<String>);
const text = ref('');
const addQuestionClicked = ref(false);

function addOption() {
  options.value.push({label: text.value, value: text.value, isRight: false} as Checkbox);
  text.value = '';
  addQuestionClicked.value = false;
}

function collectEditorModel() {
  options.value.forEach((el: any) => {
    if (group.value.includes(el.value)) {
      el.isRight = true;
      if (props.runtimeMode) el.isChecked = true;
    } else {
      el.isRight = false;
    }
  })
  return {
    type: 'checkBox',
    options: options.value
  }
}

function setCheckedArray(arr: Array<String>) {
  checkedOptions.value = arr;
}

defineExpose({
  collectEditorModel,
  options,
})

const props = defineProps({
  readonly: Boolean,
  runtimeMode: Boolean,
  options: Array
})

onMounted(() => {
  if (props.options) {
    options.value = props.options as Checkbox[];
  }
  if (!props.runtimeMode) {
    options.value.forEach(o => {
      if (o.isRight) {
        group.value.push(o.value);
      }
    })
  }
})

</script>
<template>
  <q-btn v-if="!props.runtimeMode" class="input-question" color="secondary" label="Додати варіант відповіді" @click="addQuestionClicked = true" />
  <q-option-group
  @update:model-value="setCheckedArray"
  :options="options"
  type="checkbox"
  v-model="group"
  />
  <q-input @blur="addOption" v-if="addQuestionClicked" dense v-model="text" label="Введіть питання" @keyup.enter="addOption" />
</template>
