<template>
<div class="container mx-auto h-screen overflow-y-hidden">
  <div class=" flex justify-center items-center h-screen px-4 lg:p-8 lg:w-full">
    <div class="dark:bg-gray-900 bg-blue-50 rounded-lg p-2 md:p-4 lg:p-8">
      <div class="flex justify-end">
        <DarkModeToggle ></DarkModeToggle>
      </div>
      <div class="flex gap-2 md:gap-6 lg:gap-20 dark:gap-42 text-center lg:p-8">
        <div class="flex  items-center mb-4">
          <img src="https://img.icons8.com/emoji/96/000000/crying-face.png" alt="Error Icon" class="w-16 h-16"/>
          <!-- <img src="/images/education-tree.png" alt="Error Icon" class="w-[200ox] h-[200px] lg:w-[400px] lg:h-[400px]"/> -->
        </div>
        <div>
          <p class="text-3xl lg:text-[150px] font-bold text-gray-400  dark:text-gray-300">{{ error.statusCode }}</p>
          <p class="text-xl lg:text-3xl font-semibold lg:mt-11 lg:mb-6 text-gray-300 dark:text-gray-300">Ooops.</p>
          <p class=" mt-2 lg:mt-4 text-normal lg:text-lg w-auto h-auto">{{ error.message }}</p>
          <p class="text-xxs lg:text-xl mt-2 lg:mt-4 dark:text-gray-300">Something went wrong. Don't worry, it happens to the best of us.</p>
          <button class="text-normal lg:text-xl  btn mt-2 lg:my-7 bg-green-400 dark:bg-blue-800 dark:text-white py-1 px-2 rounded-full hover:bg-blue-700 hover:text-white hover:shadow-md dark:hover:bg-blue-400 transition-colors duration-300" @click="handleError">
            Go Home...
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
defineProps({
  error: Object
})

const handleError = () => {
  // Handle the error and redirect to the home page
  clearError({ redirect: '/' });
}
</script>

<style scoped>
/* .card {
  border: 1px solid #ddd;
  background-color: #f9f9f9;
} */

.btn {
  cursor: pointer;
}
</style>
