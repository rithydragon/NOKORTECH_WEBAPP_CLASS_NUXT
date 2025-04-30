<template>
    <div>
      <h1>Users</h1>
      <NuxtLink to="/users/Create">Create New User</NuxtLink>
      <ul>
        <li v-for="user in users" :key="user.ID">
          <NuxtLink :to="`/users/${user.ID}`">{{ user.Name }}</NuxtLink>
        </li>
      </ul>
      <NuxtImage :src="users.imagePath" alt="User Image" />
    </div>
  </template>
  
  <script setup>
  const { data: users } = await useHttp('/api/user/list');

definePageMeta({ layout: 'layout', middleware: 'auth', role: "teacher" });

  </script>