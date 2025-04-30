<template>
  <RModal v-model="isModalOpen" max-width="50vw" max-height="60vh" :modal-title="$t('student_score_entry')"
    :before-close="() => confirmBeforeClose()" :prevent-close="true" @cancel="handleCancel" @confirm="handleConfirm"  mode="view" @close="closeModal">
    <div class="w-full">
      <h2 class="text-2xl font-bold mb-4">{{ $t('student_score_record') }}</h2>

      <!-- Student Info -->
      <div class="flex items-center gap-3 mb-4">
        <RTYAvatar size="40" :gender="student?.StudentGender" :active="student?.StudentStatus" />
        <div>
          <p>{{ tBy({ en: student?.StudentNameEnglish, km: student?.StudentName }) }}</p>
          <p class="text-gray-500 text-sm">{{ student?.StudentCode }}</p>
        </div>
      </div>

      <RTYReloadBtn @click="reloadTable"/>
      <!-- Table -->
      <UProgress v-if="isLoading" size="xs" orientation="horizontal" color="neutral" />
      <table border="1" class="table-auto w-full">
        <thead>
          <tr>
            <th>{{ $t('subject') }}</th>
            <th>{{ $t('score') }}</th>
            <th>{{ $t('midterm') }}</th>
            <th>{{ $t('final') }}</th>
            <th>{{ $t('note') }}</th>
            <th>{{ $t('action') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index">
            <td class="px-6 py-4 whitespace-nowrap">
              <select v-model="row.CourseId" :disabled="!row.IsEditing" :required="row.IsEditing"
                @change="onCourseChange(row)" class="w-full p-2 border rounded">
                <option value="">{{ $t('select_course') }}</option>
                <option v-for="course in courseList" :key="course.Id" :value="course.Id">
                  {{ tBy({ en: course.Title, km: course.EnglishTitle }) }}
                </option>
              </select>
            </td>
            <td><input v-model="row.Score" type="number" :disabled="!row.IsEditing" /></td>
            <td><input v-model="row.Midterm" type="number" :disabled="!row.IsEditing" /></td>
            <td><input v-model="row.Final" type="number" :disabled="!row.IsEditing" /></td>
            <td><input v-model="row.Note" type="text" :disabled="!row.IsEditing" /></td>
            <td class="space-x-2">
              <div class="flex gap-2">
                <RTYTblBtn
                  :actions="row.IsEditing ? [
                    { label: 'save', type: 'save', icon: 'save', disabled: isDisabled, btnClass: 'bg-green-500 hover:bg-green-600' }
                  ] : [
                    { label: 'edit', type: 'edit', icon: 'edit', disabled: false, btnClass: 'bg-blue-500 hover:bg-blue-600' }
                  ]"
                  @onClick="() => row.IsEditing ? saveScore(row) : editRow(row)"
                />
                <RTYTblBtn
                  :actions="row.IsEditing ? [
                    { label: 'cancel', type: 'cancel', icon: 'cancel', disabled: false, btnClass: 'bg-gray-500 hover:bg-gray-600' }
                  ] : [
                    { label: 'delete', type: 'delete', icon: 'delete', disabled: !row.Id, btnClass: 'bg-red-500 hover:bg-red-600' }
                  ]"
                  @onClick="() => row.IsEditing ? cancelEdit(row) : actionDelete(row)"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-if="tableData?.length === 0" class="text-center text-gray-500 mt-4">
        {{ $t('no_scores_found') }}
      </p>
    </div>

    <template #footer>
      <RTYButtons :actions="buttonActions" />
    </template>
  </RModal>
</template>

<script setup>

import { ref, computed, watch, onMounted } from 'vue';
const { t } = useI18n(); // Make sure to import useI18n
const isModalOpen = defineModel();

const rowBackup = ref(null);
// Data
const searchQuery = ref('');
const isLoading = ref(false);
const courseList = ref([]);
const tableData = ref([]);
const editedRows = ref(new Set());
const originalData = ref(null); // Store original data for comparison
const props = defineProps({
  student: '',
  isOpen: {
    type: Boolean,
    default: false
  },
  initialScores: Array
});

const { confirm } = useConfirm(); // Make sure to import useConfirm
const { notify } = useNotification()
// Success notification
notify('Profile updated successfully!')
// Define your button actions configuration

const isDisabled = computed(() => !hasChanges.value || editedRows.value.size === 0)
// Button configuration
const buttonActions = computed(() => [
  { type: 'create', label: t('new_score'),  size: 'medium', disabled: false, onClick: addRow },
  { type: 'save', label: t('save_all'),  size: 'medium', loading:isLoading.value, disabled: isDisabled.value, onClick: saveAllData },
  { type: 'save', label: t('save_and_close'),  loading:isLoading.value ,size: 'medium', disabled: isDisabled.value, onClick: saveAndClose },
])

const isCreate = ref(true)
// Props access
const student = computed(() => props.student);

const studentData = computed(() => props.student)

// Emit + Modal state
const emit = defineEmits(['close']);

// Table editing
const addRow = () => {
  tableData.value?.push({
    Id: null,
    StudentId: studentData.value?.Id || null,
    SubjectId: null,
    ClassId: studentData.value?.ClassId || null,
    CourseId: studentData.value?.CourseId || null,
    AcademicId: studentData.value?.AcademicId || null,
    SemesterId: studentData.value?.SemesterId || null,
    Score: null,
    Midterm: null,
    Final: null,
    Ranking: null,
    IsNew: true,
    IsEditing: true,   // ✅ enable editing mode immediately
    ExamDate:null,
    Note: ''
  });
};

const hasChanges = computed(() => editedRows.value.size > 0);


const markAsEdited = (row) => {
  editedRows.value.add(row);
};

const editRow1 = (row) => {
  rowBackup.value = { ...row }; // optional: backup original in case of cancel
  row.IsEditing = true;
};

// Edit existing row
const editRow = (row) => {
  row.originalData = { ...row };
  editedRows.value.add(row); // Add to edited rows set
  row.IsEditing = true;
};


// Cancel editing
const cancelEdit = (row, index) => {
  if (row.IsNew) {
    tableData.value = tableData.value.filter(r => r !== row);
  } else {
    Object.assign(row, row.originalData);
    row.IsEditing = false;
    delete row.originalData;
  }
};

// / Save score to API
const saveScore = async (row, index) => {
  console.log("Save data --0000000-", { ...row, StudentId: studentData.value?.Id })
  try {
    const payload = {
      ...row,
      StudentId: studentData.value?.Id
    };
    console.log("Save data --====================-", payload)
    const { data } = await useHttp(
      row.Id ? '/api/student_score/update' : '/api/student_score/create',
      {
        method: 'POST',
        body: payload
      }
    );
    showNotification('Create successfully!')
    if (data) {
      Object.assign(row, {
        ...data.data,
        IsEditing: false,
        IsNew: false
      });
      delete row.originalData;
    }
    showNotification(row.Id ? 'Update successfully!' : 'Create successfully!')
    await reloadTable()
  } catch (error) {
    console.log('Error saving score:', error);
    showNotification(error?.message || 'Failed to save score')
  }
};

const saveAndClose = async () => {
  await saveAllData();
  await reloadTable()
  isModalOpen.value = false;
};

const saveAllData = async () => {
  console.log("Save all data 1111111111111", editedRows.value?.size)
  if (editedRows.value?.size === 0) {
    alert('No changes to save!');
    return;
  }
  console.log('Edited rows:', Array.from(editedRows.value));
  console.log('Edited rows size:', editedRows.value.size);

  if (editedRows.value.size === 0) return;

  try {
    isLoading.value = true; // Optional loading state

    const allData = Array.from(editedRows.value).map(row => ({
      Id: row.Id ?? null,
      StudentId: studentData.value?.Id || null,
      SubjectId: null,
      ClassId: studentData.value?.ClassId || null,
      CourseId: row.CourseId ?? null,
      AcademicId: studentData.value?.AcademicId || null,
      Score: row.Score != null ? Number(row.Score) : null,
      Midterm: row.Midterm != null ? Number(row.Midterm) : null,
      Final: row.Final != null ? Number(row.Final) : null,
      Ranking: row.Ranking ?? null,
      Note: row.Note ?? '',
      IsNew: true ?? false
    }));

    const dataToUpdate = allData.filter(item => item.Id); // Existing items
    const dataToCreate = allData.filter(item => !item.Id); // New items (no Id)

    console.log("Data to save all update all: ", dataToUpdate)
    console.log("Data to save all create all : ", dataToCreate)

    // Update existing records
    if (dataToUpdate.length > 0) {
      const { data, error } = await useHttp('/student_score/update_all', {
        method: 'POST',
        data: dataToUpdate
      });
      if (error) throw error;
    }


    // Create new records
    if (dataToCreate.length > 0) {
      const { data, error } = await useHttp('/student_score/create_all', {
        method: 'POST',
        data: dataToCreate
      });
      if (error) throw error;
    }

    console.log('All changes (create/update) saved successfully');
    editedRows.value.clear();
    await reloadTable();
  } catch (err) {
    console.log('Save all error:', err);
    alert(`Failed to save: ${err.message || 'Unknown error'}`);
  } finally {
    isLoading.value = false; // Reset loading state
  }
};

const validateBeforeSave = (row) => {
  if (row.Score === undefined || row.Score === null) {
    return 'Score is required';
  }
  if (isNaN(Number(row.Score))) {
    return 'Score must be a number';
  }
  if (row.CourseId) {
    return 'Course selection is required';
  }
  // Add
  return null;
};



// Data fetching //Draw data to table
const getStudentScoring = async () => {
  try {
    const { data, error } = await useHttp('/api/student_score/by_student', {
      method: 'POST',
      data: { StudentId: studentData.value?.Id }
    });

    if (error) {
      console.log('Student scoring fetch error:', error);
      return [];
    }

    console.log('Fetched scores ------------????????????:', data);

    tableData.value = data?.data?.map(item => ({
      Id: item.Id || null,
      StudentId: studentData.value?.Id || null,
      SubjectId: item.SubjectId > 0 ? item.SubjectId : studentData.value?.SubjectId || null,
      CourseId: item.CourseId > 0 ? item.CourseId : studentData.value?.CourseId || null,
      ClassId: studentData.value?.ClassId || null,
      SemesterId: item.SemesterId > 0 ? item.SemesterId : studentData.value?.SemesterId || null,
      AcademicId: item.AcademicId > 0 ? item.AcademicId : studentData.value?.AcademicId || null,
      Score: item.Score || null,
      Midterm: item.Midterm || null,
      Final: item.Final || null,
      Ranking: item.Ranking || null,
      IsEditing: false,
      Note: item.Note || ''
    })) || [];
    console.log("Course Data ---------------- ", studentData.value)
  } catch (err) {
    console.log('Teaching fetch error:', err);
    return [];
  }
};


const actionDelete = async (row, index) => {
  console.log("Delete row data  index -----: ", index)
  console.log("Delete row data  -----: ", row)

  const isConfirmed = await confirm({
    type: 'warning',
    title: t('do_you_want_to_delete_score_data_that_have_note', { value1: row.Score, value2: row.Note || '...' }),
    description: t('this_action_cannot_be_undone'), // Optional description
    confirmText: t('delete'), // Optional button text
  });

  if (isConfirmed) {
    try {
      const { data, error } = await useHttp('/api/student_score/delete', {
        method: 'GET',
        data: { Id: row?.Id }
      });

      if (data) {
        tableData.value = tableData.value.filter(item => item.Id !== row.Id);
        // tableData.value.splice(index, 1);
      } else {
        showNotification('Delete failed:')
      }
      showNotification('Delete successfully!')
      reloadTable()
    } catch (err) {
      console.log('Delete error:', err);
    }
  }

  // if (!confirm('Are you sure you want to delete this score?')) {

  // }
};

const reloadTable = async () => {
  try {
    isLoading.value = true
    await getStudentScoring();    // Your function that loads data from API
  } catch (error) {
    console.log("❌ Failed to reload scores:", error);
  } finally {
    isLoading.value = false;
  }
};


async function courseData() {
  try {
    const { data, error } = await useHttp('/api/course/list', { method: 'POST' });

    if (error) {
      console.log('❌ Error fetching courses:', error);
      return;
    }

    if (data) {
      courseList.value = data;
    } else {
      console.warn('⚠️ No courses returned from API.');
      course.value = [];
    }
  } catch (err) {
    console.log('❗Unexpected error fetching courses:', err);
  }
}

const closeModal = () => {
  searchQuery.value = '';
  emit('close');
};



const onCourseChange = (row) => {
  // Mark the row as edited if needed
  if (!editedRows.value.has(row)) {
    editedRows.value.add(row);
  }
};

const checkForUnsavedChanges = () => {
  if (editedRows.value.size > 0) {
    return confirm('You have unsaved changes. Really close?');
  }
  return true;
};

const notification = reactive({
  message: '',
  type: ''
})
const showNotification = (message, type = 'success') => {
  notification.message = message
  notification.type = type
  setTimeout(() => notification.message = '', 3000)
}

// showNotification(
//       error.response?.data?.message || 
//       error.message || 
//       'Upload failed. Please try again.',
//       'error'
//     );


onMounted(async () => {
  await courseData();
  await getStudentScoring();
});

// onMounted(async () => {
//   const { data } = await useHttp('/api/courses');
//   courseList.value = data;
// });

// Watch open modal to trigger data fetch
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    courseData();
    getStudentScoring();
  }
});

watch(studentData, () => {
  console.log("👨‍🎓 Student updated:", studentData.value)
}, { immediate: true })

// Watch for changes to student ID
watch(() => studentData.value?.Id, (newId) => {
  if (newId) getStudentScoring();
});


definePageMeta({
  middleware: ['auth'],
  role: 'teacher'
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/table.scss" as table;

select:required:invalid {
  color: gray;
}

table{
  overflow: visible
}
select option[value=""][disabled] {
  display: none;
  /* Hide the placeholder in dropdown */
}

select option {
  color: black;
  /* Regular options in black */
}
</style>
