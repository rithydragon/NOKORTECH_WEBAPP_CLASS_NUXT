<template>
  <RTPageWrapper>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">{{ $t('user_management') }}</h1>
      <UButton :label="$t('add')" icon="i-heroicons-plus" @click="actionClickCreate" />
    </div>
    <RTYTableDev ref="dataTable" :api="{ url: '/api/user/list', method: 'POST' }" :columns="columns" :data="localData"
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
      <template #headerLeft>
        <h2 class="text-xl font-bold">User Management</h2>
      </template>

      <template #headerRight>
        <UButton label="Export" icon="i-heroicons-document-arrow-down" />
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
          <RTYAvata size="30" :gender="data?.Gender" :active="data?.UserActive" />
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
        <div class="flex flex-col items-center">
          <span>@{{ data.UpdatedBy ? data.UpdatedBy : '...' }}</span>
          <span class="color-sub-text">{{ rtydate(data.UpdatedAt).format('MMM dd, yyyy hh:mm A') }}</span>
        </div>
      </template>

      <template #actions="{ data }">
        <RTYTblBtn :actions="btnAction" @onClick="(action) => handleAction(action, data)" />
      </template>
    </RTYTableDev>

    <!-- Slideover for Create/Edit -->
    <RTSlideover v-model="isSlideoverOpen" :title="isCreate ? $t('new_user') : $t('edit_user')">
      <div class="space-y-4">
        <UFormGroup label="User Code" required>
          <UInput v-model="currentUser.UserCode" :disabled="operationType === 'edit'" />
        </UFormGroup>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Name" required>
            <UInput v-model="currentUser.Name" />
          </UFormGroup>

          <UFormGroup label="Name (English)">
            <UInput v-model="currentUser.NameEnglish" />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Username" required>
            <UInput v-model="currentUser.Username" />
          </UFormGroup>

          <UFormGroup label="Email" required>
            <UInput v-model="currentUser.Email" type="email" />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="Password" :required="operationType === 'create'">
            <UInput v-model="currentUser.Password" type="password" />
          </UFormGroup>

          <UFormGroup label="Gender">
            <USelect v-model="currentUser.Gender" :options="['Male', 'Female', 'Other']" />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UFormGroup label="User Type">
            <USelect v-model="currentUser.UserType" :options="['Admin', 'User', 'Manager']" />
          </UFormGroup>

          <UFormGroup label="Date of Birth">
            <UInput v-model="currentUser.DateOfBirth" type="date" />
          </UFormGroup>
        </div>

        <UFormGroup label="Place of Birth">
          <UInput v-model="currentUser.PlaceOfBirth" />
        </UFormGroup>

        <UFormGroup label="Address">
          <UTextarea v-model="currentUser.Address" rows="3" />
        </UFormGroup>

        <UFormGroup label="Phone Number">
          <UInput v-model="currentUser.PhoneNumber" type="tel" />
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
const currentUser = ref({})
const isSlideoverOpen = ref(false)
const isCreate = ref(true)
const dataTable = ref()
const operationType = ref('create') // 'create' or 'edit'
const { confirm, notify } = useConfirm(); // Make sure to import useConfirm

// Table columns configuration
const columns = [
  { data: 'UserCode', label: t('code') },
  { data: 'UserActive', label: t(''), slot: true },
  { data: 'Name', label: t('name') },
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
  { label: t('edit'), type: 'edit', icon: 'edit', disabled: false },
  { label: t('delete'), type: 'delete', icon: 'delete', disabled: false },
  { label: t('view'), type: 'view', icon: 'view', disabled: false },
]

// Initial empty user object
const emptyUser = {
  UserCode: '',
  Name: '',
  NameEnglish: '',
  Username: '',
  Email: '',
  Password: '',
  Gender: '',
  UserType: '',
  DateOfBirth: '',
  PlaceOfBirth: '',
  Address: '',
  PhoneNumber: '',
}

const handleAction = (type, data) => {
  console.log('Action:', type)
  console.log('Data:', data)
  if (type == "edit") {
    editUser(data)
  } else if (type == "delete") {
    actionDelete(data)
  } else if (type == "view") {
    viewUser(data)
  } else if (type == "update") {
    console.log("Update action clicked")
  } else {
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
  currentUser.value = { ...emptyUser }
  operationType.value = 'create'
  isSlideoverOpen.value = true
}

// Initialize form for editing user
const editUser = (user) => {
  isCreate.value = false
  currentUser.value = { ...user }
  operationType.value = 'edit'
  isSlideoverOpen.value = true
}

const viewUser = (data) => {
  navigateTo(`/users/userManagement/${data.UserId}`)
}

// Handle form submission
const handleSubmit = async () => {
  try {
    const { data, error } = await useHttp(
      isCreate.value
        ? '/api/user/create'
        : `/api/user/update/${currentUser.value.UserId}`, // ✅ fixed 'update' spelling
      {
        method: 'POST',
        data: currentUser.value
      }
    )

    if (data && !data.error) {
      isSlideoverOpen.value = false
    }
  } catch (error) {
    console.log('Error saving user:', error)
  }
}


const actionDelete = async (data) => {
  console.log("Data at delete ", data)

  const isConfirmed = await confirm({
    type: 'warning', // Type of confirmation (success, error, warning, info)
    title: t('do_you_want_to_delete', { value: `${data.UserCode}` }),
    description: t('this_action_cannot_be_undone'), // Optional description
    confirmText: t('confirm'), // Optional button text
  });

  if (isConfirmed) {
    try {
      loading.value = true;
      await deleteUser(data.UserId);
      reloadTable();
    } catch (error) {
      console.log('Error deleting user:', error);
    } finally {
      loading.value = false;
    }
  }
}

// function reloadTable() {
//   dataTable.value?.reload()
// }
const deleteUser = async (id) => {
  try {
    // Changed to DELETE method (recommended) and fixed URL formatting
    await useHttp(`/api/user/delete/${id}`, {
      method: 'DELETE' // Changed from GET to DELETE (more appropriate)
    });
    console.log(t('user_deleted_successfully'), 'success');
  } catch (error) {
    console.log('Error deleting user:', error);
    // Optional: Show error notification
    showNotification(t('failed_to_delete_user'), 'error');
  }
}
// Improved reloadTable function with error handling
const reloadTable = () => {
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

const localData = ([
  {
    "UserId": 41,
    "UserCode": "U003",
    "Name": "ប៉ុណ្ណា សេន",
    "NameEnglish": "Ponna Sen",
    "Username": "ponna",
    "Email": "ponna@example.com",
    "Password": "hashedpassword3",
    "Gender": "Custom",
    "UserType": "STUDENT",
    "DateOfBirth": "2002-01-24T17:00:00.000Z",
    "PlaceOfBirth": "Battambang",
    "Address": "Village 3, BB",
    "PhoneNumber": "85521179968",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": null,
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-01T08:46:37.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[\"Viewer\"]",
    "Permissions": "[\"View Dashboard\", \"Create, Update, Delete View\"]",
    "Groups": "[]"
  },
  {
    "UserId": 42,
    "UserCode": "U004",
    "Name": "វិចិត្រ ថន",
    "NameEnglish": "Vichetr Than",
    "Username": "vichetr",
    "Email": "vichetr@example.com",
    "Password": "hashedpassword4",
    "Gender": "Male",
    "UserType": "STUDENT",
    "DateOfBirth": "2001-07-04T17:00:00.000Z",
    "PlaceOfBirth": "Takeo",
    "Address": "Street 4, TK",
    "PhoneNumber": "85570007314",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": null,
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-01T08:46:37.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[\"Admin\"]",
    "Permissions": "[\"Manage Users\", \"Edit Content\", \"Delete Content\", \"Create, Update, Delete View\"]",
    "Groups": "[]"
  },
  {
    "UserId": 107,
    "UserCode": "U0011",
    "Name": "សុខ មិត្ត",
    "NameEnglish": "Sok Mitt",
    "Username": "sokmitt",
    "Email": "sokmitt@example.com",
    "Password": "password1",
    "Gender": "Male",
    "UserType": "STUDENT",
    "DateOfBirth": "2000-05-09T17:00:00.000Z",
    "PlaceOfBirth": "Phnom Penh",
    "Address": "123 St, Cambodia",
    "PhoneNumber": "85596496668",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": null,
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-02T09:45:42.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[]",
    "Permissions": "[]",
    "Groups": "[]"
  },
  {
    "UserId": 109,
    "UserCode": "U0031",
    "Name": "David Kim",
    "NameEnglish": "David Kim",
    "Username": "davidkim",
    "Email": "david@example.com",
    "Password": "password3",
    "Gender": "Male",
    "UserType": "SYSTEM",
    "DateOfBirth": "1988-12-21T17:00:00.000Z",
    "PlaceOfBirth": "USA",
    "Address": "789 St, USA",
    "PhoneNumber": "85582461403",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": null,
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-02T09:45:42.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[]",
    "Permissions": "[]",
    "Groups": "[]"
  },
  {
    "UserId": 110,
    "UserCode": "U0041",
    "Name": "Chan Dara",
    "NameEnglish": "Chan Dara",
    "Username": "chandara",
    "Email": "dara@example.com",
    "Password": "password4",
    "Gender": "Male",
    "UserType": "STUDENT",
    "DateOfBirth": "2002-02-19T17:00:00.000Z",
    "PlaceOfBirth": "Kampong Cham",
    "Address": "111 St, Cambodia",
    "PhoneNumber": "85522817014",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": null,
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-02T09:45:42.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[]",
    "Permissions": "[]",
    "Groups": "[]"
  },
  {
    "UserId": 112,
    "UserCode": "U0061",
    "Name": "Bopha Heng",
    "NameEnglish": "Bopha Heng",
    "Username": "bophaheng",
    "Email": "bopha@example.com",
    "Password": "password6",
    "Gender": "Female",
    "UserType": "SYSTEM",
    "DateOfBirth": "1991-06-24T17:00:00.000Z",
    "PlaceOfBirth": "Takeo",
    "Address": "333 St, Cambodia",
    "PhoneNumber": "85536700862",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": null,
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-02T09:45:42.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[\"Viewer\"]",
    "Permissions": "[\"View Dashboard\", \"Create, Update, Delete View\"]",
    "Groups": "[]"
  },
  {
    "UserId": 113,
    "UserCode": "U0071",
    "Name": "Alex Smith",
    "NameEnglish": "Alex Smith",
    "Username": "alexsmith",
    "Email": "alex@example.com",
    "Password": "password7",
    "Gender": "Male",
    "UserType": "SYSTEM",
    "DateOfBirth": "1985-04-17T17:00:00.000Z",
    "PlaceOfBirth": "Australia",
    "Address": "444 St, Australia",
    "PhoneNumber": "85515053273",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": null,
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-02T09:45:42.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[\"Admin\"]",
    "Permissions": "[\"Manage Users\", \"Edit Content\", \"Delete Content\", \"Create, Update, Delete View\"]",
    "Groups": "[]"
  },
  {
    "UserId": 116,
    "UserCode": "U0101",
    "Name": "Emily Johnson",
    "NameEnglish": "Emily Johnson",
    "Username": "emilyj",
    "Email": "emily@example.com",
    "Password": "password10",
    "Gender": "Female",
    "UserType": "SYSTEM",
    "DateOfBirth": "1980-01-04T17:00:00.000Z",
    "PlaceOfBirth": "Canada",
    "Address": "777 St, Canada",
    "PhoneNumber": "85545163783",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": null,
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-02T09:45:42.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[\"Admin\"]",
    "Permissions": "[\"Manage Users\", \"Edit Content\", \"Delete Content\", \"Create, Update, Delete View\"]",
    "Groups": "[]"
  },
  {
    "UserId": 139,
    "UserCode": "USR001",
    "Name": "សួស សុភាព",
    "NameEnglish": "SOURS SOPHEAP",
    "Username": "sopheapsours",
    "Email": "sopheapsours@gmail.com",
    "Password": "$2b$10$gKW9AwQpvhpqQIZCGhk4MORwXpqaHjqsmMXT3cH1ZZCeO9Y0MuxCi",
    "Gender": "Female",
    "UserType": "SYSTEM",
    "DateOfBirth": "2003-05-14T17:00:00.000Z",
    "PlaceOfBirth": "Phnom Penh",
    "Address": "Street 123, Phnom Penh, Cambodia",
    "PhoneNumber": "85580659100",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": "2025-03-21T04:19:19.000Z",
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-16T10:58:13.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[]",
    "Permissions": "[]",
    "Groups": "[]"
  },
  {
    "UserId": 140,
    "UserCode": "USR002",
    "Name": "សាខន ម៉ូនីកា",
    "NameEnglish": "SAKHAN MONIKA",
    "Username": "nikamall",
    "Email": "sakhanmonika@gmail.com",
    "Password": "$2b$10$vUBDJ6vGAm5mEZCCiw.GoOJ5lbqkRwLg41ShrJTLERHTYSCRakJPu",
    "Gender": "Female",
    "UserType": "SYSTEM",
    "DateOfBirth": "2002-08-19T17:00:00.000Z",
    "PlaceOfBirth": "Siem Reap",
    "Address": "Street 456, Siem Reap, Cambodia",
    "PhoneNumber": "85577804152",
    "LogonStatus": 1,
    "UserActive": 1,
    "LastLogin": "2025-03-21T05:00:05.000Z",
    "CreatedBy": "riththydragon",
    "CreatedAt": "2025-03-16T11:00:07.000Z",
    "UpdatedBy": "sopheapsours",
    "UpdatedAt": null,
    "Roles": "[]",
    "Permissions": "[]",
    "Groups": "[]"
  }
])

definePageMeta({ layout: 'layout', middleware: 'auth' })
</script>
