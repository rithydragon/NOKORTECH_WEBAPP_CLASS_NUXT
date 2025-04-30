<template>
  <RTYHead :title="$t('user_management')"/>
  <RTPageWrapper>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ $t('user_management') }}</h1>
    </div>

    <RTYTable ref="dataTable" :api="{ url: '/api/user/list', method: 'POST' }" :columns="columns" :data="localData"
      :options="{
        pagination: true,
        tblBorder: true,
        initialFilters: { status: 'active' },
        scrollHeight: '500px',
        expandable: true,
        expandable: true,
        expandClass: 'bg-blue-50 dark:bg-blue-900/20',
        rowClass: 'hover:bg-gray-100 dark:hover:bg-gray-800'
      }" @update:search="handleSearch" @update:filters="handleFilters" @reload="fetchData" @loaded="handleDataLoaded"
      @error="handleError" @refresh="getUserData" @loading="loading = true">

      <!-- Custom Header -->
      <template #headerRight>
        <UButton :label="$t('add')" icon="i-heroicons-plus" @click="actionClickCreate" />
      </template>

      <!-- Custom Filter Component -->
      <template #filter="{ filters, update }">
        <div class="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mt-4">
          <USelect v-model="filters.status" :options="statusOptions" @update:modelValue="update" />
          <UInput v-model="filters.name" placeholder="Filter by name" @update:modelValue="update" />
        </div>
      </template>

      <template #UserActive="{ data }">
        <div class="flex items-center gap-2">
          <RTYAvatar size="30" :gender="data?.Gender" :active="data?.UserActive" />
          <span class="color-sub-text">@{{ data.Username ? data.Username : '' }}</span>
        </div>
      </template>

      <template #CreatedBy="{ data }">
        <div class="flex flex-col">
          <span>@{{ data.CreatedBy ? data.CreatedBy : '...' }}</span>
          <span class="color-sub-text">{{ rtydate(data.CreatedAt).format('MMM dd, yyyy HH:MM A') }}</span>
        </div>
      </template>

      <template #UpdatedBy="{ data }">
        <div class="flex flex-col">
          <span>@{{ data.UpdatedBy ? data.UpdatedBy : '...' }}</span>
          <span class="color-sub-text">{{ rtydate(data.UpdatedAt).format('MMM dd, yyyy hh:mm A') }}</span>
        </div>
      </template>

      <template #actions="{ data }">
        <RTYTblBtn :actions="btnAction" @onClick="(action) => handleAction(action, data)" />
      </template>
    </RTYTable>

    <!-- Slideover for Create/Edit -->
    <RTSlideover v-model="isSlideoverOpen" :title="isCreate ? $t('new_user') : $t('edit_user')">
      <div class="space-y-4">
        <UFormGroup label="User Code" required>
          <UInput v-model="model.UserCode" :disabled="operationType === 'edit'" />
        </UFormGroup>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Name" required>
            <UInput v-model="model.Name" />
          </UFormGroup>

          <UFormGroup label="Name (English)">
            <UInput v-model="model.NameEnglish" />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Username" required>
            <UInput v-model="model.Username" />
          </UFormGroup>

          <UFormGroup label="Email" required>
            <UInput v-model="model.Email" type="email" />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup v-if="isCreate" label="Password" required>
            <UInput v-model="model.Password" type="password" required  />
          </UFormGroup>
          <UFormGroup label="Gender">
            <USelect v-model="model.Gender" :options="['Male', 'Female', 'Custom']" />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="User Type">
            <USelect v-model="model.UserType" :options="['Admin', 'User', 'Manager','General','System','Student','Teacher']" />
          </UFormGroup>

          <UFormGroup label="Date of Birth">
            <UInput v-model="model.DateOfBirth" type="date" />
          </UFormGroup>
        </div>

        <UFormGroup label="Place of Birth">
          <UInput v-model="model.PlaceOfBirth" />
        </UFormGroup>

        <UFormGroup label="Address">
          <UTextarea v-model="model.Address" rows="3" />
        </UFormGroup>

        <UFormGroup label="Phone Number">
          <UInput v-model="model.PhoneNumber" type="tel" />
        </UFormGroup>
      </div>

      <template #footer>
        <button class="bg-gray-500 text-white px-4 py-2 rounded mr-2" @click="closeSlideover">
          {{ $t('close') }}
        </button>
        <button @click="handleSubmit" class="bg-blue-500 text-white px-4 py-2 rounded">
          {{ $t('confirm') }}
        </button>
      </template>
    </RTSlideover>
    <button>
    </button>
  </RTPageWrapper>
</template>

<script setup>
const users = ref([])
const { t } = useI18n()
const loading = ref(false)
const model = ref({})
const isSlideoverOpen = ref(false)
const isCreate = ref(true)
const dataTable = ref()
const operationType = ref('create') // 'create' or 'edit'
const { confirm } = useConfirm(); // Make sure to import useConfirm
const { notify } = useNotification()

// Success notification
notify('Profile updated successfully!')

// Table columns configuration
const columns = [
  { data: 'UserCode', label: t('code') },
  { data: 'UserActive', label: t(''),slot: true },
  { data: 'Name', label: t('name')},
  {
    data: 'NameEnglish', label: t('english_name'),
    class: row => row.highlight ? 'text-green-600 font-bold' : '', // Dynamic class
    cellClass: 'truncate max-w-[200px]' // Cell specific
  },
  { data: 'Username', label: t('username') },
  {
    data: 'Email',
    label: t('email'),
    className: 'font-mono text-xs', // Static class
    headerClass: 'bg-gray-100' // Header specific
  },
  {
    data: 'Gender', label: t('gender'),
    expandable: true,
    className: row => ({
      'active': 'text-green-600',
      'inactive': 'text-gray-400'
    }[row.status])
  },
  { data: 'UserType', label: t('user_type'), expandable: (row) => row.status === 'active' },// Only expandable for active rows 
  { data: 'CreatedBy', label: t('created_by'), slot: true },
  { data: 'UpdatedBy', label: t('updated_by'), slot: true },
  // { data: 'total', label: 'Total', render: (row) => `$${row.total.toFixed(2)}` },
  // { label: 'Full Name', data: 'userFirstNameKhmer', render: (data) => `${data.F_NAME_ENGLISH} ${data.L_NAME_ENGLISH}` },
  { data: 'actions', label: t('action') }
]
const btnAction = [
  { label: 'edit', type: 'edit', icon: 'edit', disabled: false },
  { label: 'delete', type: 'delete', icon: 'delete', disabled: false },
  { label: 'view', type: 'view', icon: 'view', disabled: false },
]

// Initial empty user object
const emptyUser = {
  UserCode: '',
  Name: '',
  NameEnglish: '',
  Username: '',
  Email: '',
  Password:'',
  Gender: '',
  UserType: '',
  DateOfBirth: model.DateOfBirth ? `${model.DateOfBirth} 00:00:00` : null,
  PlaceOfBirth: '',
  Address: '',
  PhoneNumber: '',
}

const handleAction = (type, data) => {
  console.log('Action:', type)
  console.log('Data:', data)
  if (type == "edit") {
    notify("Update action clicked")
    editUser(data)
  } else if (type == "delete") {
    actionDelete(data)
  } else if (type == "view") {
    viewUser(data)
  } else if (type == "update") {
    console.log("Update action clicked")
    notify("Update action clicked")
  } else {
    notify("Unknown action clicked")
    console.log("Unknown action clicked")
  }
}
const handleFilters = (filters) => {
  // Handle filters
}

const statusColor = (status) => {
  return status === 'active' ? 'green' : 'red'
}

// Initialize form for creating new user
const actionClickCreate = () => {
  isCreate.value = true
  model.value = {...emptyUser }
  operationType.value = 'create'
  isSlideoverOpen.value = true
}

// Initialize form for editing user
const editUser = (user) => {
  loadUser(user)
  isCreate.value = false
  model.value = { ...user }
  operationType.value = 'edit'
  isSlideoverOpen.value = true
}

const loadUser = (user) => {
  model.UserCode = user.UserCode
  model.Name = user.Name
  model.NameEnglish = user.NameEnglish
  model.Username = user.Username
  model.Email = user.Email
  model.Password = user.Password,
  model.Gender = user.Gender
  model.UserType = user.UserType
  model.DateOfBirth = user.DateOfBirth ? user.DateOfBirth.substring(0, 10) : ''
  model.PlaceOfBirth = user.PlaceOfBirth
  model.Address = user.Address
  model.PhoneNumber = user.PhoneNumber
}


const queryParams = useQueryParams() // ✅ No import needed
const viewUser = (data) => {
  const path = '/users/userManagement/info'
  queryParams(path, data,'user') // ✅ No error here
}

// Handle form submission
const handleSubmit = async () => {
  try {
    const { data, error } = await useHttp(
      isCreate.value
        ? '/api/user/create'
        : `/api/user/update`,
      {
        method: 'POST',
        data: isCreate.value ? model.value : model.value
      }
    )
    isSlideoverOpen.value = false
    reloadTable()
  } catch (error) {
    console.log('Error saving user:', error)
  }
}

const actionDelete = async (data) => {
  const isConfirmed = await confirm({
    type: 'warning',
    title: t('do_you_want_to_delete', { value: `${data.UserCode}` }),
    description: t('this_action_cannot_be_undone'), // Optional description
    confirmText: t('delete'), // Optional button text
  });

  if (isConfirmed) {
    try {
      loading.value = true;
      await deleteUser(data.UserId);
    } catch (error) {
      console.log('Error deleting user:', error);
    } finally {
      loading.value = false;
    }
    await reloadTable();
  }
}

// function reloadTable() {
//   dataTable.value?.reload()
// }
// await useHttp(`/api/user/delete?Id=${id}`, {
//   method: 'GET',
// });
const deleteUser = async (id) => {
  try {
    // Pass ID as query param since GET doesn't support body
    const { data,error} = await useHttp(`/api/user/delete?Id=${id}`)
    // const { data,error} = await useHttp(`/api/user/delete`, {
    //   method: 'GET',
    //   data: { Id: id }, // 👈 Correct way to pass query string in most fetch wrappers  // <- This becomes ?Id=123 in the URL
    // });

    if(error.value) console.log("Failed to delete : ",error.value?.message)
    else{
      reloadTable()
      console.log(t('user_deleted_successfully'), 'success');
    }
  } catch (error) {
    console.log('Error deleting user:', error);
    showNotification(t('failed_to_delete_user'), 'error');
  }
};

// Improved reloadTable function with error handling
const reloadTable = async () => {
  try {
    if (dataTable.value?.reload) {
      dataTable.value.startLoading();
      // Small delay to ensure loading state is visible
      setTimeout(() => {
        dataTable.value.reload();
      }, 300);
    } else {
      console.warn('DataTable reference not available');
    }
  } catch (error) {
    console.log('Error reloading table:', error);
  }
};
const getStatusColor = (status) => {
  if (!status || typeof status !== 'string') {
    return 'blue'; // Default color for unexpected values
  }

  const statusColors = {
    active: 'green',
    inactive: 'red',
    pending: 'yellow',
    banned: 'gray'
  };

  return statusColors[status.toLowerCase()] || 'blue';
};
// Fetch users on component mount
// onMounted(getUserData)

const handleDataLoaded = (data) => {
  console.log('Data loaded user management page -> :', data)
}

const handleError = (error) => {
  console.log('Table error:', error)
}

const closeSlideover = () => {
  isSlideoverOpen.value = false
}
const forceRefresh = () => {
  dataTable.value.startLoading()
  setTimeout(() => {
    dataTable.value.reload()
  }, 500)
}


definePageMeta({ layout: 'layout', middleware: 'auth' })
</script>
