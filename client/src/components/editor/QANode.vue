<script setup lang="ts">
import { ref, shallowRef, onMounted, watch } from 'vue';
import { EmitEvents } from '@/core/service/constants'
import Input from '@/components/editor/Input.vue';
import RadioGroup from '@/components/editor/RadioGroup.vue';
import CheckBox from '@/components/editor/CheckBox.vue';
import { useNotifyService } from '@/core/service/message.service';

const props = defineProps({
  uid: String,
  type: String
});

const emits = defineEmits(['onCardDelete']);
const notify = useNotifyService();
const maxGrade = ref(1);

const title = ref('');
const subcomponent = shallowRef();
const qatypeComponent = ref();

onMounted(() => {
  switch(props.type) {
    case EmitEvents.ONE_ANSWER:
      subcomponent.value = RadioGroup;
      break;
    case EmitEvents.MANY_ANSWERS:
      subcomponent.value = CheckBox;
      break;
    case EmitEvents.ANY_ANSWER:
      subcomponent.value = Input;
  }
})

function onCardDelete() {
  emits('onCardDelete', props.uid);
}

function collectSelf() {
  return { ...qatypeComponent.value.collectEditorModel(), question: title.value, maxGrade: maxGrade.value };
}

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
          <q-input standout="bg-teal text-white" v-model="title" label="Запитання">
            <template v-if="title" v-slot:append>
              <q-icon name="cancel" @click.stop.prevent="title = ''" class="cursor-pointer" />
            </template>
          </q-input>
        </div>

        <div class="col-auto">
          <q-btn color="grey-7" round flat icon="more_vert">
            <q-menu cover auto-close>
              <q-list>
                <q-item clickable @click="onCardDelete">
                  <q-item-section>Видалити</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div>
        <component ref="qatypeComponent" :is="subcomponent"/>
        <q-input label="Оцінка" v-model="maxGrade" style="max-width: 220px; margin-top: 15px;" outlined type="number"/>
      </div>
    </q-card-section>
  </q-card>
</template>
<style scoped lang="sass">
.course-header
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center
</style>
