<template>
    <div v-if="isVisible" class="modal-overlay fixed z-50">
      <div class="modal">
        <h3>Are you sure you want to delete this item?</h3>
        <p>This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="cancel">Cancel</button>
          <button @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  // Props to control visibility and callback actions
  const props = defineProps({
    isVisible: {
      type: Boolean,
      required: true,
    },
    onDelete: {
      type: Function,
      required: true,
    },
    onCancel: {
      type: Function,
      required: true,
    },
  });
  
  // Define local state for visibility
  const isVisible = ref(props.isVisible);
  
  // Call confirm action when delete is confirmed
  const confirmDelete = () => {
    props.onDelete(); // Execute the delete function passed as a prop
    isVisible.value = false; // Hide modal after action
  };
  
  // Call cancel action when user cancels
  const cancel = () => {
    props.onCancel(); // Execute cancel function passed as a prop
    isVisible.value = false; // Hide modal after cancel
  };
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;                                                                                    
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999 !important;
  }
  
  .modal {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  
  .modal-actions {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
  }
  
  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  </style>
  