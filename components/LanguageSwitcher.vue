<template>
  <div class="relative inline-block text-left">
    <!-- Dropdown Toggle Button -->
    <div class="flex items-center justify-center w-[21px] h-[21px] bg-blue-300 dark:bg-blue-300/50 rounded-full">
      <div
        @click="toggleDropdown"
        @mouseenter="tooltipShow"
        @mouseleave="tooltipHide"
        class=" cursor-pointer  text-sm font-medium  rounded-lg "
      >
        <img
          :src="currentFlag"
          alt="Current Language"
          class="w-[19px] h-[19px] focus:border-blue-700 rounded-full"
        />
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute right-0 z-50 p-1 w-[130px] mt-3 origin-top-right bg-white rounded-lg shadow-lg dark:bg-gray-800"
    >
      <ul class="space-y-1">
        <li
          v-for="locale in languageOptions"
          :key="locale.code"
          @click="locale.code !== currentLocale ? switchLocale(locale.code) : null"
          :class="[
            'flex items-center  text-sm',
            locale.code === currentLocale
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 rounded-xl cursor-pointer'
          ]"
          class="px-2 py-1"
        >
          <img
            :src="locale.flag"
            alt="Language Flag"
            class="w-[19px] h-[19px] border border-cyan-400 rounded-full p-[1px]"
          />
          <span class="text-normal pl-2">{{ locale.name }}</span>
        </li>
      </ul>
    </div>

    <!-- Tooltip to show the mode -->
    <div class="absolute left-1/2 transform z-50 -translate-x-1/2 mt-[15px] p-1 flex justify-self-center items-center bg-[#FAFAFA] shadow-md dark:shadow-md dark:shadow-slate-800 dark:bg-[#505252aa] text-xs rounded"
      v-show="tooltipVisible"
    >
      <div class="flex justify-center items-center min-w-max w-auto px-1">
        <span class="text-xs rounded">
          {{ $t('language_change')  }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const tooltipVisible = ref(false)

// i18n setup
const { locales, locale, setLocale } = useI18n();
const currentLocale = ref(locale.value);
const isOpen = ref(false);

// Sample locales with flags
const languageOptions = [
  { code: 'en', name: t('english'), flag: 'https://flagcdn.com/w320/gb.png' },
  { code: 'km', name: t('khmer'), flag: 'https://flagcdn.com/w320/kh.png' },
];

const currentLocaleName = ref('');
const currentFlag = ref('');

// Initialize locale data
onMounted(() => {
  const savedLocale = localStorage.getItem('locale');
  const activeLocale = savedLocale || locale.value;

  const current = languageOptions.find((lang) => lang.code === activeLocale);
  if (current) {
    currentLocale.value = current.code;
    currentLocaleName.value = current.name;
    currentFlag.value = current.flag;
    locale.value = activeLocale;
  }
});

// Switch Locale Function
function switchLocale(code) {
  const selected = languageOptions.find((lang) => lang.code === code);
  if (selected) {
    currentLocale.value = selected.code;
    currentLocaleName.value = selected.name;
    currentFlag.value = selected.flag;
    setLocale(code);
    localStorage.setItem('locale', code);
    isOpen.value = false;
  }
}

// Toggle Dropdown Menu
function toggleDropdown() {
  isOpen.value = !isOpen.value;
}

// Close dropdown if clicked outside
function handleClickOutside(event) {
  if (!event.target.closest('.relative')) {
    isOpen.value = false;
  }
}

function tooltipShow(){
  tooltipVisible.value = true
}
function tooltipHide(){
  tooltipVisible.value = false
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Additional Styles for Dropdown */
button:focus {
  outline: none;
}
</style>
