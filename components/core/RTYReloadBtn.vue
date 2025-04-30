<template>
    <button class="reload-btn" @click="$emit('click')">
      <i class="ri-refresh-line"></i>
    </button>
  </template>
  
  <script setup>
  // Emits a click when pressed
  defineEmits(['click']);
  </script>
  
  <style lang="scss" scoped>
  .reload-btn {
    display: inline-flex;
    align-items: center;
    width: 13px;
    height:13px;
    gap: 0.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 1rem;
    background-color: transparent;
    border: 1px solid rgba(0, 0, 0, 0.2); // subtle border
    border-radius: 5px; // fully rounded
    color: #333;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
  
    i {
      font-size: 1.2rem;
      transition: transform 0.4s ease;
    }
  
    &:hover {
      border-color: rgba(0, 0, 0, 0.5);
      background-color: rgba(0, 0, 0, 0.05);
  
      i {
        transform: rotate(360deg);
      }
    }
  
    &:active {
      transform: scale(0.97);
    }
  }
  </style>
  