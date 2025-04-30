<template>
    <RTModal v-if="isModalOpen" :show="isModalOpen" :mode="modalMode" :message="confirmMessage" :modalTitle="modalMode" :closeOnOverlayClick="false"
        actionLabel="Save" :actionButtons="[
            { label: $t('close'), event: 'close', class: 'bg-gray-500 text-white' },
            { label: $t('print'), event: 'delete', class: 'bg-red-500 text-white' },
            { label: $t('save'), event: 'save', class: 'bg-green-500 text-white' }
        ]" :hideFooter="false" :width="'90vw'" :height="'95vh'" :disabled="true" :data="modalData" @close="closeModal"
        @submit="handleSubmit" @confirm="handleConfirm" @delete="handleDelete" @save="handleSave">
        <template #default="{ data }">
            <header class="w-full items-center">
                <div class="text-center mb-6 w-full flex justify-end">
                    <div>
                        <h1 class="text-lg font-bold khmer-moul">{{ $t('kingdom_of_cambodia') }}</h1>
                        <h1 class="text-gray-600">{{ $t('nation_religion_king') }}</h1>
                    </div>
                </div>
                <div class="text-center mb-6 w-full flex justify-start">
                    <div>
                        <h1 class="text-lg font-bold">{{ $t('moeys') }}</h1>
                        <h1 class="text-gray-600">{{ $t('school') }} {{ $t('school_name') }}</h1>
                    </div>
                </div>
            </header>

            <div class="flex flex-col justify-center items-center">
                <div class="flex-1 gap-2 text-center items-center">
                    <div class="text-center pb-4">
                        <h1 class="text-lg font-bold">{{ $t('student_score_record_list') }}</h1>
                    </div>
                    <div class="flex gap-[20px] justify-center">
                        <div class="flex items-center ">
                            <h1>{{ $t('major') }} : Mojor</h1>
                        </div>
                        <div class="flex items-center">
                            <h1>{{ $t('subject') }} : Subject</h1>
                        </div>
                    </div>
                    <div class="flex gap-[20px]  justify-center">
                        <div class="flex items-center">
                            <h1>{{ $t('group') }} : Group</h1>
                        </div>
                        <div class="flex items-center">
                            <h1>{{ $t('batch') }} : Batch </h1>
                        </div>
                        <div class="flex items-center">
                            <h1>{{ $t('time') }} : Time</h1>
                        </div>
                    </div>
                    <div class="flex gap-[20px]  justify-center">
                        <div class="flex items-center">
                            <h1>{{ $t('academic_year') }} : Group</h1>
                        </div>
                        <div class="flex items-center">
                            <h1>{{ $t('semester') }} : Batch</h1>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex items-center justify-between pb-3">
                <button>{{ $t('goto_telegram_group') }}</button>
                <div class="flex gap-2 items-center">
                    <button  @click="exportStudentScores">{{ $t('export_as_excel') }}</button>
                    <button>{{ $t('import') }}</button>
                </div>
            </div>
            
            <RTYReloadBtn @click="reloadData()"/>
            <UProgress v-if="isLoading" size="xs" orientation="horizontal" color="neutral" />
            <table border="1" class="rty-table">
                <thead>
                    <tr>
                        <th>{{ $t('no_num') }}</th>
                        <th></th>
                        <th>{{ $t('name') }}</th>
                        <th>{{ $t('name_latin') }}</th>
                        <th>{{ $t('gender') }}</th>
                        <th>{{ $t('dob') }}</th>
                        <th>{{ $t('midterm') }}</th>
                        <th>{{ $t('final') }}</th>
                        <th>{{ $t('total') }}</th>
                        <th>{{ $t('note') }}</th>
                        <th>{{ $t('action') }}</th>
                    </tr>
                </thead>
                <tbody class="overflow-y-auto">
                    <tr v-for="(row, index) in studentScoreResult" :key="index">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <div class="flex items-center gap-2">
                                <RTYAvatar :src="row?.ImagePath || ''" size="30" :gender="row?.Gender" :active="row?.Status" />
                                <span class="color-sub-text">{{ row?.StudentCode }}</span>
                            </div>
                        </td>
                        <td>{{ row.StudentName }}</td>
                        <td>{{ row.StudentNameEnglish }}</td>
                        <td>{{ row.Gender }}</td>
                        <td>{{ rtydate(row.DOB).format() }}</td>
                        <td>{{ row.MidtermTotal }}</td>
                        <td>{{ row.FinalTotal }}</td>
                        <td>{{ row.OverallTotal }}</td>
                        <td>
                            {{
                                row.total > 50 ? 'A' :
                                row.total < 5 ? 'Failed' : row.total < 50 ? 'D' : 'Better' }} 
                            </td>
                        <td>
                            <RTYTblBtn :actions="btnAction" @onClick="(action) => recordScore(action, row)" />
                        </td>
                    </tr>
                </tbody>
            </table>

            <div class="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
                <p class="font-semibold">{{ tBy({ en: "Note:", km: "ចំណាំ:" }) }}</p>
                <ul class="list-disc pl-5 space-y-1">
                    <li>
                        <strong>{{ tBy({ en: "Verify your entry", km: "ផ្ទៀងផ្ទាត់ការបញ្ចូលរបស់អ្នក" }) }}</strong>
                    </li>
                    <li>
                        {{ tBy({
                            en: "After submitting the entry, you cannot update it.", km:
                                "បន្ទាប់ពីដាក់បញ្ចូលអ្នកមិនអាចធ្វើបច្ចុប្បន្នភាពបានទេ។"
                        }) }}
                    </li>
                    <li>
                        {{ tBy({
                            en: "Submit your entry only after you have completed all students.", km:
                                "សូមដាក់បញ្ចូលបន្ទាប់ពីអ្នកបានបញ្ចប់និស្សិតទាំងអស់។"
                        }) }}
                    </li>
                    <li>
                        <strong>{{ tBy({ en: "Importing Excel scores", km: "ការនាំចូលពិន្ទុ Excel" }) }}</strong>
                        {{ tBy({
                            en: "is only supported for Excel files exported from the list.",
                            km: "គាំទ្រតែឯកសារ Excel ដែលនាំចេញពីបញ្ជីប៉ុណ្ណោះ។"
                        })
                        }}
                    </li>
                </ul>
            </div>
            <div class="p-4">
                <h2 class="font-bold text-lg">{{ tBy({ en: "Note", km: "ចំណាំ" }) }}</h2>
                <ul class="list-disc pl-5">
                    <li>{{ tBy({ en: "Verify your entry!", km: "ផ្ទៀងផ្ទាត់ការបញ្ចូលរបស់អ្នក!" }) }}</li>
                    <li>{{ tBy({
                        en: "You cannot update after submission.", km:
                            "អ្នកមិនអាចធ្វើបច្ចុប្បន្នភាពបន្ទាប់ពីដាក់ស្នើបានទេ។"
                    }) }}</li>
                    <li>{{ tBy({
                        en: "Submit after all records are done.", km:
                            "ដាក់ស្នើបន្ទាប់ពីការកត់ត្រាទាំងអស់ត្រូវបានបញ្ចប់។"
                    }) }}</li>
                    <li>{{ tBy({ en: "Teaching session should not exceed 30!", km: "សម័យបង្រៀនមិនអាចលើសពី 30 បានទេ!" })
                    }}</li>
                </ul>

                <h3 class="mt-4 text-xl text-orange-600">
                    {{ tBy({ en: "Grand total teaching hours 45/45", km: "ម៉ោងបង្រៀនសរុប 45/45" }) }}
                </h3>

                <h4 class="mt-4 text-gray-600">{{ tBy({ en: "Color Note", km: "ចំណាំពណ៌" }) }}</h4>
                <ul>
                    <li class="text-blue-500">{{ tBy({ en: "Blue: Submitted", km: "ខៀវ: បានដាក់ស្នើ" }) }}</li>
                    <li class="text-cyan-500">{{ tBy({ en: "Cyan: Accepted", km: "ក្បៀស: អ្នកបានទទួល" }) }}</li>
                    <li class="text-red-500">{{ tBy({ en: "Red: Rejected", km: "ក្រហម: មិនទទួលយក" }) }}</li>
                </ul>
            </div>

        </template>
        <template #footer>
            <RTYButtons :actions="buttonActions" />
        </template>
    </RTModal>
    <SystemStudentScoreEntryScoreRecord v-if="isModalOpenScore" v-model="isModalOpenScore" :student="studentData" @close="closeModalScore" />
    <SystemStudentScoreEntryScoreDetail v-if="isModalOpenScoreDetail" v-model="isModalOpenScoreDetail" :student="studentData" @close="closeModalScoreDetail" />

</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
const { t } = useI18n()
const isModalOpenScore = ref(false);
const isModalOpenScoreDetail = ref(false);
const studentData = ref(null);
const isLoading = ref(false)

const toast = useToast()
defineProps({
    isModalOpen: Boolean,
    modalMode: String,
    modalData: Object,
    confirmMessage: String,
});

import { useExcelExport } from '~/composables/useExportExcel'

const { exportData } = useExcelExport()

const studentScoreResult = ref([]) // Your student data
const buttonActions = computed(() => [
  { type: 'close', label: t('close'), disabled: false, onClick: closeModal },
  { type: 'print', label: t('print'), loading:isLoading.value, onClick: printData },
  { type: 'save', label: t('save'),  loading:isLoading.value , onClick: saveData },
])

const printData = () => {
    console.log( "Print")
}

const saveData = () => {
    console.log( "Print")
}

const exportStudentScores = () => {
  if (studentScoreResult.value.length === 0) {
    alert('No data to export')
    return
  }
  
  exportData(studentScoreResult.value, 'student_scores_export')
}

// import { exportToExcel } from '~/utils/exportExcel'

// export const useExcelExport = () => {
//   const exportData = (data, fileName) => {
//     try {
//       // Transform data if needed
//       const exportData = data.map(item => ({
//         'Student ID': item.Id,
//         'Student Code': item.StudentCode,
//         'Name': item.Name,
//         'English Name': item.EnglishName,
//         'Gender': item.Gender,
//         'Date of Birth': item.DOB,
//         'Midterm Score': item.Midterm,
//         'Final Score': item.Final,
//         'Total Score': item.Total,
//         'Note': item.Note
//       }))
      
//       exportToExcel(exportData, fileName || 'student_scores')
//     } catch (error) {
//       console.log('Export error:', error)
//     }
//   }

//   return { exportData }
// }

const emit = defineEmits(["close", "submit", "confirm"]);

// Methods for handling events
const closeModal = () => emit("close");
const handleSubmit = () => emit("submit", modalData);
const handleConfirm = () => emit("confirm", modalData);
const grade = computed(() => {
    const total = this.row.total
    if (total > 50) {
        return 'A';
    } else if (total < 5) {
        return 'Failed';
    } else if (total < 50) {
        return 'D';
    } else {
        return 'Better';
    }
})

const btnAction = [
    { label: t('record'), type: 'record', icon: 'record', disabled: false },
    { label: t('detail'), type: 'view', icon: 'view', disabled: false },
]

// Fetch Data from API on Load
const fetchTeachings = async () => {
    try {
        isLoading.value = true;
        const { data } = await useHttp("/api/student/list", {
            method: 'POST'
        });
        studentScoreResult.value = data
        // // Ensure data is an array before mapping
        // const resultData = Array.isArray(data) ? data : [];
        
        // studentScoreResult.value = resultData.map(item => ({
        //     Id: item.Id,
        //     StudentCode: item.StudentCode,
        //     Name: item.StudentName,
        //     EnglishName: item.StudentNameEnglish,
        //     Gender: item.StudentGender,
        //     DOB: item.StudentDOB,
        //     Note: item.StudentName,
        //     Midterm: item.Midterm ?? 0,
        //     Final: item.Final ?? 0,
        //     Total: (item.Midterm ?? 0) + (item.Final ?? 0),
        //     isEditing: false
        // }));
        
    } catch (error) {
        console.log("Error fetching data:", error);
    } finally {
        isLoading.value = false;
    }
};

// Close modal function
const closeModalScore = () => {
    isModalOpenScore.value = false;
};

const closeModalScoreDetail = () => {
    isModalOpenScoreDetail.value = false;
};

function recordScore(type, data) {
    studentData.value = data
    if(type === 'record') {
        isModalOpenScore.value = true;
    } else if (type === 'view') {
        isModalOpenScoreDetail.value = true;
    }
}

function viewScoreDetail(type, data) {
    studentData.value = data
    isModalOpenScoreDetail.value = true;
}


async function reloadData() {
    await fetchTeachings()
}

// // Fetch Data on Component Mount
onMounted(fetchTeachings);
definePageMeta({ layout: 'layout', middleware: ['auth'], role: "teacher" });

</script>
<style lang="scss" scoped>
@use "@/assets/styles/table.scss" as table;


input {
    width: 100%;
    padding: 5px;
}

button {
    margin-top: 10px;
    padding: 5px 10px;
}

table {
    border-radius: 10px;
    border: 1px solid var(--nokor-w-b-2);
    width: 100%;
    border-collapse: collapse;
    thead > tr > td {
        font-size: 13px;
    }
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
th,
td {
    padding: 10px;
    text-align: center;
}

input {
    width: 100%;
    padding: 5px;
}

table {
    width: 100%;
    border-collapse: collapse;
    max-width: 10px 0 10px 0;
    width: 100%;
    border-collapse: collapse;

    thead>tr>td {
        font-size: 10px;
    }

    tbody>tr>td {
        font-size: 14px;
        text-align: left;
    }

    tbody {
        tr {
            &:nth-child(odd) {
                background-color: var(--nokor-w-b-5);
            }

            // // Centered column class
            // &.no-column {
            //     td {
            //         text-align: center;
            //         // Reset the data-label alignment for mobile
            //         @media (max-width: 768px) {
            //             justify-content: center;

            //             &::before {
            //                 margin-right: 0;
            //                 padding-right: 0;
            //             }
            //         }
            //     }
            // }
        }
    }
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
