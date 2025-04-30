<template>
    <head>
      <title>{{ title }}</title>
      <meta name="description" :content="description" />
    </head>
  </template>
  
  <script setup>
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  });
  </script>