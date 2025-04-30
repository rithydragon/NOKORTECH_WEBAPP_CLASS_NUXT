<template>
    <div
      class="bg-white shadow-lg rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform border-t-4 border-indigo-600"
      @click="navigate"
    >
      <h2 class="text-xl font-semibold text-gray-800">{{ title }}</h2>
      <p class="text-sm text-gray-500 mt-1">Click to configure {{ title.toLowerCase() }}</p>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    title: String,
    route: String
  })
  const toast = useToast()
const router = useRouter()

const navigate = () => {
  if (props.route === '/telegramSetup') {
    router.push(props.route)
  } else {
    toast.add({ color: 'orange', title: `This function is not available now` })
    router.push(!props.route)
  }
}
  </script>
  