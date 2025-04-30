<template>
    <div class="max-w-md mx-auto p-4">
      <!-- File Input -->
      <label class="block">
        <span class="sr-only">Choose image</span>
        <input
          type="file"
          accept="image/*"
          @change="handleFileSelect"
          class="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </label>
  
      <!-- Preview -->
      <div v-if="imageSrc" class="mt-4">
        <div class="relative">
          <img 
            :src="imageSrc" 
            alt="Preview" 
            class="max-w-full h-auto rounded-lg shadow"
            :style="{ transform: `rotate(${rotation}deg) scale(${scale})` }"
          />
          <div v-if="isEditing" class="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <span class="text-white font-bold">Editing Mode</span>
          </div>
        </div>
  
        <!-- Edit Controls -->
        <div v-if="imageSrc" class="mt-4 flex space-x-4">
          <button
            @click="openModal"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Customize
          </button>
          <button
            @click="uploadImage"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            :disabled="isUploading"
          >
            <span v-if="!isUploading">Upload</span>
            <span v-else>Uploading...</span>
          </button>
        </div>
      </div>
  
      <!-- Customization Modal -->
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>
  
          <div class="fixed inset-0 overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle
                    as="h3"
                    class="text-lg font-medium leading-6 text-gray-900"
                  >
                    Customize Your Image
                  </DialogTitle>
  
                  <div class="mt-4">
                    <div class="flex justify-center mb-4">
                      <img 
                        ref="imageElement"
                        :src="imageSrc" 
                        alt="Edit Preview" 
                        class="max-w-full h-64 object-contain"
                        :style="{ transform: `rotate(${rotation}deg) scale(${scale})` }"
                      />
                    </div>
  
                    <div class="space-y-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Rotation</label>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          v-model.number="rotation"
                          class="w-full mt-1"
                        />
                        <span class="text-sm text-gray-500">{{ rotation }}°</span>
                      </div>
  
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Scale</label>
                        <input
                          type="range"
                          min="0.5"
                          max="2"
                          step="0.1"
                          v-model.number="scale"
                          class="w-full mt-1"
                        />
                        <span class="text-sm text-gray-500">{{ scale }}x</span>
                      </div>
                    </div>
                  </div>
  
                  <div class="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none"
                      @click="closeModal"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none"
                      @click="applyChanges"
                    >
                      Apply Changes
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  } from '@headlessui/vue'
  import imageCompression from 'image-compression'
  import axios from 'axios'
  
  const isOpen = ref(false)
  const imageSrc = ref('')
  const imageFile = ref(null)
  const rotation = ref(0)
  const scale = ref(1)
  const isUploading = ref(false)
  const isEditing = ref(false)
  const imageElement = ref(null)
  
  function openModal() {
    isOpen.value = true
    isEditing.value = true
  }
  
  function closeModal() {
    isOpen.value = false
    isEditing.value = false
  }
  
  function applyChanges() {
    closeModal()
  }
  
  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      imageFile.value = file
      imageSrc.value = URL.createObjectURL(file)
    }
  }
  
  const uploadImage = async () => {
    if (!imageFile.value) return
  
    isUploading.value = true
  
    try {
      // Create canvas to apply transformations
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = async () => {
        // Set canvas dimensions
        canvas.width = img.width * scale.value
        canvas.height = img.height * scale.value
        
        // Apply transformations
        ctx.translate(canvas.width / 2, canvas.height / 2)
        ctx.rotate((rotation.value * Math.PI) / 180)
        ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
        
        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
          // Compress the image
          const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true
          }
          
          const compressedFile = await imageCompression(blob, options)
          
          // Convert to byte array
          const arrayBuffer = await compressedFile.arrayBuffer()
          const byteArray = new Uint8Array(arrayBuffer)
          
          // Upload to backend
          await axios.post('http://localhost:3000/upload', byteArray, {
            headers: {
              'Content-Type': 'application/octet-stream'
            }
          })
          
          alert('Image uploaded successfully!')
        }, 'image/jpeg', 0.9)
      }
      
      img.src = imageSrc.value
    } catch (error) {
      console.log('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      isUploading.value = false
    }
  }
  </script>
  
  <style>
  /* Additional styles if needed */
  </style>