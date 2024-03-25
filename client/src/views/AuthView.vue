<script setup lang="ts">
import { useUserStore } from '../stores/userstore'
import { useRouter, useRoute } from 'vue-router';
import { useNotifyService } from '@/core/service/message.service';

const userstore = useUserStore();
const router = useRouter();
const notify = useNotifyService();
const callback = async (response: any) => {
  try {
    await userstore.login(response.credential);
    notify.success(`Успішно ввійдено в аккаунт ${userstore.user.email}`);
    notify.info(`Переадресовано на головну сторінку`);
    router.push('/');
  } catch(err: any) {
    if (err.response.status === 401) {
      notify.error("Авторизуйтесь з корпоративної почти УжНУ");
      router.push('/auth')
    }

  }
}
</script>

<template>
  <div class="container">
    <GoogleLogin :buttonConfig="{shape: 'pill', width: '280px'}" prompt :callback="callback"/>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
a {
  text-decoration: none;
  color: inherit;
}

html {
  font-size: 62.5%;
}

body {
  font-family: Roboto, sans-serif;
  color: #ff0000;
  font-size: 1.6rem;
}

.container {
  background-color: #374769;
  height: 89.5vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-auth {
  max-width: 27rem;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.social-auth .title {
  font-size: 1.8rem;
  color: white;
  margin-bottom: 5px;
}

.google-auth {
  background-color: #fff;
  border-radius: 5px;
  padding: 0.6rem 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
}

.google-auth img {
  height: 4rem;
  margin-right: 1rem;
}
.google-auth span {
  font-size: 1.8rem;
}

.google-auth:hover {
  box-shadow: 0 1px 13px 0 rgb(0 0 0 / 15%);
}
</style>
