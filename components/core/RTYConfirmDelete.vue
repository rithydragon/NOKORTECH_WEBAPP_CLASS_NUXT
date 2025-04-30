<script setup>
import { ref, defineProps, defineEmits } from "vue";

const props = defineProps({
  item: Object, // The item to be deleted (passed from parent)
  apiUrl: String, // API URL for deletion
  show: Boolean, // Boolean to control modal visibility
});

const emit = defineEmits(["update:show", "onSuccess"]); // Emits for parent

const isLoading = ref(false);
const errorMessage = ref("");

async function deleteItem() {
  if (!props.item?.id) return;
  
  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await fetch(`${props.apiUrl}/${props.item.id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Failed to delete");

    // Emit event to notify parent that deletion was successful
    emit("onSuccess", props.item.id);
    closeModal();
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

function closeModal() {
  emit("update:show", false); // Close modal
}
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white p-6 rounded shadow-lg w-96">
      <h2 class="text-lg font-semibold">Confirm Delete</h2>
      <p class="text-gray-600">Are you sure you want to delete <strong>{{ item?.name }}</strong>?</p>
      
      <p v-if="errorMessage" class="text-red-500 mt-2">{{ errorMessage }}</p>

      <div class="flex justify-end mt-4">
        <button @click="closeModal" class="px-4 py-2 bg-gray-300 rounded mr-2">Cancel</button>
        <button @click="deleteItem" :disabled="isLoading" class="px-4 py-2 bg-red-500 text-white rounded">
          {{ isLoading ? "Deleting..." : "Delete" }}
        </button>
      </div>
    </div>
  </div>
</template>
