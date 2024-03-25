<script setup lang="ts">
import { onMounted, ref, shallowRef, type Ref }  from 'vue';
import { uid } from 'quasar'
import ButtonChoose from '@/components/editor/ButtonChoose.vue';

import QANode from '@/components/editor/QANode.vue';

type QAComponent = {
  component: typeof QANode,
  props: {
    type: string,
    uid: string
  }
}

import { useNotifyService } from '@/core/service/message.service';

const notifyService = useNotifyService();

const testContainer = ref();
const childTypes = ref([]);
const components: Ref<Array<QAComponent>> = shallowRef([]);

function handleAddQA(type: string) {
  const qacomponent = {component: QANode, props: { type, uid: uid() }};
  components.value = [...components.value, qacomponent];
}

function handleDeleteQA(uid: string) {
  components.value = components.value.filter((el: any) => el.props.uid !== uid);
}

function collectQA() {
  return childTypes.value.map((component: any) => {
    return component.collectSelf();
  })
}

defineExpose({
  collectQA
})

const emits = defineEmits(['loaded'])

onMounted(() => {
  emits('loaded');
})
</script>

<template>
  <div class="q-pa-md q-gutter-sm test-container">
    <div ref="testContainer" class="test-components">
      <template v-for="(component) in components" :key="index">
        <component ref='childTypes' :is="component.component" v-bind="component.props" @on-card-delete="handleDeleteQA"/>
      </template>
    </div>
    <ButtonChoose @type-choose="handleAddQA" class="bot-right"/>
  </div>
</template>

<style scoped>
.bot-right {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  margin-bottom: 2rem;
  margin-right: 1rem;
}

.test-components {
  padding: 10px;
  max-height: 70vh;
  overflow: auto;
}

.test-container {
  min-height: 85vh;
}

</style>
