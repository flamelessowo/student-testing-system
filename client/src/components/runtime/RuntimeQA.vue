<script setup lang="ts">
import { shallowRef, ref, onMounted, watch } from 'vue';
import Input from '../../components/editor/Input.vue';
import RadioGroup from '../../components/editor/RadioGroup.vue';
import CheckBox from '../../components/editor/CheckBox.vue';

const question = ref('');
const maxGrade = ref(1);

const props = defineProps({
  id: String,
  question: String,
  type: String,
  options: Array,
  runtimeMode: Boolean,
  qreadonly: Boolean,
  maxGrade: String
})

const subcomponent = ref();
const qaRuntimeComponent = ref();

function collectSelf() {
  return { ...qaRuntimeComponent.value.collectEditorModel(), question: question.value, id: props.id, maxGrade: maxGrade.value };
}

onMounted(() => {
  switch(props.type) {
    case "radioGroup":
      subcomponent.value = RadioGroup;
      break;
    case "checkBox":
      subcomponent.value = CheckBox;
      break;
    case "input":
      subcomponent.value = Input;
  }
  question.value = props.question;
  maxGrade.value = props.maxGrade;
})

defineExpose({
  collectSelf
})

watch(maxGrade, () => {
  if (maxGrade.value <= 0) {
    maxGrade.value = 1;
  }
})

</script>
<template>
  <q-card flat bordered class="my-card" style="margin-bottom: 10px;">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <q-input :readonly="props.qreadonly" standout="bg-teal text-white" v-model="question" label="Запитання"></q-input>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div>
        <component :runtime-mode="props.runtimeMode" :options="props.options" ref="qaRuntimeComponent" :is="subcomponent"/>
        <q-input v-if="!props.qreadonly" label="Оцінка" v-model="maxGrade" style="max-width: 220px; margin-top: 15px;" outlined type="number"/>
      </div>
    </q-card-section>
  </q-card>
</template>
