// stores/menu.js
import { defineStore } from 'pinia';

export const useMenuStore = defineStore('menu', () => {
  const authStore = useAuthStore();
  const menuData = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Load menu data from local JSON
  const loadMenuData = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      // Import the menu data JSON file
      const data = await import('~/assets/menu_data.json');
      
      // If the data has a menu property, use that, otherwise use the whole object
      menuData.value = data.menu || data;
      
      return menuData.value;
    } catch (err) {
      console.log('Error loading menu data:', err);
      error.value = 'Failed to load menu data';
      throw err;
    } finally {
      loading.value = false;
    }
  };
  
  // Fetch menu from API with permissions filtering
  const fetchMenuFromAPI = async () => {
    try {
      loading.value = true;
      error.value = null;
      
      const { data, error } = await useHttp('/api/menu_data', {
        method: 'POST',
      });
      
      if (error.value) {
        throw error.value;
      }
      
      menuData.value = data.value?.menu || [];
      return menuData.value;
    } catch (err) {
      console.log('Error fetching menu from API:', err);
      error.value = 'Failed to fetch menu from server';
      
      // Fallback to local JSON
      console.log('Falling back to local menu data');
      return await loadMenuData();
    } finally {
      loading.value = false;
    }
  };
  
  // Get filtered menu based on permissions
  const filteredMenu = computed(() => {
    if (!menuData.value.length) return [];
    
    return menuData.value.filter(item => {
      // Check if item should be shown globally or user has permission
      const hasAccess = item.showGlobal || 
                       (item.permission && authStore.hasPermission(item.permission));
      
      // Filter children if they exist
      if (item.children) {
        item.children = item.children.filter(child => 
          child.showGlobal || 
          (child.permission && authStore.hasPermission(child.permission))
        );
        return hasAccess && item.children.length > 0;
      }
      
      return hasAccess;
    });
  });
  
  // Find menu item by path
  const findMenuItemByPath = (path) => {
    return menuData.value.find(item => {
      if (item.href && path.startsWith(item.href)) return true;
      if (item.children) {
        return item.children.some(child => 
          child.href && path.startsWith(child.href)
        );
      }
      return false;
    });
  };
  
  // Get breadcrumbs for current route
  const getBreadcrumbs = (routePath) => {
    const breadcrumbs = [];
    
    // Find the main menu item
    const mainItem = menuData.value.find(item => 
      item.href && routePath.startsWith(item.href)
    );
    
    if (mainItem) {
      breadcrumbs.push({
        title: mainItem.title,
        href: mainItem.href
      });
      
      // Check for sub-items if exists
      if (mainItem.children) {
        const subItem = mainItem.children.find(child => 
          child.href && routePath.startsWith(child.href)
        );
        
        if (subItem) {
          breadcrumbs.push({
            title: subItem.title,
            href: subItem.href
          });
        }
      }
    }
    
    return breadcrumbs;
  };
  
  // Initialize the menu store
  const initialize = async () => {
    // Try API first, fallback to local JSON
    try {
      await fetchMenuFromAPI();
    } catch (err) {
      console.log('Failed to initialize menu:', err);
    }
  };
  
  return {
    menuData,
    filteredMenu,
    loading,
    error,
    loadMenuData,
    fetchMenuFromAPI,
    findMenuItemByPath,
    getBreadcrumbs,
    initialize
  };
});