<script setup>
const menuStore = useMenuStore();
const route = useRoute();

// Get current menu item
const currentMenuItem = computed(() => {
  return menuStore.findMenuItemByPath(route.path);
});

// Get breadcrumbs
const breadcrumbs = computed(() => {
  return menuStore.getBreadcrumbs(route.path);
});
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="menuStore.loading">Loading menu...</div>
    
    <!-- Error state -->
    <div v-if="menuStore.error" class="error">
      {{ menuStore.error }}
    </div>
    
    <!-- Render menu -->
    <nav v-if="menuStore.filteredMenu.length">
      <ul>
        <li v-for="item in menuStore.filteredMenu" :key="item.id">
          <NuxtLink 
            :to="item.href" 
            :class="{ active: currentMenuItem?.id === item.id }"
          >
            <span v-html="item.icon" v-if="item.icon"></span>
            {{ item.title }}
          </NuxtLink>
          
          <!-- Submenu if exists -->
          <ul v-if="item.children">
            <li v-for="child in item.children" :key="child.id">
              <NuxtLink :to="child.href">
                {{ child.title }}
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
    
    <!-- Breadcrumbs -->
    <div class="breadcrumbs" v-if="breadcrumbs.length">
      <span v-for="(crumb, index) in breadcrumbs" :key="crumb.href">
        <NuxtLink :to="crumb.href">{{ crumb.title }}</NuxtLink>
        <span v-if="index < breadcrumbs.length - 1"> &gt; </span>
      </span>
    </div>
  </div>
</template>