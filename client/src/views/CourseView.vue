<script setup lang="ts">
import { ref } from 'vue';
import { onMounted } from 'vue';
import AddItem from '../components/global/AddItem.vue'
import Modal from '../components/global/Modal.vue'
import CourseCard from '../components/view/CourseCard.vue'
import { axiosProtected } from '@/core/service/http.service'
import { useNotifyService } from '@/core/service/message.service';
import { useUserStore } from '@/stores/userstore';

const modal = ref();
const courses = ref([]);
const userstore = useUserStore();
const newCourseName = ref('');
const newCourseDescription = ref('');

const notify = useNotifyService();


function toggleModal() {
  modal.value.opened = !modal.value.opened;
}

async function addCourse() {
  await axiosProtected.post('/course/', {
    name: newCourseName.value,
    description: newCourseDescription.value,
  });

  notify.success(`Ви успішно створили курс ${newCourseName.value}`);
  await getCoureses();
  modal.value.opened = false;
}

async function getCoureses() {
  const response = await axiosProtected.get('/course/');
  courses.value = response.data;
}

onMounted(async () => {
  await getCoureses();
})

</script>
<template>
  <div class="row wrap justify-start items-start content-start q-pa-md">
    <CourseCard style="margin-left: 15px;" v-for="course in courses" :name="course.name" :description="course.description" :id="course.id" :key="course.id"/>
  </div>

  <Modal ref="modal">
    <q-card style="min-width: 300px;">
      <form @submit.prevent="addCourse">
        <q-card-section>
          <div class="text-h6" style="text-align: center;">Створити курс</div>
        </q-card-section>

        <q-card-section>
          <div>
            <q-input filled required placeholder="Введіть назву курсу" v-model="newCourseName" autofocus />
          </div>
          <div class="new-course-item">
            <q-input
              required
              placeholder="Введіть опис курсу"
              v-model="newCourseDescription"
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

  <AddItem v-if="userstore.hasRole" class="add-course" @add-event="toggleModal"/>

</template>
<style scoped lang="css">
.new-course-item {
  margin-top: 15px;
}

.course-card {
  width: 250px;
  height: 200px;
}

.add-course {
  position: absolute;
  bottom: 0;
  right: 0;
  margin-bottom: 15px;
  margin-right: 15px;
}
</style>
