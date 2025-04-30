<template>
    <RTModal v-if="isModalOpen" :show="isModalOpen" :mode="modalMode" :message="confirmMessage" :modalTitle="modalMode"
        actionLabel="Save" :actionButtons="[
            { label: 'Cancel', event: 'close', class: 'bg-gray-500 text-white' },
            { label: 'Delete', event: 'delete', class: 'bg-red-500 text-white' },
            { label: 'Save', event: 'save', class: 'bg-green-500 text-white' }
        ]" :hideFooter="false" :width="'90vw'" :height="'95vh'" :disabled="true" :data="modalData" @close="closeModal"
        @submit="handleSubmit" @confirm="handleConfirm" @delete="handleDelete" @save="handleSave">
        <template #default="{ data }">
            <div class="shadow-md">
                <header class="w-full items-center">
                    <div class="text-center mb-6 w-full flex justify-end">
                        <div>
                            <h1 class="text-lg font-bold khmer-moul">{{ $t('kingdom_of_cambodia')}}</h1>
                            <h1 class="text-gray-600">{{ $t('nation_religion_king')}}</h1>
                        </div>
                    </div>
                    <div class="text-center mb-6 w-full flex justify-start">
                        <div>
                            <h1 class="text-lg font-bold">{{ $t('moeys')}}</h1>
                            <h1 class="text-gray-600">{{ $t('school') }} {{ $t('school_name') }}</h1>
                        </div>
                    </div>
                </header>

                    <!-- Header Section -->
                <div class="text-center border-b pb-4">
                    <h1 class="text-lg font-bold">តារាងសម្រង់ម៉ោងបង្រៀនសម្រាប់ខែ កុម្ភៈ ឆ្នាំ២០២៥</h1>
                </div>
                <div class="form-card">
                    <div class="card-header">
                        <h3 class="card-title">{{ $t('professor_information') }}</h3>
                    </div>
                    <div class="form-column">
          </div>
                    <div class="card-body grid grid-cols-1 md:grid-cols-3 gap-6">
                        <!-- Column 1 - Personal Information -->
                        <div class="form-column">
                        <h4 class="column-title">{{ $t('personal_info') }}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">{{ $t('professor') }}</label>
                            <UInput 
                            v-model="formData.studentName" 
                            :placeholder="$t('enter_professor_name')"
                            icon="i-heroicons-user-circle"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('degree_level') }}</label>
                            <USelect
                            v-model="formData.gender"
                            :options="degreeLevels"
                            :placeholder="$t('select_degree')"
                            icon="i-heroicons-academic-cap"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('subject_taught') }}</label>
                            <UInput 
                            v-model="formData.age" 
                            :placeholder="$t('enter_subject')"
                            icon="i-heroicons-book-open"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('batch') }}</label>
                            <UInput 
                            v-model="formData.batch" 
                            :placeholder="$t('enter_batch')"
                            icon="i-heroicons-calendar"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('classroom') }}</label>
                            <UInput 
                            v-model="formData.classroom" 
                            :placeholder="$t('enter_classroom')"
                            icon="i-heroicons-home"
                            class="form-input"
                            />
                        </div>
                        </div>

                        <!-- Column 2 - Contact & Academic -->
                        <div class="form-column">
                        <h4 class="column-title">{{ $t('contact_academic') }}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">{{ $t('phone_number') }}</label>
                            <UInput 
                            v-model="formData.phoneNumber" 
                            :placeholder="$t('enter_phone')"
                            icon="i-heroicons-phone"
                            class="form-input"
                            type="tel"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('specialization') }}</label>
                            <UInput 
                            v-model="formData.specialization" 
                            :placeholder="$t('enter_specialization')"
                            icon="i-heroicons-light-bulb"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('semester') }}</label>
                            <USelect
                            v-model="formData.semester"
                            :options="semesterOptions"
                            :placeholder="$t('select_semester')"
                            icon="i-heroicons-calendar-days"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('group') }}</label>
                            <UInput 
                            v-model="formData.group" 
                            :placeholder="$t('enter_group')"
                            icon="i-heroicons-user-group"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('teaching_days') }}</label>
                            <UInput 
                            v-model="formData.teachingDays" 
                            :placeholder="$t('enter_days')"
                            icon="i-heroicons-calendar"
                            class="form-input"
                            />
                        </div>
                        </div>

                        <!-- Column 3 - Statistics & Details -->
                        <div class="form-column">
                        <h4 class="column-title">{{ $t('statistics_details') }}</h4>
                        
                        <div class="form-group">
                            <label class="form-label">{{ $t('date_of_birth') }}</label>
                            <UInput 
                            v-model="formData.dateOfBirth" 
                            type="date"
                            icon="i-heroicons-cake"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('graduation_year') }}</label>
                            <UInput 
                            v-model="formData.graduationYear" 
                            :placeholder="$t('enter_year')"
                            icon="i-heroicons-graduation-cap"
                            class="form-input"
                            type="number"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('academic_year') }}</label>
                            <UInput 
                            v-model="formData.academicYear" 
                            :placeholder="$t('enter_academic_year')"
                            icon="i-heroicons-calendar"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('major') }}</label>
                            <UInput 
                            v-model="formData.major"
                            :placeholder="$t('enter_major')"
                            icon="i-heroicons-pencil-square"
                            class="form-input"
                            />
                        </div>

                        <div class="form-group">
                            <label class="form-label">{{ $t('hour') }}</label>
                            <UInput 
                            v-model="formData.hour" 
                            :placeholder="$t('enter_hours')"
                            icon="i-heroicons-clock"
                            class="form-input"
                            type="number"
                            />
                        </div>
                        </div>
                    </div>

                    <!-- Form Actions -->
                    <div class="card-footer">
                        <UButton color="gray" variant="ghost" @click="resetForm">
                        {{ $t('reset') }}
                        </UButton>
                        <UButton color="primary" @click="submitForm">
                        {{ $t('save_information') }}
                        </UButton>
                    </div>
                    </div>

                <div class="p-6  mx-auto rounded-lg ">

                    <!-- Table -->
                    <div class="mt-6">
                        <table class="w-full border-collapse border text-sm">
                            <thead>
                                <tr class="text-[12px] text-left">
                                    <th class="border p-2">{{$t('no_num')}}</th>
                                    <th class="border p-2">{{$t('teaching_day')}}</th>
                                    <th class="border p-2">{{$t('lesson_content')}}</th>
                                    <th class="border p-2">{{$t('times')}}</th>
                                    <th class="border p-2">{{$t('hours')}}</th>
                                    <th class="border p-2">{{$t('duration')}}</th>
                                    <th class="border p-2">{{$t('attendance')}}</th>
                                    <th class="border p-2">{{$t('other')}}</th>
                                    <th class="border p-2"><div class="cursor-pointer"><i class="ri-file-add-line" @click="addRow"></i></div></th>
                                </tr>
                            </thead>
                            <tbody class="text-[14px]">
                                <tr v-for="(record ,index) in formData?.records" :key="index">
                                    <td class="border p-2 text-center">{{ index+1 }}</td>
                                    <td class="border p-2">{{ rtydate(record.teachDate).format('MMM dd, yyyy') }}</td>
                                    <td class="border p-2">{{ record.subjectContent }}</td>
                                    <td class="border p-2 text-center">{{ record.times }}</td>
                                    <td class="border p-2 text-center">{{ record.hours }}</td>
                                    <td class="border p-2 text-center">{{ record.timeLength }}</td>
                                    <td class="border p-2 text-center">{{ record.attendance }}</td>
                                    <td class="border p-2 text-center">{{ record.other }}</td>
                                    <td class="border p-2 text-center"><div class="cursor-pointer" @click="deleteRecord(index)"><i class="ri-delete-bin-3-line "></i></div></td>
                                </tr>                                           
                            </tbody>
                        </table>
                    </div>
                    <!-- Total Hours -->
                    <div>
                        <div class="mt-4 text-right ">
                            TOTAL HOURS IN THE MONTH: {{ formData.totalHours }}
                        </div>
                        <div class="mt-4 text-left ">
                            TOTAL HOURS IN THE MONTH: {{ formData.totalHours }}
                        </div>
                        <div class="flex justify-end">
                            <div class="mt-4 justify-between flex flex-col">
                                <p>{{ $t('phone_penh_capital') }} ...../....../......</p>
                                <p>{{ $t('professor') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                  <!-- Teaching Records Table -->
    <UCard>
      <UTable 
        :rows="formData.records"
        :columns="[
          { key: 'noi', label: $t('no_num') },
          { key: 'teachDate', label: $t('teaching_day') },
          { key: 'subjectContent', label: $t('lesson_content') },
          { key: 'times', label: $t('times') },
          { key: 'hours', label: $t('hours') },
          { key: 'timeLength', label: $t('duration') },
          { key: 'attendance', label: $t('attendance') },
          { key: 'other', label: $t('other') },
          { key: 'actions', label: '' }
        ]"
      >
      
        <template #no-data>
          <div class="py-8 text-center text-gray-500">
            No teaching records found
          </div>
        </template>
        <template #teachDate-data="{row}">
          <div class="py-8 text-center text-gray-500">
            {{rtydate(row.teachDate).format('MMM dd, yyyy')}}
          </div>
        </template>

        <template #no-header>
          <div class="flex justify-end">
            <UButton 
              icon="i-heroicons-plus"
              size="sm"
              @click="addRow"
            >
              Add Record
            </UButton>
          </div>
        </template>

        <template #noi-data="{ row, index }">
          <td class="text-center">{{ index + 1 }}</td>
        </template>

        <template #actions-data="{ row, index }">
          <UButton 
            icon="i-heroicons-trash"
            color="red"
            variant="ghost"
            size="xs"
            @click="deleteRecord(index)"
          />
        </template>
      </UTable>
      <!-- Total Hours -->
      <div class="mt-6 grid grid-cols-2 gap-4">
        <div class="text-right">
          <p class="font-medium">TOTAL HOURS IN THE MONTH: {{ formData.totalHours }}</p>
        </div>
        <div class="text-left">
          <p class="font-medium">TOTAL HOURS IN THE MONTH: {{ formData.totalHours }}</p>
        </div>
      </div>

      <!-- Signature -->
      <div class="mt-8 flex justify-end">
        <div class="text-right">
          <p>{{ $t('phone_penh_capital') }} ...../....../......</p>
          <p class="mt-4 font-medium">{{ $t('professor') }}</p>
        </div>
      </div>
    </UCard>
            </div>

            <div class="p-4 border rounded-lg bg-white dark:bg-gray-800 dark:text-white">
                <!-- Note Section -->
                <p class="font-semibold text-red-600">{{ tBy({ en: "Note", km: "ចំណាំ" }) }}</p>
                <ul class="text-red-500 space-y-1">
                <li>✔ {{ tBy({ en: "Verify your entry!", km: "ផ្ទៀងផ្ទាត់ការបញ្ចូលរបស់អ្នក!" }) }}</li>
                <li>✔ {{ tBy({ en: "You cannot update the date after authorization or payment.", km: "អ្នកមិនអាចធ្វើបច្ចុប្បន្នភាពកាលបរិច្ឆេទបន្ទាប់ពីបានអនុញ្ញាត ឬបង់ប្រាក់។" }) }}</li>
                <li>✔ {{ tBy({ en: "Submit your entry only after completing all records.", km: "សូមដាក់បញ្ចូលបន្ទាប់ពីអ្នកបានបញ្ចប់កំណត់ត្រាទាំងអស់។" }) }}</li>
                <li>✔ {{ tBy({ en: "Teaching session cannot exceed 30!", km: "វគ្គបង្រៀនមិនអាចលើសពី 30!" }) }}</li>
                </ul>

                <!-- Grand Total -->
                <p class="text-amber-600 text-lg font-bold mt-4">
                {{ tBy({ en: "Grand total teaching hours", km: "ចំនួនម៉ោងបង្រៀនសរុប" }) }} 45/45
                </p>

                <!-- Color Notes -->
                <p class="text-gray-700 dark:text-gray-300 mt-6 font-medium">...{{ tBy({ en: "Color Note", km: "ចំណាំពណ៌" }) }}</p>
                <p class="pl-4 text-gray-600 dark:text-gray-400">.{{ tBy({ en: "Detail", km: "លម្អិត" }) }}</p>

                <ul class="space-y-1">
                <li class="text-blue-600">.Blue: {{ tBy({ en: "Submitted", km: "បានដាក់បញ្ចូល" }) }}</li>
                <li class="text-cyan-600">.Cyan: {{ tBy({ en: "Accepted", km: "បានទទួលយក" }) }}</li>
                <li class="text-red-600">.Red: {{ tBy({ en: "Rejected", km: "ត្រូវបានបដិសេធ" }) }}</li>
                </ul>
            </div>
        </template>

        <template #footer >
            <div class="flex gap-2">
                <button @click="closeModal" class="bg-red-500 text-white px-4 py-2 ml-2 rounded">{{ $t('close')}}</button>
                <button @click="customAction" class="bg-green-500 text-white px-4 py-2 rounded">{{ $t('print') }}</button>
                <button @click="handleSave" class="bg-blue-500 text-white px-4 py-2 rounded-md">Save</button>
            </div>
        </template>
    </RTModal>
</template>

<script setup>

import {ref, computed,onMounted } from 'vue';
const toast = useToast()
const dateNow = ref(new Date())
defineProps({
    isModalOpen: Boolean,
    modalMode: String,
    modalData: Object,
    confirmMessage: String,
});

const startDate = ref(new Date().toISOString().split('T')[0])
const endDate = ref(new Date().toISOString().split('T')[0])
  //const professorId = 1; // Example
  // const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  // const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

const summaryData = ref({})

const emit = defineEmits(["close", "submit", "confirm"]);

// Methods for handling events
const closeModal = () => emit("close");
const handleSubmit = () => emit("submit", modalData);
const handleConfirm = () => emit("confirm", modalData);

// Data Model
const tableData = ref([]);
const editedRows = ref(new Set());
// Add New Row

  console.log(startDate)
  console.log(endDate)

import { useProfessorTeaching } from '~/composables/useTimeRecord';

const { createTeachingRecord, updateTeachingRecord, deleteTeachingRecord } = useProfessorTeaching();

// Form data
const formData = ref({
  professorId: null,
  professorName: '',
  degreeLevel: '',
  subjectTaught: '',
  batch: '',
  classroom: '',
  phoneNumber: '',
  specialization: '',
  semester: '',
  group: '',
  teachingDays: '',
  dateOfBirth: '',
  graduationYear: '',
  academicYear: '',
  major: '',
  hour: '',
  records: [],
  totalHours: 0
});

// Options
const degreeLevels = ref(['Bachelor', 'Master', 'PhD', 'Professor']);
const semesterOptions = ref(['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4']);
const currentMonth = ref(new Date().toLocaleString('default', { month: 'long', year: 'numeric' }));

const fetchTeachingSummary = async () => {
      try {
        const { data, error } = await useHttp('/api/time_record/summary', {
            method:"POST",
          data: {
            ProfessorId:null,
            // StartDate:startDate.value,
            // EndDate:endDate.value,
            StartDate:'',
            EndDate:''
          }
        });

    console.log("999999999999", data.professor)
    console.log("eeeeeeeeeeeeeeee",data)

        if (error) {
          throw createError({
            statusCode: error.statusCode,
            statusMessage: error.data?.message || 'Failed to fetch teaching summary'
          });
        }

    formData.value = {
      ...formData.value,
      professorId: data.professor.ID,
      professorName: data.professor.NAME,
      degreeLevel: data.professor.DEGREE_LEVEL,
      phoneNumber: data.professor.PHONE_NUMBER,
      specialization: data.professor.SPECIALIZATION,
      graduationYear: data.professor.GRADUATION_YEAR,
      dateOfBirth: data.professor.DATE_OF_BIRTH,
      records: data.records.map(record => ({
        id: record.ID,
        teachDate: record.TEACHING_DATE,
        subjectContent: record.LESSON_CONTENT,
        times: record.TIMES,
        hours: record.HOURS,
        timeLength: record.DURATION,
        attendance: record.ATTENDANCE,
        other: record.NOTES
      })),
      totalHours: data.summary.totalHours
    };
        return data.value;
      } catch (error) {
        console.log('Error fetching teaching summary:', error);
        throw error;
      }
    };
  
// Fetch data on mount
onMounted(async () => {
  // In a real app, you would get the professorId from route params or user session
  //const professorId = 1; // Example
  // const startDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const endDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];
  await fetchTeachingSummary();
  // try {
  //   const data = await fetchTeachingSummary(professorId, startDate, endDate=null);
  //   console.log("FFFFFFFFFFFFFFFFFF", data)
    
  //   formData.value = {
  //     ...formData.value,
  //     professorId: data.professor.ID,
  //     professorName: data.professor.NAME,
  //     degreeLevel: data.professor.DEGREE_LEVEL,
  //     phoneNumber: data.professor.PHONE_NUMBER,
  //     specialization: data.professor.SPECIALIZATION,
  //     graduationYear: data.professor.GRADUATION_YEAR,
  //     dateOfBirth: data.professor.DATE_OF_BIRTH,
  //     records: data.records.map(record => ({
  //       id: record.ID,
  //       teachDate: record.TEACHING_DATE,
  //       subjectContent: record.LESSON_CONTENT,
  //       times: record.TIMES,
  //       hours: record.HOURS,
  //       timeLength: record.DURATION,
  //       attendance: record.ATTENDANCE,
  //       other: record.NOTES
  //     })),
  //     totalHours: data.summary.totalHours
  //   };
  // } catch (error) {
  //   console.log('Error initializing form:', error);
  // }
});

// Add new record
const addRow = () => {
  formData.value.records.push({
    teachDate: new Date().toISOString().split('T')[0],
    subjectContent: '',
    times: 1,
    hours: 0,
    timeLength: '',
    attendance: '',
    other: ''
  });
};

// Delete record
const deleteRecord = async (index) => {
  const record = formData.value.records[index];
  if (record.id) {
    try {
      await deleteTeachingRecord(record.id);
      formData.value.records.splice(index, 1);
      useToast().add({
        title: 'Success',
        description: 'Record deleted successfully',
        icon: 'i-heroicons-check-circle',
        color: 'green'
      });
    } catch (error) {
      useToast().add({
        title: 'Error',
        description: 'Failed to delete record',
        icon: 'i-heroicons-exclamation-circle',
        color: 'red'
      });
    }
  } else {
    formData.value.records.splice(index, 1);
  }
};

// Save all records
const submitForm = async () => {
  try {
    for (const record of formData.value.records) {
      const recordData = {
        CLASS_ID: 1, // Should come from form
        SUBJECT_ID: 1, // Should come from form
        TEACHING_DATE: record.teachDate,
        LESSON_CONTENT: record.subjectContent,
        TIMES: record.times,
        HOURS: record.hours,
        DURATION: record.timeLength,
        ATTENDANCE: record.attendance,
        NOTES: record.other
      };

      if (record.id) {
        await updateTeachingRecord(record.id, recordData);
      } else {
        const result = await createTeachingRecord(formData.value.professorId, recordData);
        record.id = result.data.recordId;
      }
    }

    useToast().add({
      title: 'Success',
      description: 'All records saved successfully',
      icon: 'i-heroicons-check-circle',
      color: 'green'
    });
  } catch (error) {
    useToast().add({
      title: 'Error',
      description: 'Failed to save records',
      icon: 'i-heroicons-exclamation-circle',
      color: 'red'
    });
  }
};

// Reset form
const resetForm = () => {
  formData.value.records = [];
  formData.value.totalHours = 0;
};


// Fetch Data from API on Load
const fetchTeachings = async () => {
    try {
        const {data} = await useHttp("/api/teachings/list");
        tableData.value = data.map(item => ({
            id: item.Id,
            subject: item.Subject,
            room: item.Room,
            date: item.Date,
            time: item.Time,
            students: item.Students,
            assistants: item.Assistants,
            isEditing: false
        }));
    } catch (error) {
        console.log("Error fetching data:", error);
    }
};

// Add New Row
const addRow11 = () => {
    tableData.value.push({
        id: null, subject: '', room: '', date: '', time: '', students: '', assistants: '', isEditing: true
    });
};

// Format Date as "MMM dd, yyyy"
const formattedDate = computed(() => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  }).format(dateNow.value);
});
// Local data
const formData11 = ref({
  studentName: "",
  teachDate: "សិស្សឈ្មោះ",
  timeLength: "សិស្សឈ្មោះ",
  subjectContent: "សិស្សឈ្មោះ",
  times: "សិស្សឈ្មោះ",
  hours: "សិស្សឈ្មោះ",
  other: "",
  period: "",
  duration: "",
  classCode: "",
  onlinePercentage: "",
  totalHours: "9:00h",
  gender: '',
  age: '',
  batch: '',
  classroom: '',
  studentsInList: '',
  onlineStudent: '',
  phoneNumber: '',
  specialization: '',
  semester: '',
  group: '',
  teachingDays: '',
  studentsAttendance: '',
  guardianName: '',
  dateOfBirth: '',
  graduationYear: '',
  academicYear: '',
  major: '',
  hour: '',
  droppedStudents: '',
  classCode: '',
  records: [
    {
      id: 1,
      teachDate: "Feb 12, 2025",
      subjectContent: "ប្រវត្តិនារីមេត្រី បេបសាយ",
      times: "25-26",
      hours: "1-3",
      timeLength: "3h",
      attendance: "3",
      other: "ល្អ",
    },
    {
      id: 1,
      teachDate: "Feb 12, 2025",
      subjectContent: "ប្រវត្តិនារីមេត្រី បេបសាយ",
      times: "25-26",
      hours: "1-3",
      timeLength: "3h",
      attendance: "3",
      other: "ល្អ",
    },
    {
      id: 1,
      teachDate: "Feb 12, 2025",
      subjectContent: "ប្រវត្តិនារីមេត្រី បេបសាយ",
      times: "25-26",
      hours: "1-3",
      timeLength: "3h",
      attendance: "3",
      other: "ល្អ",
    },
    {
      id: 1,
      teachDate: "Feb 12, 2025",
      subjectContent: "ប្រវត្តិនារីមេត្រី បេបសាយ",
      times: "25-26",
      hours: "1-3",
      timeLength: "3h",
      attendance: "3",
      other: "ល្អ",
    },
    {
      id: 1,
      teachDate: "Feb 12, 2025",
      subjectContent: "ប្រវត្តិនារីមេត្រី បេបសាយ",
      times: "25-26",
      hours: "1-3",
      timeLength: "3h",
      attendance: "3",
      other: "ល្អ",
    },
    {
      id: 1,
      teachDate: "Feb 12, 2025",
      subjectContent: "ប្រវត្តិនារីមេត្រី បេបសាយ",
      times: "25-26",
      hours: "1-3",
      timeLength: "3h",
      attendance: "3",
      other: "ល្អ",
    },
  ],
});

// const deleteRecord = (id) => {
//   formData.value?.records = formData.value?.records.filter(record => record.id !== id);
// };
// const deleteRecord = (id) => {
//   if (formData.value && formData.value.records) {
//     formData.value.records = formData.value.records.filter(record => record.id !== id);
//   }
// };

const deleteRecord11 = (index) => {
  if (formData.value && formData.value.records) {
    formData.value.records.splice(index, 1);
  }
};
const formData1 = ref({
  studentName: "",
  gender: "",
  age: "",
  school: "",
  guardianName: "",
  phoneNumber: "",
  address: "",
  remarks: "",
});
// // Track Edited Rows
// const markAsEdited = (row) => {
//   editedRows.value.add(row);
// };
// const handleSave = async () => {
//   try {
//     // Sending the form data to the API endpoint
//     const response = await fetch('https://your-api-endpoint.com/save', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json', // Set the content type to JSON
//       },
//       body: JSON.stringify(formData.value), // Sending the form data as JSON
//     });

//     if (!response.ok) {
//       throw new Error('Failed to save data');
//     }

//     const result = await response.json(); // Parsing the response from the API
//     console.log('Data saved successfully:', result);

//     // Optionally, show an alert or perform some action after saving
//     alert('Form data saved successfully!');
//   } catch (error) {
//     console.log('Error saving form data:', error);
//     alert('Error saving data!');
//   }
// };

import axios from 'axios';

const handleSave = async () => {
  try {
    // Sending the form data to the API using axios
    const response = await axios.post('https://your-api-endpoint.com/save', formData.value);

    console.log('Data saved successfully:', response.data);

    // Optionally, show an alert or perform some action after saving
    alert('Form data saved successfully!');
  } catch (error) {
    console.log('Error saving form data:', error);
    alert('Error saving data!');
  }
};


// Save or Update Data
const saveData = async (row, index) => {
    try {
        const apiUrl = row.id
            ? `http://localhost:5643/api/teaching/update/${row.id}`
            : "http://localhost:5643/api/teaching/create";

        const method = row.id ? "PUT" : "POST";

        const res = await fetch(apiUrl, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(row),
        });

        const data = await res.json();
        console.log(data.Message);
        toast.add({ color: 'red', title: data.Message })

        row.isEditing = false;
        if (!row.id) {
            await fetchTeachings(); // Refresh Data After Adding
        }
    } catch (error) {
        console.log("Error:", error);
    }
};

// Save All Edited Data
const saveAllData = async () => {
    if (editedRows.value.size === 0) return;

    try {
        const dataToSave = Array.from(editedRows.value);

        const res = await fetch("http://localhost:5643/api/teaching/update_all", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dataToSave),
        });

        const data = await res.json();
        console.log(data.message);

        // Reset editing state
        editedRows.value.clear();
        fetchTeachings();
    } catch (error) {
        console.log("Error saving all:", error);
    }
};

// Toggle Edit Mode
const editRow = (row) => {
    row.isEditing = true;
};

// Load Data on Component Mount
onMounted(fetchTeachings);
definePageMeta({ layout: 'layout', middleware: ['auth'], role: "teacher" });

</script>
<style lang="scss" scoped>

.form-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.card-header {
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.card-body {
  padding: 1.5rem;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.column-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  border-radius:2px
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.form-input {
  width: 100%;
  border-radius:10px
  input{
    padding:4px
  }
}

.card-footer {
  padding: 1.25rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Dark mode support */
.dark .form-card {
  background: #1f2937;
  border-color: #374151;
}

.dark .card-header,
.dark .card-footer {
  background: #111827;
  border-color: #374151;
}

.dark .card-title {
  color: #f9fafb;
}

.dark .column-title {
  color: #d1d5db;
  border-color: #374151;
}

.dark .form-label {
  color: #9ca3af;
}
// /* Base styles */
// .form-card {
//   background: var(--card-bg);
//   border-radius: 12px;
//   box-shadow: var(--shadow-sm);
//   overflow: hidden;
// }

// .card-header {
//   padding: 1.25rem 1.5rem;
//   background: var(--card-header-bg);
//   border-bottom: 1px solid var(--border-color);
// }

// .card-title {
//   font-size: 1.25rem;
//   font-weight: 600;
//   color: var(--text-primary);
// }

// .card-body {
//   padding: 1.5rem;
// }

// .form-column {
//   display: flex;
//   flex-direction: column;
//   gap: 1.25rem;
// }

// .column-title {
//   font-size: 1rem;
//   font-weight: 600;
//   color: var(--text-secondary);
//   margin-bottom: 0.25rem;
//   padding-bottom: 0.75rem;
//   border-bottom: 1px solid var(--border-color);
// }

// .form-group {
//   display: flex;
//   flex-direction: column;
//   gap: 0.5rem;
// }

// .form-label {
//   font-size: 0.875rem;
//   font-weight: 500;
//   color: var(--text-secondary);
// }

// /* Input styling */
// .input-container {
//   position: relative;
//   display: flex;
//   align-items: center;
// }

// .input-icon {
//   position: absolute;
//   left: 12px;
//   color: var(--text-tertiary);
//   font-size: 1.1rem;
// }

.styled-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background-color: var(--input-bg);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
  border: none;
  box-shadow: var(--input-shadow);
}

.styled-input:focus {
  outline: none;
  box-shadow: var(--input-focus-shadow);
}

.styled-input::placeholder {
  color: var(--text-tertiary);
}

select.styled-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

// /* Buttons */
// .card-footer {
//   padding: 1.25rem 1.5rem;
//   background: var(--card-header-bg);
//   border-top: 1px solid var(--border-color);
//   display: flex;
//   justify-content: flex-end;
//   gap: 0.75rem;
// }

// .btn-primary, .btn-secondary {
//   padding: 0.625rem 1.25rem;
//   border-radius: 8px;
//   font-weight: 500;
//   font-size: 0.875rem;
//   transition: all 0.2s ease;
//   border: none;
//   cursor: pointer;
// }

// .btn-primary {
//   background: var(--primary-bg);
//   color: var(--primary-text);
// }

// .btn-secondary {
//   background: var(--secondary-bg);
//   color: var(--secondary-text);
// }

/* Dark/Light mode variables */
:root {
  --card-bg: #ffffff;
  --card-header-bg: #f9fafb;
  --border-color: #e5e7eb;
  --text-primary: #111827;
  --text-secondary: #4b5563;
  --text-tertiary: #9ca3af;
  --input-bg: #f3f4f6;
  --input-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
  --input-focus-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  --primary-bg: #3b82f6;
  --primary-text: #ffffff;
  --secondary-bg: #f3f4f6;
  --secondary-text: #374151;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.dark {
  --card-bg: #1f2937;
  --card-header-bg: #111827;
  --border-color: #374151;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #6b7280;
  --input-bg: #374151;
  --input-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  --input-focus-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  --secondary-bg: #374151;
  --secondary-text: #e5e7eb;
}
table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    text-align: center;
}

input {
    width: 100%;
    padding: 5px;
}

button {
    margin-top: 10px;
    padding: 5px 10px;
}

table {
    width: 100%;
    border-collapse: collapse;
}

th,
td {
    padding: 10px;
    text-align: center;
}

input {
    width: 100%;
    padding: 5px;
}

button {
    margin-top: 10px;
    padding: 5px 10px;
}
ul li {
  list-style-type: none;
}
.form-header > div > div {
    white-space: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    /* display: inline-block; */
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    
    label{
        font-size: 14px;
    }
}
</style>

<!-- 
<RTYModal 
  :show="isModalOpen" 
  modalTitle="Custom Footer Modal"
  :hideFooter="true"
  @close="closeModal"
>
  <template #default>
    <p>Custom modal content...</p>
  </template>

  <template #footer>
    <button @click="customAction" class="bg-green-500 text-white px-4 py-2 rounded">Custom Action</button>
    <button @click="closeModal" class="bg-red-500 text-white px-4 py-2 ml-2 rounded">Close</button>
  </template>
</RTYModal> -->
