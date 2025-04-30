<template>
    <div class="min-h-screen bg-gray-50 p-6">
      <h1 class="text-3xl font-bold text-center text-indigo-700 mb-10">Setup</h1>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <SetupCard title="Setup Class" route="/setup/class" />
        <SetupCard title="Assign Class" route="/setup/assign-class" />
        <SetupCard title="Setup Academic" route="/setup/academic" />
        <SetupCard title="Setup Department" route="/setup/department" />
        <SetupCard title="Setup Course" route="/setup/course" />
        <SetupCard title="Setup Subject" route="/setup/subject" />
        <SetupCard title="Setup Student" route="/setup/student" />
        <SetupCard title="Student Score Input" route="/setup/score" />
        <SetupCard title="Exam Result Setup" route="/setup/exam" />
        <SetupCard title="Telegram Setup" route="/telegramSetup" />
      </div>
    </div>
  </template>
  
  <script setup>



definePageMeta({layout:'layout',middleware:'auth'})
  </script>
  
  <style lang="scss" scoped>
  </style>
  