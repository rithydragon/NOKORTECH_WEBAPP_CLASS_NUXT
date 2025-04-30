<template>
    <button @click="showModal = true">Open Smooth Modal</button>
  
    <RModal
      v-model="showModal"
      modal-title="Premium Modal"
      :action-buttons="[
        { label: 'Close', event: 'close', class: 'bg-gray-100 hover:bg-gray-200' },
        { label: 'Accept', event: 'accept', class: 'bg-green-600 text-white hover:bg-green-700' }
      ]"
      size="lg"
      :animation-duration="350"
      @close="showModal = false"
      @accept="handleAccept"
    >
      <div class="p-6">
        <h4 class="text-xl font-medium mb-4">Enjoy this buttery-smooth modal</h4>
        <p class="text-gray-600">The animation now has a natural, app-like feel with proper easing curves.</p>
      </div>
    </RModal>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const showModal = ref(false)
  
  const handleAccept = () => {
    console.log('Accepted!')
    showModal.value = false
  }
  </script>