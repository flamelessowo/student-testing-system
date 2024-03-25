<script setup lang="ts">
import { ref, type Ref } from 'vue';
import type { User } from '../../core/interfaces/UserT'

const users: Ref<Array<User>> = ref([{username: 'flaser', email: 'gragonog@gmail.com', role: 'student', avatarUrl: 'https://i.pinimg.com/originals/a4/0d/de/a40dde06d1a46041226ecf4c4859f8bc.jpg'}, {username: 'flaser', email: 'gragonog@gmail.com', role: 'student', avatarUrl: 'https://i.pinimg.com/originals/a4/0d/de/a40dde06d1a46041226ecf4c4859f8bc.jpg'}])

const opened = ref(false);
function toggleDial() {
  opened.value = !opened.value;
}

defineExpose({
  opened,
  toggleDial
})
</script>
<template>
  <q-dialog v-model="opened">
    <q-card>
      <q-card-section>
        <div class="text-h6">Учасники даного курсу</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-item v-for="(user, i) in users" :key="user.email">
          <q-item-section avatar>
            <q-avatar>
              <img :src="user.avatarUrl" draggable="false">
            </q-avatar>
          </q-item-section>
          <q-item-section>{{ `${i+1}. ${user.username}`}}</q-item-section>
        </q-item>
        
      </q-card-section>

      <q-separator />
    </q-card>
  </q-dialog>
</template>
