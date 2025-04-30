<template>
    <RTModal v-if="isModalOpen" :show="isModalOpen" :mode="modalMode" :message="confirmMessage" :modalTitle="modalMode"
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

                <div  class="flex flex-col justify-center items-center">
                    <div class="flex-1 gap-2 text-center items-center">
                        <div class="text-center pb-4">
                            <h1 class="text-lg font-bold">{{ $t('student_score_record_list') }}</h1>
                        </div>
                        <div class="flex gap-[20px] justify-center">
                            <div class="flex items-center "><h1>{{ $t('major') }} : Mojor</h1></div>
                            <div class="flex items-center"><h1>{{ $t('subject') }} : Subject</h1></div>
                        </div>
                        <div  class="flex gap-[20px]  justify-center">
                            <div class="flex items-center"><h1>{{ $t('group') }} : Group</h1></div>
                            <div class="flex items-center"><h1>{{ $t('batch') }} : Batch </h1></div>
                            <div class="flex items-center"><h1>{{ $t('time') }} : Time</h1> </div>
                        </div>
                        <div class="flex gap-[20px]  justify-center">
                            <div class="flex items-center"><h1>{{ $t('academic_year') }} : Group</h1></div>
                            <div class="flex items-center"><h1>{{ $t('semester') }} : Batch</h1></div>
                        </div>
                    </div>
                </div>
            <RTYReloadBtn @click="reloadData()" />
            <UProgress v-if="isLoading" size="xs" orientation="horizontal" color="neutral" />

            <table border="1">
                <thead>
                    <tr>
                        <th colspan="2">{{$t('no_num')}}</th>
                        <th>{{ $t('code')}}</th>
                        <th>{{ $t('surname_name') }}</th>
                        <th>{{ $t('name_latin')}}</th>
                        <th>{{ $t('gender')}}</th>
                        <th>{{ $t('dob') }}</th>
                        <th>{{ $t('phone_number') }}</th>
                        <th>{{ $t('note')}}</th>
                        <th class="flex items-center justify-center">{{ $t('action')}}</th>
                    </tr>
                </thead>

                <tbody>
                    <tr v-for="(student ,index) in students" :key="index">
                        <td>{{ index+1 }}</td>
                        <td>
                            <div class="flex items-center gap-2">
                                <RTYAvatar :src="student?.ImagePath || ''" size="30" :gender="student?.StudentGender" :active="student?.StudentStatus" />
                            </div>
                        </td>
                        <td>{{ student.StudentCode }}</td>
                        <td>{{ student.StudentName }}</td>
                        <td>{{ student.StudentNameEnglish }}</td>
                        <td>{{ student.StudentGender }}</td>
                        <td>{{ rtydate(student.StudentDOB).format('MMMM dd, yyyy') }}</td>
                        <td >{{ student.StudentPhoneNumber ? formatPhoneNumber(student.StudentPhoneNumber) : '' }}</td>
                        <td>{{ student.StudentStatus }}</td>
                        <td class="flex justify-center"><RTYTblBtn  :actions="actionList" @click="viewScore(student,student.Id)"/></td>

                    </tr>
                </tbody>
            </table>

            <div class="flex items-center justify-end pb-3">
                <!-- <button>{{ $t('goto_telegram_group') }}</button> -->
                <div class="flex gap-2 items-center">
                    <button>{{ $t('export_as_excel') }}</button>
                    <button>{{ $t('import') }}</button>
                </div>
            </div>

            <div class="p-4">
                <p>{{ tBy({ en: "Teaching hours total 5", km: "ម៉ោងបង្រៀនសរុប ៥" }) }}</p>
                <p>{{ tBy({ en: "Class hours: 10 hours per subject", km: "សិស្សសរុប ១០ ម៉ោង ក្នុងមួយមុខវិជ្ជា" }) }}</p>
                <p>{{ tBy({ en: "Theory hours: 0 hours per subject", km: "និស្សិតថ្នាក់ ០ ម៉ោង ក្នុងមួយមុខវិជ្ជា" }) }}</p>
                <p>{{ tBy({ en: "Lab hours: 0 hours per subject", km: "សិស្សបច្ចេកទេស ០ ម៉ោង ក្នុងមួយមុខវិជ្ជា" }) }}</p>
                <p>{{ tBy({ en: "Total hours per subject", km: "សិស្សសរុប ១ម៉ោង ក្នុងមួយមុខវិជ្ជា" }) }}</p>

                <h2 class="font-bold mt-4">{{ tBy({ en: "Teacher's Signature", km: "ហត្ថលេខា និស្សិតអានា" }) }}</h2>
                <p>
                {{ tBy({ en: "Date: .......... Month .......... Year ..........", km: "កាលបរិច្ឆេទ ថ្ងៃ .......... ខែ .......... ឆ្នាំ .........." }) }}
                </p>

                <h3 class="mt-4 font-semibold">
                {{ tBy({ en: "5. Administrative Officer", km: "៥. សមាសភាពវិស័យការងារ" }) }}
                </h3>
                <p>
                {{ tBy({ en: "Administrative Officer Name", km: "សមាសភាពវិស័យការងារ" }) }}
                </p>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center gap-2">
                <button @click="closeModal" class="bg-green-500 text-white px-4 py-2 rounded">{{$t('close')}}</button>
                <button @click="print" class="bg-green-500 text-white px-4 py-2 rounded">{{$t('print')}}</button>
                <button @click="handleSave" class="bg-red-500 text-white px-4 py-2  rounded">{{$t('save')}}</button>
            </div>
        </template>
    </RTModal>
    <SystemStudentListStudentScoreModal v-if="isModalOpenScore" v-model="isModalOpenScore" :studentId="selectedStudentId" :userData="userData"  @close="closeModalScore"/>
</template>

<script setup>
import { ref, onMounted,computed } from 'vue';
const { t } = useI18n()
const isModalOpenScore = ref(false);
const selectedStudentId = ref(null);
const students = ref({})
const userData = ref({})
const isLoading = ref(false)


const btnAction = [
  { label: t('view'), type: 'view', icon: 'view', disabled: false },
]

const studentData = async () => {
    isLoading.value = true
    const { data, error } = await useHttp('/api/student/list',{
        method:'POST'
    });

  if (error) {
    console.log('Error fetching data:', error);
  } else {
    students.value = data;
    console.log('Data ==============>:', data);
  }
  isLoading.value = false
};

function viewScore(data,studentId){
    selectedStudentId.value = studentId
    userData.value = data
    isModalOpenScore.value = true;
}

async function reloadData() {
    await studentData()
}
  const openModal = () => {
    isModalOpenScore.value = true;
  };

const toast = useToast()
defineProps({
    isModalOpen: Boolean,
    modalMode: String,
    modalData: Object,
    confirmMessage: String,
});


function exportExcel(a) {
    console.log(a)
}


const actionList = [
  { type: 'view', size: 'medium' },
]

// Close modal function
const closeModalScore = () => {
    isModalOpenScore.value = false;
};

function view(studentId){
    console.log(studentId);
    closeModal()
    selectedStudentId.value = studentId;
    isModalOpenScore.value = true;
};

const emit = defineEmits(["close", "submit", "confirm"]);

// Methods for handling events
const closeModal = () => emit("close");
const handleSubmit = () => emit("submit", modalData);
const handleConfirm = () => emit("confirm", modalData);

onMounted( async () => {
   await studentData()
});
watch(async () => {
    await studentData()
})

definePageMeta({ layout: 'layout', middleware: ['auth'], role: "teacher" });
</script>


<style lang="scss" scoped>
@import "@/assets/styles/table.scss";


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
</style>