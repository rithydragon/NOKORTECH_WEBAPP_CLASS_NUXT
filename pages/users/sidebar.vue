<template>
    <div class="sidebar">
      <ul>
        <li v-for="item in menu" :key="item.path">
          <NuxtLink :to="item.path" class="menu-item">
            <span class="icon">{{ item.icon }}</span>  <!-- Use icon if needed -->
            {{ item.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  // import { useMenu } from '~/store/menu.js';
  
  // const menu = useMenu();  // Access menu data from the store
  </script>
  
  <style scoped>
  .sidebar {
    width: 250px;
    padding: 20px;
    background-color: #f4f4f4;
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  
  .icon {
    margin-right: 10px;
    font-size: 1.2em;
  }
  </style>
  