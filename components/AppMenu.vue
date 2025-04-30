<script setup>
const menuStore = useMenuStore();
const authStore = useAuthStore();

onMounted(async () => {
  await menuStore.loadMenuData();
});

const isActive = (href) => {
  const route = useRoute();
  return route.path.startsWith(href);
};
</script>

<template>
  <div class="menu-container">
    <div v-for="item in menuStore.filteredMenu" :key="item.id" class="menu-item">
      <NuxtLink 
        :to="item.href" 
        class="menu-link"
        :class="{ active: isActive(item.href) }"
      >
        <div v-html="item.icon" class="menu-icon"></div>
        <span class="menu-title">{{ $t(`menu.${item.title}`) }}</span>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.menu-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  padding: 4px 0;
}

.menu-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  color: #6b7280;
  text-decoration: none;
  transition: all 0.2s;
}

.menu-link:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.menu-link.active {
  background-color: #e5e7eb;
  color: #111827;
  font-weight: 500;
}

.menu-icon {
  font-size: 20px;
  display: flex;
  align-items: center;
}

.menu-title {
  font-size: 14px;
}
</style>