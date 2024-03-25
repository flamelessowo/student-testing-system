import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { writeKey, getStorageValue } from '@/core/service/local.session.service';

export const useRuntimeConfig = defineStore('runtimeConfig', () => {
  const darkTheme = ref(false);
  const themeIcon = computed(() => darkTheme.value ? 'light_mode' : 'dark_mode');
  function toggleTheme(): void {
    darkTheme.value = !darkTheme.value;
    writeKey("theme", String(darkTheme.value));
  }
  return { darkTheme, toggleTheme, themeIcon }
})
