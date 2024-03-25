<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';
import TestCard from '../components/view/TestCard.vue'
import MenuButton from '../components/global/MenuButton.vue'
import Modal from '../components/global/Modal.vue'
import MegaInputSelector from '../components/global/MegaInputSelector.vue'
import AddItem from '@/components/global/AddItem.vue';
import GradeTable from '../components/view/GradeTable.vue'
import { axiosProtected } from '@/core/service/http.service';
import { useRouter, useRoute } from 'vue-router';
import { useNotifyService } from '@/core/service/message.service';
import type { User } from '../core/interfaces/UserT'
import { useUserStore } from '@/stores/userstore';


const route = useRoute();
const router = useRouter();
const notify = useNotifyService();
const userstore = useUserStore();

const editCourseName = ref('');
const editCourseDescription = ref('');

const course = ref({ id: '', name: '', description: '', users: [] as Array<User>, tests: [] });
const tab = ref('tests');
const usersModal = ref();
const editModal = ref();

const addUser = ref(false);

function redirectToCreateTest() {
  router.push({ name: 'course-test-create', params: { courseId: course.value.id } })
}

function redirectToViewTest(testId: string) {
  router.push({ name: 'course-test-view', params: { courseId: course.value.id, testId: testId }})
}

function toggleEditModal() {
  editCourseName.value = course.value.name;
  editCourseDescription.value = course.value.description;
  editModal.value.opened = !editModal.value.opened;
}

function toggleUserModal() {
  usersModal.value.opened = !usersModal.value.opened;
}

async function getCourse() {
  const response = await axiosProtected.get(`/course/${route.params.courseId}`);
  course.value = response.data;
}

async function deleteCourse() {
  await axiosProtected.delete(`/course/${course.value.id}`);
  notify.success(`Успішно видалено курс ${course.value.name}`);
  router.push('/courses');
}

async function editCourse() {
  await axiosProtected.put(`/course/`, {
    id: route.params.courseId,
    name: editCourseName.value,
    description: editCourseDescription.value,
  })
  notify.success(`Успішно змінено курс ${course.value.name}`);
  editModal.value.opened = false;
  await getCourse();
}

async function addUsers(userEmails: Array<string>) {
  await axiosProtected.post(`/course/${course.value.id}/add-users`, userEmails);
  notify.success(`Успішно додано користувачів`);
  addUser.value = false;
  await getCourse();
}

async function deleteUser(userEmail: string) {
  if (userstore.user.email === userEmail) {
    notify.error('Немолживо видалити себе?');
    return;
  }
  await axiosProtected.delete(`/course/${course.value.id}/delete-users/${userEmail}`);
  notify.success(`Успішно вилучено користувача ${userEmail}`);
  await getCourse();
}

onMounted(async () => {
  await getCourse();
})

</script>
<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section class="bg-teal text-white">
        <div class="course-header">
          <div>
            <div class="text-h6">{{ course.name }}</div>
            <div class="text-subtitle2">{{ course.description }}</div>
          </div>
          <MenuButton v-if="userstore.hasRole" @edit-event="toggleEditModal" @delete-event="deleteCourse"/>
        </div>
        <q-avatar
          @click="toggleUserModal"
          v-for="(user, n) in course.users.slice(0, 5)"
          :key="n"
          size="40px"
          class="overlapping"
          :style="`left: ${n * 25}px;margin-bottom: 15px; margin-left: 15px`"
        >
          <img :src="user.image">
        </q-avatar>
        <div class="q-pa-md q-gutter-sm" style="height: 80px">
        </div>
      </q-card-section>
    </q-card>
    <div class="q-gutter-y-md">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-blue"
          active-color="secondary"
          indicator-color="secondary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="tests" label="Тести" />
          <q-tab name="grades" label="Оцінки" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel  name="tests">
            <div style="max-height: 55vh; overflow: auto;">
              <TestCard v-if="course.tests.length" :name="test.name" :description="test.description" v-for="test in course.tests" @click="redirectToViewTest(test.id)" :deadline="test.deadline"/>
              <span v-else>Тут поки немає тестів...</span>
            </div>
          </q-tab-panel>

          <q-tab-panel name="grades">
            <GradeTable :courseId="course.id"/>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
  <AddItem v-if="userstore.hasRole" @click="redirectToCreateTest" class="add-course"/>

  <Modal ref="usersModal">
    <q-card>
      <q-card-section>
        <div style="text-align: center;" class="text-h6">Учасники даного курсу</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-item v-for="(user, i) in course.users" :key="user.email">
          <q-item-section avatar>
            <q-avatar>
              <img :src="user.image" draggable="false">
            </q-avatar>
          </q-item-section>
          <div class="course-header">
            <q-item-section>{{ `${i+1}. ${user.givenName} ${user.familyName}`}}</q-item-section>
            <q-btn
              v-if="userstore.hasRole"
              @click="deleteUser(user.email)"
              title="Вилучити користувача"
              style="margin-left: 5px;"
              round
              dense
              color="red"
              size="xs"
              icon="person_remove"
            />
          </div>
        </q-item>
        <q-item v-if="userstore.hasRole">
          <q-btn @click="addUser = true" v-if="!addUser" style="margin-left: auto;margin-right: auto;" icon="add" round dense color="green"/>
          <MegaInputSelector @add-many="addUsers" :course-users="course.users" style="margin-left: auto;margin-right: auto;" v-if="addUser"/>
        </q-item>
      </q-card-section>

      <q-separator />

    </q-card>
  </Modal>
  <Modal ref="editModal">
    <q-card style="min-width: 300px;">
      <form @submit.prevent="editCourse">
        <q-card-section>
          <div class="text-h6" style="text-align: center;">Змінити курс</div>
        </q-card-section>

        <q-card-section>
          <div>
            <q-input filled required v-model="editCourseName" autofocus />
          </div>
          <div class="new-course-item">
            <q-input
              required
              v-model="editCourseDescription"
              filled
              autogrow
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn style="color: #FF0080" flat label="Скасувати" v-close-popup />
          <q-btn type="submit" style="color: #7FFFD4" flat label="Зберегти" />
        </q-card-actions>
      </form>
    </q-card>
  </Modal>
</template>
  <style lang="sass" scoped>
.overlapping
  border: 2px solid white
  position: absolute
  bottom: 0

.course-header
  display: flex
  flex-direction: row
  justify-content: space-between
  align-items: center

.new-course-item
  margin-top: 15px

.add-course
  position: absolute
  bottom: 0
  right: 0
  margin-bottom: 15px
  margin-right: 15px

</style>
