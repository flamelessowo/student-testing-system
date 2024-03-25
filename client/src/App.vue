<script setup lang="ts">
import { onMounted, onBeforeMount, ref, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar'
import { useRuntimeConfig } from './stores/runtime.config'; 
import { useUserStore } from './stores/userstore';
import { useNotifyService } from '@/core/service/message.service';
import { writeKey, deleteKey, getStorageValue, getValue } from '@/core/service/local.session.service'

const router = useRouter();
const drawer = ref(false);
const $q = useQuasar();
const config = useRuntimeConfig();
const userstore = useUserStore();
const notify = useNotifyService();

function toggleRightDrawer(): void {
  drawer.value = !drawer.value;
}

function logout(): void {
  const email = userstore.user.email;
  userstore.logout();
  notify.success(`Успішно виконано вихід з аккаунту ${email}`);
  notify.info(`Переадресовано на головну сторінку`);
  router.push('/');
}

watch(() => config.darkTheme, () => {
  $q.dark.set(config.darkTheme);
  writeKey("theme", String(config.darkTheme));
})

onMounted(() => {
  nextTick(() => {
    config.darkTheme = getValue("theme") === "true";
    $q.dark.set(config.darkTheme);
  })
})

</script>

<template>
  <q-layout view="hHh lpR fff">

    <q-header elevated class="bg-secondary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar>
            <img src="/ico.png">
          </q-avatar>
          Система для тестувань студентів УжНУ
        </q-toolbar-title>

        <q-btn title="Змінити тему" dense flat round :icon="config.themeIcon" @click="config.toggleTheme"/>
        <q-btn v-if="userstore.isAuthorized" dense flat round icon="menu" @click="toggleRightDrawer" />
        <q-btn v-if="!userstore.isAuthorized" dense flat round icon="account_circle" @click="router.push({ name: 'auth' })"/>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/" label="Домашня сторінка" />
        <q-route-tab to="/courses" label="Курси" />
      </q-tabs>
    </q-header>

    <q-drawer
      title="Меню користувача"
      :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      v-if="userstore.isAuthorized"
      v-model="drawer"
      :width="285"
      :breakpoint="400"
      side="right"
      overlay
    >
      <q-scroll-area style="height: calc(100% - 150px); margin-top: 150px; border-right: 1px solid #ddd">
        <q-list padding>
          <q-item clickable v-ripple @click="router.push('/courses')">
            <q-item-section avatar>
              <q-icon name="quiz" />
            </q-item-section>

            <q-item-section>
              Курси
            </q-item-section>
          </q-item>
          <q-separator spaced />
          <q-item clickable v-ripple @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>
              Вийти
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png" style="height: 150px">
        <div class="absolute-bottom bg-transparent">
          <q-avatar size="56px" class="q-mb-sm">
            <img :src="userstore.user.image">
          </q-avatar>
          <div class="text-weight-bold">{{`${userstore.user.givenName} ${userstore.user.familyName}`}}</div>
          <div><span style="text-overflow: ellipsis" :title="userstore.user.email">{{ userstore.user.email }}</span></div>
        </div>
      </q-img>
    </q-drawer>

    <q-page-container>
      <RouterView />
    </q-page-container>

  </q-layout>
</template>

