<template>
    <div class="flex gap-3 p-[30px]">
      <RTYTblBtn :actions="actions" />
    </div>

    <div>
    <button @click="showCustomToast">Show Custom Toast</button>
    <RTYMenuDropdown
      v-model="model"
      :api="{
        url: '/api/subject/list',
        method: 'GET',
      }"
      item-value="subjectId"
      item-label="subjectName"
    />
  </div>

  </template>
  

<script setup>
const toast = useToast()
const model = ''
const actions = [
  { label: 'Create', type: 'create', iconSize: '22px', onClick: () => alert('Create clicked') },
  { label: 'Update', type: 'update', iconSize: '20px', onClick: () => alert('Update clicked') },
  { label: 'Delete', type: 'delete', iconSize: '20px', onClick: () => alert('Delete clicked') },
  { label: 'Approve', type: 'approve', iconSize: '20px', onClick: () => alert('Approve clicked') },
  { label: 'Upload', type: 'upload', iconSize: '20px', onClick: () => alert('Upload clicked') },
  { label: 'Download', type: 'download', iconSize: '20px', onClick: () => alert('Download clicked') },
  { label: 'Settings', type: 'settings', iconSize: '20px', onClick: () => alert('Settings clicked') },
  { label: 'Danger', type: 'danger', iconSize: '20px', onClick: () => alert('Danger clicked') },
  { label: 'Success', type: 'success', iconSize: '20px', onClick: () => alert('Success clicked') },
  { label: 'Share', type: 'share', iconSize: '20px', onClick: () => alert('Share clicked') },
  { label: 'Send', type: 'send', iconSize: '20px', onClick: () => alert('Send clicked') },
]

definePageMeta({ layout: 'layout', middleware: ['auth'] });

</script>
