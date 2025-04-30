<template>
  <div v-if="user" class="relative" ref="dropdown">
    <div @click="toggleDropdown" @mouseenter="showTooltip" @mouseleave="hideTooltip"
      class=" transition-all duration-200 flex items-center justify-center cursor-pointer space-x-2 px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200">
      <div class="flex items-center justify-center rounded-full">
        <RTYAvatar :src="user?.ImagePath" :gender="user?.Gender" :active="user?.IsActive" size="25"/>
      </div>
      <span class="text-[15px] text-gray-700 truncate max-w-[100px] whitespace-nowrap text-ellipsis overflow-hidden">{{ tBy({ en: user.NameEnglish, km: user.Name }) }}</span>
    </div>

    <!-- Tooltip to show the profile -->
    <div
      class="absolute w-auto right-0 border transform -translate-x-1/2 mt-[29px] p-1 z-50 flex justify-self-center items-center rty-card-light-bg-color dark:rty-card-dark-bg-color shadow-lg shadow-cyan-200 text-xs rounded"
      v-show="tooltipVisible">
      <div class="flex w-full items-center space-x-2">
        <div class="flex items-center justify-center rounded-full">
          <RTYAvatar :src="user?.ImagePath" :gender="user?.Gender" :active="user?.IsActive"/>
        </div>
        <div>
          <p class="font-bold ">{{ tBy({ en: user.NameEnglish, km: user.Name }) }}</p>
          <p class="text-[13px]">{{ user.Email }}</p>
        </div>
      </div>
    </div>

    <!-- Dropdown Menu -->
    <div v-if="dropdownOpen"
      class="dropdown-content absolute max-w-[250px] right-0 mt-5 p-[15px] w-[326px] shadow-lg rounded-lg z-10 border border-gray-400 border-dashed">
      <div class="">
        <div class="login-tooltip flex justify-end pt-2">
          <div>
            <button @click="loginAction" @mouseenter="showLoginTooltip" @mouseleave="hideLoginTooltip" class="relative">
              <div class="cursor-pointer">
                <i class="ri-login-box-line "></i>
              </div>
            </button>
            <div
              class="absolute flex justify-center items-center right-6 top-[12px] bg-blue-300 rounded-sm w-auto px-1">
              <span v-show="tooltipLoginVisible" class="text-[11px] text-white font-bold py-[2px]">
                {{ $t("login") }}
              </span>
            </div>
          </div>
        </div>

        <div class="profile px flex justify-center items-center mt-[100px]">
          <div class="absolute top-2">
            <div class="flex flex-col justify-center items-center space-y-2 pb-5">
              <div
                class="relative flex items-center justify-center">
                <RTYAvatar :src="user?.ImagePath"  :gender="user.Gender" size="80"/>
                <div
                  class="absolute flex justify-center items-center border rounded-full bg-white text-blue-500 cursor-pointer p-1 -right-[3px] top-[50px] z-50 h-7 w-7">
                  <i class="ri-camera-2-line text-[18px]"></i>
                </div>
              </div>
              <div class="flex flex-col items-center justify-center">
                <p class="font-bold">{{ tBy({ en: user.NameEnglish, km: user.Name }) }}</p>
                <p class="text-sm">{{ user.Email }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="item-component px-1 py-2">
          <div>
            <div v-for="item in menuItems" :key="item.name" class="mb-2">
              <NuxtLink :to="item.link" class="flex items-center py-[1px] gap-2 hover:bg-gray-100 rounded-md">
                <i :class="item.icon" class=""></i>
                <span>{{ item.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </div>

        <div class="footer-card my-3 items-center">
          <div class="flex justify-between items-center">
            <div @click="logoutAction"
              class="flex justify-center items-center gap-1 text-center text-red-600 font-medium cursor-pointer">
              <i class="ri-logout-circle-r-line"></i> {{ $t("logout") }}
            </div>
            <div @click="registerAction" :disabled="btnRegisterDisabled"  
              class="flex justify-center items-center gap-1 text-center text-red-600 font-medium cursor-pointer">
              <i class="ri-login-circle-line"></i> {{ $t("register") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "~/stores/auth"; // Use Pinia for better state management
import { storeToRefs } from "pinia";

const authStore = useAuthStore();
const router = useRouter();
const dropdownOpen = ref(false);
const tooltipVisible = ref(false);
const tooltipLoginVisible = ref(false);
const btnRegisterDisabled = ref(false);
// const user = computed(() => authStore.getUser);

const user = ref(null);


onMounted(async () => {
  try {
    user.value = await authStore.getUserProfile()
  } catch (error) {
    console.log('Error loading user profile in component:', error)
  }
})
// Logout Action
const logoutAction = async () => {
  await authStore.logout();
  user.value = null;
  router.push("/auths/login");
};

const btnLoginDisabled = ref(false)

const loginAction =  () => {
  if(!authStore.isAuthenticated()) {
    authStore.logout()
  } else if(authStore.isAuthenticated() && authStore.getUserProfile()) {
    btnLoginDisabled.value = true;
  } else {
    router.push("/auths/login");
  }
  return false;
};

// Register Action
const wregisterAction = () => {
    router.push("/users/profile");
};

// Register Action
const registerAction = () => {
  if(!authStore.isAuthenticated()) {
    router.push("/auths/signup");
  } else if(authStore.isAuthenticated() && authStore.getUserProfile()) {
    btnRegisterDisabled.value = true;
  } else {
    router.push("/users/profile");
  }
  return false;
};


const hideTooltip = () => {
  tooltipVisible.value = false;
};

// Menu Items
const menuItems = [
  { name: "Notifications", link: "#", icon: "ri-notification-line" },
  { name: "Settings", link: "#", icon: "ri-settings-3-line" },
  { name: "Profile", link: "/users/profile", icon: "ri-user-2-line" },
  // { name: "Documentation", link: "#", icon: "ri-book-line" },
  { name: "Help Center", link: "#", icon: "ri-question-line" },
];


// Theme state
const theme = ref("system");

// Dropdown toggle function
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
  if (dropdownOpen.value) {
    document.addEventListener("click", handleClickOutside);
  } else {
    document.removeEventListener("click", handleClickOutside);
  }
};

// Close dropdown when clicking outside
const dropdown = ref(null);
const handleClickOutside = (event) => {
  if (!dropdown.value.contains(event.target)) {
    dropdownOpen.value = false;
    document.removeEventListener("click", handleClickOutside);
  }
};

// Tooltip profile
// Show tooltip and Handle hover state to show toggle the moon or darkmode icon
const showTooltip = () => {
  tooltipVisible.value = true;
};

// Tooltip login
// Show tooltip and Handle hover state to show toggle the moon or darkmode icon
const showLoginTooltip = () => {
  tooltipLoginVisible.value = true;
};

// Show tooltip to  and Handle hover state to show toggle the sun or lightmode icon
const hideLoginTooltip = () => {
  tooltipLoginVisible.value = false;
};
</script>

<style lang="scss" scoped>
/* Light mode styles */
.light-bg {
  background-color: white;
  color: black;
}

/* Dark mode styles */
.dark-bg {
  background-color: #1a202c;
  color: white;
}

/* Shared styles */
.shadow-lg {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.px {
  padding: 6px 14px;
}
.dropdown-content{
  background-color: var(--nokor-w-b-5);
}
</style>