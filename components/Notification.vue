<template>
  <div class="relative">
    <!-- Bell Icon with Badge -->
    <div class="relative">
      <div
        @click="toggleDropdown"
        @mouseenter="showTooltip"
        @mouseleave="hideTooltip"
        ref="icon"
        class="relative flex items-center justify-center w-7 h-7 bg-gray-100 cursor-point rounded-full hover:bg-gray-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 text-gray-600">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405C18.523 15.234 18 14.62 18 14V11c0-3.866-3.134-7-7-7S4 7.134 4 11v3c0 .62-.523 1.234-1.595 1.595L1 17h5m4 0v1a3 3 0 006 0v-1m-6 0h6"/>
        </svg>
        <span 
          v-if="unreadCount > 0" 
          class="absolute -top-2 -right-1 w-3 h-3 p-2 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
        >
          {{ unreadCount }}
        </span>
      </div>
      <!-- Tooltip for dark/light mode -->
      <span 
        class="absolute left-1/2 transform -translate-x-1/2 mt-[4px] flex justify-center items-center p-1 bg-[#ade9f1aa] dark:bg-[#505252aa] w-[100px] text-xs rounded shadow-sm"
        v-show="tooltipVisible"
      >
        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </span>
    </div>

    <!-- Dropdown -->
    <div v-if="isOpen" ref="dropdown" class="absolute right-0 mt-2 w-80 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div class="px-4 pt-4 border-b border-gray-200 flex flex-col justify-between items-center">
        <span class="font-semibold text-gray-700 text-2xl mb-3">{{ $t('notification') }}</span>
        <div class="space-x-3 text-sm">
          <!-- <button @click="markAllAsRead" class="text-blue-500 hover:underline">Mark All as Read</button>
          <button @click="clearNotifications" class="text-red-500 hover:underline">Clear All</button> -->
          <div class="space-x-3 flex text-sm">
            <div @click="toggleShowUnread" class="text-blue-500 hover:underline cursor-pointer">
              {{ showUnreadOnly ? $t('show_all') : $t('show_unread_only') }}
            </div>
            <div @click="markAllAsRead" class="text-blue-500 hover:underline cursor-pointer">{{ $t('readall') }}</div>
            <div @click="markAllAsRead" class="text-blue-500 hover:underline cursor-pointer">{{ $t('readall') }}</div>
            <!-- <div @click="clearNotifications" class="text-red-500 hover:underline cursor-pointer">{{ $t('clearall') }}</div> -->
          </div>
        </div>
        <!-- Search Input -->
        <div class="p-2 w-full">
          <input
            type="text"
            v-model="searchQuery"
            class="w-full h-2 p-3 bg-transparent border-2 border-gray-200 rounded-md"
            :placeholder="$t('search') + ' ' + $t('notification')"
          />
        </div>
      </div>
      
      <div class="p-2 rounded-lg">
        <ul class="notification-list max-h-[700px] overflow-y-auto rounded-lg">
          <li v-for="notification in filteredNotifications" :key="index" class="p-4 hover:bg-blue-50 cursor-pointer rounded-lg">
            <h3 class="font-semibold text-gray-800 text-xl">{{ notification.Notification_Title }} - <p class="text-[10px]">{{ notification.Notification_Type }}</p></h3>
            <p></p>
            <p class="text-normal text-gray-600">{{ notification.Notification_Body }}</p>
            <div class="flex gap-1 items-center py-1">
              <img :src="notification.User_Image_Path || '/images/profile.png'" :alt="notification.User_Name" class="h-4 w-4 rounded-full">
              <span class="text-gray-400 text-[10px]">{{ notification.User_Name }}</span>
            </div>
            <span class="text-xxs text-gray-400">{{ formatTime(notification.Notification_Time) }}</span>
            <span v-if="!notification.Read_Status" class="ml-2 text-xxs text-blue-500 font-semibold">{{ $t('unread') }}</span>
          </li>
        </ul>
      </div>
      <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
        No notifications
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
const { $axios } = useNuxtApp();

// Reactive state variables
const isOpen = ref(false);
const notifications = ref([]);
const tooltipVisible = ref(false)
// Refs for DOM elements
const dropdown = ref(null);
const icon = ref(null);

// // Computed properties
// const unreadCount = computed(() => {
//   return notifications.value.filter((n) => !n.read_status).length;
// });
// Computed property to calculate the unread count
const unreadCount = computed(() => {
  return notifications.value.filter(notification => notification.Read_Status !== 1).length;
});

// Methods
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  isOpen.value = false;
};

const formatTime = (time) => {
  const date = new Date(time);
  return date.toLocaleString();
};

const showTooltip = () => {
  tooltipVisible.value = true;
};

const hideTooltip = () => {
  tooltipVisible.value = false;
};

const fetchNotifications = async () => {
  try {
    const response = await useHttp('/api/notifications');
    notifications.value = response.data;
  } catch (error) {
    console.log('Error fetching notifications:', error);
  }
};


const markAllAsRead = async () => {
  try {
    await $axios.put('/api/notifications/read-all');
    notifications.value = notifications.value.map((n) => ({ ...n, read_status: true }));
  } catch (error) {
    console.log('Error marking all as read:', error);
  }
};
// Mark all notifications as read
// const markAllAsRead = async () => {
//   try {
//     const response = await $axios.put('/api/notifications/read-all');
//     console.log(response.data);  // Check the response from the API
//     if (response.status === 200) {
//       notifications.value = notifications.value.map((n) => ({
//         ...n,
//         read_status: true
//       }));
//     }
//   } catch (error) {
//     console.log('Error marking all as read:', error.message);
//   }
// };


const clearNotifications = async () => {
  try {
    await $axios.delete('/api/notifications/clear');
    notifications.value = [];
  } catch (error) {
    console.log('Error clearing notifications:', error);
  }
};

// State variable for toggle behavior
const showUnreadOnly = ref(true);
// Reactive state variables
const searchQuery = ref(''); // New reactive variable for search input

// Computed property for filtered notifications
// const filteredNotifications = computed(() => {
//   return notifications.value.filter((n) => {
//     const matchesUnread = showUnreadOnly.value ? !n.read_status : true;
//     const matchesSearch =
//       n.Notification_Title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       n.Notification_Body.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
//       n.User_Name.toLowerCase().includes(searchQuery.value.toLowerCase());
//     return matchesUnread && matchesSearch;
//   });
// });
// Computed property to filter notifications based on the "Read_Status" and search query
const filteredNotifications = computed(() => {
  return notifications.value.filter((n) => {
    // Check if the notification is unread or if we're showing all notifications
    const isUnread = showUnreadOnly.value ? n.Read_Status !== 1 : true;

    // Check if the notification matches the search query
    const matchesSearch =
      n.Notification_Title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      n.Notification_Body.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      n.User_Name.toLowerCase().includes(searchQuery.value.toLowerCase());

    return isUnread && matchesSearch;
  });
});

// Method to toggle between showing unread only or all
const toggleShowUnread = () => {
  showUnreadOnly.value = !showUnreadOnly.value;
};

const handleClickOutside = (event) => {
  if (
    dropdown.value && !dropdown.value.contains(event.target) &&
    icon.value && !icon.value.contains(event.target)
  ) {
    closeDropdown();
  }
};

// Lifecycle hooks
onMounted(() => {
  fetchNotifications();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>


<style scoped lang="scss">

</style>