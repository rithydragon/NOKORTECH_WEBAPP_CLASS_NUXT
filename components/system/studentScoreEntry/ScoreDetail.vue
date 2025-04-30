<template>
  <RModal v-model="isModalOpen" max-width="70vw" max-height="60vh" :before-close="checkForUnsavedChanges"
    :prevent-close="true" mode="view" :modalTitle="$t('student_score_detail')" @close="closeModal">
    <div class="w-full">
      <!-- Student Info -->
      <div class="flex items-center gap-3 mb-4">
        <RTYAvatar size="40" :gender="student?.StudentGender" :active="student?.StudentStatus" />
        <div>
          <p>{{ tBy({ en: student?.StudentNameEnglish, km: student?.StudentName }) }}</p>
          <p class="text-gray-500 text-sm">{{ student?.StudentCode }}</p>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 rounded-[20px]">
          <thead class="">
            <tr>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('course') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('academic') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('semester') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('score') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('midterm') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('final') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('class') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('ranking') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('gpa') }} </th>
              <th scope="col" class="px-6 py-3 text-left tracking-wider"> {{ $t('exam_date') }} </th>
            </tr>
          </thead>

          <tbody class=" divide-y divide-gray-200">
            <tr v-for="(row, index) in tableData" :key="index">
              <td class=" text-gray-500">{{ tBy({ en: row.CourseEnglishName, km: row.CourseName }) || '' }}</td>
              <td class=" text-gray-500">{{ tBy({ en: row.AcademicEnglishName, km: row.AcademicName }) || '' }}</td>
              <td class=" text-gray-500">{{ row.SemesterName || '' }}</td>
              <td class="whitespace-nowrap"> <div class="text-sm text-gray-900">{{ row.Score || '' }}</div> </td>
              <td class="whitespace-nowrap"> <div class="text-sm text-gray-900">{{ row.Midterm || '' }}</div> </td>
              <td class="whitespace-nowrap"> <div class="text-sm text-gray-900">{{ row.Final || '' }}</div> </td>
              <td class="whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ row.Class || '' }}</div>
              </td>
              <td class="whitespace-nowrap text-center">
                <span :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRankColor(row.Rank)}`">
                  {{ row.Score > 0 ? row.Rank : '' }}
                </span>
              </td>
              <td class="whitespace-nowrap"> <div class="text-sm text-gray-900">{{ row.GPA || '' }}</div> </td>
              <td class="whitespace-nowrap"> <div class="text-sm text-gray-900">{{ rtydate(row.ExamDate).format('MMM dd, yyyy') || '' }}</div> </td>
            </tr>

            <tr v-if="!tableData || tableData.length === 0">
              <td colspan="8" class="text-center py-4 text-sm text-gray-500">
                <div class="flex items-center justify-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{{ $t('no_scores_found') }}</span>
                </div>
              </td>
            </tr>

            <!-- Total Score Row (only shown when there's data) -->
            <tr v-if="tableData && tableData.length > 0" class="bg-gray-50 font-semibold">
              <td colspan="3" class="px-6 py-4 text-sm text-gray-900 text-right">
                {{ $t('total_score') }}:
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ calculateTotalScore }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ calculateTotalMidterm }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ calculateTotalFinal }}
              </td>
              <td colspan=""></td> <!-- Empty cells for remaining columns -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                <span
                  :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRankColor(totalScores.rank)}`">
                  {{ totalScores.rank }}
                </span>
              </td>
              <td colspan="2" class="whitespace-nowrap"> </td>
            </tr>

            <tr v-if="tableData && tableData.length > 0" class="bg-gray-50 font-semibold">
              <td colspan="3" class="px-6 py-4 text-sm text-gray-900 text-right">
                {{ $t('summary') }}:
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ $t('total') }}: {{ calculateTotalScore }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ $t('average') }}: {{ calculateAverageScore }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ $t('count') }}: {{ tableData.length }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ $t(`${getPerformanceRating(totalScores.average)}`) }}
              </td>
            </tr>
            
          </tbody>
        </table>
      </div>
    </div>
    <template #footer>
      <RTYButtons :actions="[{ type: 'close', label: t('close'), icon: 'ri-close-line', onClick: closeModal }]" />
    </template>
  </RModal>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
const { t } = useI18n();
// ✅ Correct props
const props = defineProps({
  student: '',
  isOpen: {
    type: Boolean,
    default: false
  }
});

const isCreate = ref(true)
// Props access
const student = computed(() => props.student);

const studentData = computed(() => props.student)

// Emit + Modal state
const emit = defineEmits(['close']);
const isModalOpen = defineModel();

// Data
const scores = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);
const tableData = ref([]);
const editedRows = ref(new Set());

// Data fetching
const getStudentScoring = async () => {
  isLoading.value = true;
  try {
    const { data, error } = await useHttp('/api/student_score/by_student', {
      method: 'POST',
      data: { StudentId: studentData.value?.Id },
    });

    if (error) {
      console.log('Student scoring fetch error:', error);
      return;
    } else {
      tableData.value = data?.data || [];
    }
  } catch (err) {
    console.log('Unhandled fetch error:', err);
  } finally {
    isLoading.value = false;
  }
};

// Calculate total score
const calculateTotalScore = computed(() => {
  if (!tableData.value || tableData.value.length === 0) return 0;

  return tableData.value.reduce((total, row) => {
    // Convert score to number before adding
    const score = Number(row.Score) || 0;
    return total + score;
  }, 0).toFixed(2); // Format to 2 decimal places
});

const calculateTotalMidterm = computed(() => {
  if (!tableData.value || tableData.value.length === 0) return 0;

  return tableData.value.reduce((total, row) => {
    // Convert score to number before adding
    const score = Number(row.Midterm) || 0;
    return total + score;
  }, 0).toFixed(2); // Format to 2 decimal places
});

const calculateTotalFinal = computed(() => {
  if (!tableData.value || tableData.value.length === 0) return 0;

  return tableData.value.reduce((total, row) => {
    // Convert score to number before adding
    const score = Number(row.Final) || 0;
    return total + score;
  }, 0).toFixed(2); // Format to 2 decimal places
});


const calculateAverageScore = computed(() => {
  if (!tableData.value || tableData.value.length === 0) return 0;
  return (calculateTotalScore.value / tableData.value.length).toFixed(2);
});


// Helper function to calculate letter grade
const calculateLetterGrade = (score) => {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'E';
};

// Helper function to calculate GPA (4.0 scale)
const calculateGPA = (score) => {
  if (score >= 90) return 4.0;
  if (score >= 80) return 3.0;
  if (score >= 70) return 2.0;
  if (score >= 60) return 1.0;
  return 0.0;
};

// Get color for rank badge
const getRankColor = (rank) => {
  console.log("Rank:", rank)
  const colors = {
    'A': 'bg-green-100 text-green-800',
    'B': 'bg-blue-100 text-blue-800',
    'C': 'bg-yellow-100 text-yellow-800',
    'D': 'bg-orange-100 text-orange-800',
    'E': 'bg-red-100 text-red-800'
  };
  return colors[rank] || 'bg-gray-100 text-gray-800';
};

// Comprehensive score calculations
const totalScores = computed(() => {
  if (!tableData.value || tableData.value.length === 0) {
    return {
      sum: 0,
      average: 0,
      rank: '-',
      gpa: 0
    };
  }

  const validScores = tableData.value
    .map(row => Number(row.Score))
    .filter(score => !isNaN(score));

  const sum = validScores.reduce((total, score) => total + score, 0);
  const average = validScores.length > 0 ? sum / validScores.length : 0;
  const rank = calculateLetterGrade(average);
  const gpa = calculateGPA(average);

  return {
    sum: sum.toFixed(2),
    average: average.toFixed(2),
    rank,
    gpa: gpa.toFixed(2)
  };
});


// Performance rating based on score
const getPerformanceRating = (score) => {
  console.log("Score:", score)
  const numericScore = Number(score) || 0;
  
  // Clamp the score between 0-100
  const clampedScore = Math.min(100, Math.max(0, numericScore));
  
  if (clampedScore >= 90) return ('excellent');
  if (clampedScore >= 80) return ('very_good');
  if (clampedScore >= 70) return ('good');
  if (clampedScore >= 60) return ('satisfactory');
  return (`needs_improvement`);
};

const closeModal = () => {
  searchQuery.value = '';
  emit('close');
};

const saveAndClose = () => {
  isModalOpen.value = false;
  tableData.value = []; // Clear table data on close
};

const checkForUnsavedChanges = () => {
  if (editedRows.value.size > 0) {
    return confirm('You have unsaved changes. Really close?');
  }
  return true;
};

onMounted(async () => {
  await getStudentScoring();
});

// Watch open modal to trigger data fetch
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
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

// Watch for prop changes to refetch data
// watch(() => [props.studentId, props.academicId, props.semesterId], () => {
//   fetchData();
// });

definePageMeta({
  middleware: ['auth'],
  role: 'teacher'
});
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_table.scss";
table{
  border-radius: 7px;
  overflow: hidden;
  border-color: 2px solid var(--nokor-w-b-3);
}

</style>
