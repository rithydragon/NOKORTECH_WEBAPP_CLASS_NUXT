import { defineStore } from 'pinia';


export const useMenuStore = defineStore('menu', () => {
  const authStore = useAuthStore();
  const menuData = ref([]);
  
  // Load menu data from JSON
  const loadMenuData = async () => {
    try {
      const data = await import('~/assets/json/menu.data.json');
      menuData.value = data.menu;
    } catch (error) {
      console.log('Error loading menu data:', error);
    }
  };
  
  // Get filtered menu based on permissions
  const filteredMenu = computed(() => {
    if (!menuData.value.length) return [];
    
    return menuData.value.filter(item => {
      // Check if item should be shown globally or user has permission
      return item.showGlobal || 
             (item.permission && authStore.hasPermission(item.permission));
    });
  });
  
  return {
    menuData,
    filteredMenu,
    loadMenuData
  };
});