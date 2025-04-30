<template>
  <RTYModal v-model="isModalOpen" :prevent-close="true" mode="view" @close="closeModal">
    <div>
      <h2 class="text-2xl font-bold mb-4">{{ $t('student_score') }}</h2>
      <div class="flex items-center gap-3 mb-4">
        <RTYAvatar size="40" :gender="userData?.StudentGender" :active="userData?.StudentStatus"/>
        <div>
          <p>{{ tBy({ en: userData.StudentNameEnglish, km: userData.StudentName }) }}</p>
          <p class="text-gray-500 text-sm">{{ userData?.StudentCode }}</p>
        </div>
      </div>
      
      <!-- Search Box -->
      <input 
        v-model="searchQuery" 
        type="text" 
        :placeholder="$t('search_by_subject')"
        class="border p-2 mb-4 w-full rounded" 
      />

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full border border-gray-300">
          <thead class="bg-gray-100">
            <tr>
              <th class="border px-4 py-2">{{$t('subject')}}</th>
              <th class="border px-4 py-2">{{$t('score')}}</th>
              <th class="border px-4 py-2">{{$t('description')}}</th>
              <th class="border px-4 py-2">{{$t('note')}}</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="score in filteredScores" 
              :key="score.ScoreId" 
              class="hover:bg-gray-50"
            >
              <td class="border px-4 py-2">{{ tBy({en:score.SubjectNameEnglish,km:score.SubjectName}) }}</td>
              <td class="border px-4 py-2">{{ score.Score }}</td>
              <td class="border px-4 py-2">{{ score.ScoreDescription || 'N/A' }}</td>
              <td class="border px-4 py-2">{{ score.Note || 'N/A' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="filteredScores.length === 0" class="text-center text-gray-500 mt-4">
        {{ $t('no_scores_found') }}
      </p>
    </div>
  </RTYModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  studentId: Number,
  userData: Object,
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const isModalOpen = defineModel();
const scores = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);

const getDataScore = async () => {
  try {
    isLoading.value = true;
    const { data, error } = await useHttp(`/api/score/list_student`, {
      method: 'POST',
      data: {
        Id: props.studentId
      },
    });

    if (error) {
      console.log('Error fetching data:', error);
      scores.value = [];
    } else {
      scores.value = data || [];
    }
  } catch (err) {
    console.log('Unexpected error:', err);
    scores.value = [];
  } finally {
    isLoading.value = false;
  }
};

const filteredScores = computed(() => {
  if (!searchQuery.value) return scores.value;
  if (!scores.value?.length) return [];
  
  const query = searchQuery.value.toLowerCase();
  return scores.value.filter(score => 
    score.SubjectName?.toLowerCase().includes(query) || 
    score.SubjectNameEnglish?.toLowerCase().includes(query)
  );
});

const closeModal = () => {
  searchQuery.value = '';
  emit('close');
};

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    getDataScore();
  }
});

watch(() => props.studentId, (newId) => {
  if (newId) {
    getDataScore();
  }
});
</script>

<style lang="scss" scoped>
@use "@/assets/styles/table.scss" as table;
</style>