<template>
  <div class="relative inline-block text-left">
    <!-- Dropdown Toggle Button -->
    <div class="flex items-center justify-center w-[21px] h-[21px] bg-blue-300 dark:bg-blue-300/50 rounded-full">
      <div @click="toggleDropdown" @mouseenter="tooltipShow" @mouseleave="tooltipHide"
        class=" cursor-pointer  text-sm font-medium  rounded-lg ">
        <img :src="currentFlag" alt="Current Language" class="w-[19px] h-[19px] focus:border-blue-700 rounded-full" />
        <!-- <span>{{ currentLocaleName }}</span> -->
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div v-if="isOpen"
      class="absolute right-0 z-50 p-1 w-auto mt-8 origin-top-right bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <ul class="space-y-1 p-2">
        <li v-for="locale in languageOptions" :key="locale.code"
          @click="locale.code !== currentLocale ? switchLocale(locale.code) : null" :class="[
            'flex items-center  text-sm',
            locale.code === currentLocale
              ? 'text-red-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700 rounded-xl cursor-pointer'
          ]" class="px-2 py-1 ">
          <img :src="locale.flag" alt="Language Flag"
            class="w-[19px] h-[19px] border border-cyan-400 rounded-full p-[1px]" />
          <span class="text-normal pl-2 pr-4">{{ locale.name }}</span>
        </li>
      </ul>
    </div>

    <!-- Tooltip to show the mode -->
    <div
      class="absolute left-1/2 transform -translate-x-1/2 mt-[35px] p-1 z-50 flex justify-self-center items-center bg-[#FAFAFA] shadow-md dark:shadow-md dark:shadow-slate-800 dark:bg-[#505252aa] text-xs rounded"
      v-show="tooltipVisible">
      <div class="flex justify-center items-center min-w-max w-auto px-1">
        <span class="text-[13px] rounded">
          {{ $t('language_change') }}
        </span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const tooltipVisible = ref(false);
const { startLoading, finishLoading } = useLoader()
import { computed } from 'vue';


// i18n setup
const { locales, locale, setLocale } = useI18n();
const currentLocale = ref(locale.value);
const isOpen = ref(false);

// Sample locales with flags
const languageOptions = [
  // { code: 'en', name: t('english'), flag: 'https://flagcdn.com/w320/gb.png' },
  // { code: 'km', name: t('khmer'), flag: 'https://flagcdn.com/w320/kh.png' },
  { code: 'en', name: t('english'), flag: '/flags/gb.svg' },
  { code: 'km', name: t('khmer'), flag: '/flags/kh.svg' },
];

const currentLocaleName = ref('');
const currentFlag = ref('');

// Initialize locale data
onMounted(() => {
  // Ensure this runs only on the client side
  if (process.client) {
    const savedLocale = localStorage.getItem('locale');
    const activeLocale = savedLocale || locale.value;

    const current = computed(() => languageOptions.value.find(l => l.code === currentLocale.value));
    const currentFlag = computed(() => current.value?.flag || '');
    const currentLocaleName = computed(() => current.value?.name || '');


    if (current) {
      currentLocale.value = current.code;
      currentLocaleName.value = current.name;
      currentFlag.value = current.flag;
      locale.value = activeLocale;
    }
  }
});

// Switch Locale Function
async function switchLocale(code) {
  const selected = languageOptions.find((lang) => lang.code === code);
  if (selected) {
    currentLocale.value = selected.code;
    currentLocaleName.value = selected.name;
    currentFlag.value = selected.flag;
    setLocale(code);
    // await setLocale(code);
     // Optional: reload page to ensure all translations are applied | once
     window.location.reload()

    // Save to localStorage on the client side
    if (process.client) {
      localStorage.setItem('locale', code);
    }

    isOpen.value = false;
  }
}
const switchLanguage = async (newLocale) => {
  startLoading('Changing language...')
  try {
    await setLocale(newLocale)
    // Optional: reload page to ensure all translations are applied
    window.location.reload()
  } finally {
    finishLoading()
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

function tooltipShow() {
  tooltipVisible.value = true
}

function tooltipHide() {
  tooltipVisible.value = false
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside);
});

// Cleanup on unmount
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* Additional Styles for Dropdown */
button:focus {
  outline: none;
}
</style>
