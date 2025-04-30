<template>
    <div style="height: 70vh">
      <RTYTableTest
        :columns="[
          { key: 'id', label: 'ID', width: '80px' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: '' }
        ]"
        :data="users"
        :options="{
          height: '100%',
          fixedRowCount: 10
        }"
      >
        <template #cell-status="{ row }">
          <UBadge :color="row.status === 'active' ? 'green' : 'red'">
            {{ row.status }}
          </UBadge>
        </template>
        
        <template #actions="{ row }">
          <UButton icon="i-heroicons-pencil" size="xs" @click="editUser(row)" />
        </template>
      </RTYTableTest>
    </div>
  </template>

  <script>

</script>