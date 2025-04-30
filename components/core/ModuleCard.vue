<template>
    <div class="rty-card">
        <div class="flex flex-col gap-1 items-center">
          <i :class="icon" :style="iconStyle" class="flex justify-center items-center"></i>
            <div class="text-center ">
                <p class="text-xl lg:text-xl font-bold">{{ title }}</p>
                <p class="text-xl font-semibold">{{ description }}</p>
            </div>
        </div>
    </div>
  </template>
  
  <script setup>
    import { onMounted } from 'vue';
    const props = defineProps(['icon','title']);
  // Compute the icon font size based on screen size
const iconStyle = computed(() => {
  // Logic to determine font size for different screen sizes
  const screenWidth = window.innerWidth;
  if (screenWidth >= 1024) { // lg screen size
    return { fontSize: '3.5rem' };
  } else if (screenWidth >= 500) { // md screen size
    return { fontSize: '2rem' };
  } else { // sm screen size
    return { fontSize: '1.10rem' };
  }
});

// const icon = computed(() => {props.icon})
// const title = computed(() => {props.title})
// const description = computed(() => {props.description})

  // You can set the document title in the mounted hook
  onMounted(() => {
    document.title = props.title; // Set the document title
  });
  </script>
  