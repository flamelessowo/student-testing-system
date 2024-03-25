import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { decodeCredential, googleLogout } from 'vue3-google-login'
import { getUnauthorizedUser, type User } from '../core/interfaces/UserT'
import { writeKey, deleteKey } from '@/core/service/local.session.service'
import { axiosProtected } from '@/core/service/http.service'
import router from '@/router'

export const useUserStore = defineStore('userstore', () => {
  const user = ref({email: null, givenName: null, familyName: null, image: null, token: null, role: null} as User);
  const isAuthorized = computed(() => !!user.value.token);
  const hasRole = computed(() => (user.value.role === "Administrator" || user.value.role === "Professor"))

  function setUser(userObj: User) {
    user.value = userObj;
  }

  async function login(credential: string) {
    try {
      const response = await axiosProtected.post(`/account/google-auth/`, {}, {
        headers: {
          Authorization: `Bearer ${credential}`
        }
      })
      const userData = response.data;
      user.value = {...userData, token: credential} as User;
      writeKey("token", credential);
      axiosProtected.defaults.headers.common['Authorization'] = `Bearer ${credential}`;
    }
    catch(err: any) {
      if (err.response.data === "Invalid token") {
        deleteKey("token");
        router.push("/auth");
      }
        throw err
    }
  }

  function logout() {
    setUser(getUnauthorizedUser());
    deleteKey("token");
    googleLogout();
  }

  return {
    user, login, logout, isAuthorized, setUser, hasRole
  }
})
