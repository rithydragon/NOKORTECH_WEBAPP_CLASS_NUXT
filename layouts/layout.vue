<template>
  <div class="flex h-screen overflow-hidden transition-all duration-300 ease-in-out">
    <aside class="navbar-side bg-gradient-to-br h-screen flex flex-col justify-between relative"
      :class="{ 'w-64': isSidebarOpen, 'w-20': !isSidebarOpen }">
      <div class="space-y-4">
        <div class="flex items-center justify-center pt-[10px]">
          <div v-if="user" class="flex flex-col gap-3 justify-center items-center">
            <RTYAvatar :src="user?.ImagePath" :active="user?.IsActive"  :gender="user?.Gender" size="50"/>
            <div class="text-lg flex-1 justify-center items-center whitespace-nowrap" v-show="isSidebarOpen">
              <span>{{ tBy({en:user.NameEnglish,km:user.Name})}}</span>
              <span>@{{user.Username}}</span>
            </div>
          </div>
        </div>

        <!-- Toggle Button -->
        <div class="relative flex justify-end">
          <div @click="toggleSidebar" @mouseenter="showTooltip" @mouseleave="hideTooltip"
            class="p-2 rounded-md focus:outline-none"
            :class="isSidebarOpen ? 'absolute -top-[60px] right-0' : 'mr-[20px]flex flex-col justify-center items-center'">
            <div
              class="p-1 hover:bg-gray-400/50 font-bold hover:text-gray-100 rounded-full px-2 cursor-pointer flex justify-center items-center w-6 h-6 text-sm">
              <i :class="isSidebarOpen ? 'ri-menu-fold-line' : 'ri-menu-unfold-line'"></i>
            </div>
            <!-- Tooltip to show the mode -->
            <div v-show="tooltipVisible"
              class="absolute transform -translate-x-1/2  p-1 z-50 flex justify-self-center items-center ">
              <div class=" flex justify-start w-auto px-1 p-2 text-xs rounded ">
                <div v-if="isSidebarOpen" class="absolute flex justify-start text-xs left-[46px] -top-[20px] w-[120px]">
                  <span class="navbar-side p-1 px-2 shadow-md border rounded whitespace-nowrap">{{ $t('close_sidebar') }}</span>
                </div>
                <div v-else class=" absolute  flex justify-start text-xs left-[56px] top-[0px] w-[120px]">
                  <span class="navbar-side p-1 px-2 shadow-md  border border-opacity-20 rounded whitespace-nowrap">{{ $t('open_sidebar')
                    }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Menu Items -->
        <div class="px-4 flex flex-col justify-center left-0 text-left">
          <div class="p-4 flex justify-center items-center relative">
            <NuxtLink to="/" class="group">
              <span><i class="ri-graduation-cap-line"></i></span>
              <span v-show="isSidebarOpen"
                class="ml-4 transition-opacity duration-300 ease-in-out whitespace-nowrap">{{ t('teaching')}}</span>
              <span v-show="!isSidebarOpen"
                class="absolute left-16 whitespace-nowrap bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">Menu</span>
            </NuxtLink>
          </div>

          <AppSidebar>
            <AppMenu />
          </AppSidebar>

          <div v-for="item in menu" :key="item.name"
            class="group px-4 py-3 flex items-center rounded-md cursor-pointer relative">
            <NuxtLink :to="item.route"
              :class="{ 'border-l-[10px] rounded-l-md  border-red-400 -ml-9 pl-[26px] text-red-400 font-semibold': isActive(item.route), 'hover:text-gray-500 ': !isActive(item.route) }">
              <span class="w-2 h-4 bg-red-500"></span>
              <span><i :class="`${item.icon} text-xl`"></i></span>
              <span v-show="isSidebarOpen" class="ml-4 transition-opacity duration-300 ease-in-out whitespace-nowrap">{{
                item.name }}</span>
              <span v-show="!isSidebarOpen"
                class="absolute -left-3 top-10 whitespace-nowrap bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">{{
                item.name }}</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Footer (Profile Button) -->
      <div class="group flex items-center py-2 px-4 rounded-md cursor-pointer relative mt-6">
        <NuxtLink to="/">
          <img src="/NOKORTECH-LOGO.png" alt="Logo" class="w-10 h-10 rounded-full" />
        </NuxtLink>
        <span v-show="isSidebarOpen" class="ml-2 absolute left-16 whitespace-nowrap">NOKORTECH</span>
        <span
          class="absolute left-[72px] whitespace-nowrap bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 "
          v-show="!isSidebarOpen">NOKORTECH</span>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden">
      <RTHeader />
      <div class="min-h-full overflow-y-auto">
        
        <!-- :key="$route.fullPath" -->
        <div :key="$route.fullPath">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const route = useRoute();
const { t } = useI18n();
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const menuStore = useMenuStore();
const reloadKey = ref(0)

watch(() => route.path, () => {
  reloadKey.value++ // Force reload when route changes
})
const user = ref({});

// In your layout or app.vue
const key = ref(route.fullPath)

watch(() => route.fullPath, () => {
  key.value = route.fullPath
})

// Load menu when layout is created
onMounted(async () => {
  if (authStore.isAuthenticated()) {
    await menuStore.loadMenuData();
  }
});

onMounted(async () => {
  try {
    user.value = await authStore.getUserProfile()
  } catch (error) {
    console.log('Error loading user profile in component:', error)
  }
})

// Format date for display
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};


const menu = [
  { name: t('class'), route: '/teaching', icon: 'ri-registered-line' },
  { name: t('setup'), route: '/setup', icon: 'ri-user-3-line' },
  { name: t('user'), route: '/users/userManagement', icon: 'ri-settings-6-line' },
];

const isSidebarOpen = ref(true);
const tooltipVisible = ref(false);

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem('sidebarState', JSON.stringify(isSidebarOpen.value));
}

const showTooltip = () => {
  tooltipVisible.value = true;
};

const hideTooltip = () => {
  tooltipVisible.value = false;
};

const isActive = (routePath) => {
  return route.path === routePath;
};

onMounted(() => {
  const storedSidebarState = localStorage.getItem('sidebarState');
  if (storedSidebarState !== null) {
    isSidebarOpen.value = JSON.parse(storedSidebarState);
  }
});
</script>

<style scoped>
.navbar-side {
  transition: width 0.3s, background-color 0.3s;
}

.group:hover .group-hover\:opacity-100 {
  opacity: 1;
}

.flex-1 {
  display: flex;
  flex-direction: column;
}

h-full {
  height: 100%;
}

.overflow-y-auto {
  overflow-y: auto;
  padding-top: 10px;
  /* To avoid the content hiding under the navbar */
}
</style>
