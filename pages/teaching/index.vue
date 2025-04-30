<template>
    <RTPageWrapper>
        <RTYHead :title="$t('teaching')" description="Welcome to our website" :keywords="['website', 'nuxt']" />
        <h2 class="text-lg font-semibold">{{ $t('teaching') }}</h2>
        <div class="rty-card p-4 rounded-lg shadow mt-4">
            <div>
                <p>📅 English Date: {{ dateFromData }}</p>
                <p>📆 Khmer Date: {{ khmerDate }}</p>
            </div>
            <div class="form-header grid grid-cols-3 gap-6 mb-8">
                <!-- Room Select -->
                <div class="select-container relative">
                    <select v-model="filters.Room" class="modern-select" @focus="focusedSelect = 'room'"
                        @blur="focusedSelect = null">
                        <option value="">{{ $t('select_room') }}</option>
                        <option v-for="room in roomList" :key="room.ID" :value="room.ID">
                            {{ room.ROOM_NAME }}
                        </option>
                    </select>
                    <div class="select-icon" :class="{ 'text-primary-500': focusedSelect === 'room' }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                </div>

                <!-- Course Select -->
                <div class="select-container relative">
                    <select v-model="filters.Course" class="modern-select" @focus="focusedSelect = 'course'"
                        @blur="focusedSelect = null">
                        <option value="">{{ $t('select_course') }}</option>
                        <option v-for="course in courseList" :key="course.Id" :value="course.Id">
                            {{ tBy({ en: course.Title, km: course.EnglishTitle }) }}
                        </option>
                    </select>
                    <div class="select-icon" :class="{ 'text-primary-500': focusedSelect === 'course' }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M6 9l6 6 6-6" />
                        </svg>
                    </div>
                </div>
            </div>
            <RTYReloadBtn @click="reloadTeachingList()" />
            <UProgress v-if="isLoading" size="sm" color="primary" orientation="horizontal" />
            <table v-else class="w-full border-collapse border mt-4">
                <thead>
                    <tr class="rty-card text-left">
                        <th class="border p-2">{{ $t('subject') }}</th>
                        <th class="border p-2">{{ $t('room') }}</th>
                        <th class="border p-2">{{ $t('batch') }}</th>
                        <th class="border p-2">{{ $t('time') }}</th>
                        <th class="border p-2">{{ $t('year') }}</th>
                        <th class="border p-2">{{ $t('semester') }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="teachingList?.length" v-for="(item, index) in teachingList" :key="index"
                        class="text-left">
                        <td class="border p-2">{{ item.CourseTitle }}</td>
                        <td class="border p-2">{{ item.RoomName }}</td>
                        <td class="border p-2">{{ tBy({ en: item.BatchEnglishName, km: item.BatchName }) }}</td>
                        <td class="border p-2">{{ item.Duration }}</td>
                        <td class="border p-2">{{ tBy({ en: item.AcademicEnglishName, km: item.AcademicName }) }}</td>
                        <td class="border p-2">{{ item.SemesterName }}</td>
                    </tr>
                    <tr v-if="!teachingList?.length">
                        <td colspan="6" class="no-data flex gap-2 items-center w-full text-center p-4">
                            <i class="ri-database-2-fill"></i>
                            <span>{{ $t('no_data') }}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <button @click="resetFilters" class="bg-red-500 text-white px-4 py-2 rounded">Reset</button>

        <div class="border p-2 flex justify-center gap-2">
            <button @click="openModalSSRCD($t('score_entry'))" class="bg-yellow-300 px-2 py-1 rounded">{{
                $t('score_entry') }}</button>
            <button @click="openModalSL($t('student_list'))" class="bg-blue-400 text-white px-2 py-1 rounded">{{
                $t('student_list') }}</button>
            <button @click="openModalSATT($t('attendance_entry'))" class="bg-gray-300 px-2 py-1 rounded">{{
                $t('attendance_entry') }}</button>
            <button @click="openModalTimeRCD($t('time_record'))" class="bg-gray-300 px-2 py-1 rounded">{{
                $t('time_record') }}</button>
            <button @click="openModalACH($t('archive'))" class="bg-red-400 text-white px-2 py-1 rounded">{{
                $t('archive') }}</button>
        </div>

    </RTPageWrapper>
    <SystemStudentScoreEntryModal v-if="isModalOpenStudentScoreRecord" v-model="isModalOpenStudentScoreRecord" :isModalOpen="isModalOpenStudentScoreRecord"
        :modalMode="modalMode" :modalData="modalData"
        @close="isModalOpenStudentScoreRecord = false" @save="handleSave" />
    <SystemStudentListModal v-if="isModalOpenStudentList" :isModalOpen="isModalOpenStudentList" :modalMode="modalMode" :modalData="modalData"
        @close="isModalOpenStudentList = false" />
    <SystemStudentAttendanceModal v-if="isModalOpenStudentAttendance" :isModalOpen="isModalOpenStudentAttendance" :modalMode="modalMode"
        :modalData="modalData" @close="isModalOpenStudentAttendance = false" />
    <SystemTimeScheduleModal v-if="isModalOpenTimeSchedule" :isModalOpen="isModalOpenTimeSchedule" :modalMode="modalMode" :modalData="modalData"
        @close="isModalOpenTimeSchedule = false" />
    <SystemArchiveModal v-if="isModalOpenStudentArchive" :isModalOpen="isModalOpenStudentArchive" :modalMode="modalMode" :modalData="modalData"
        @close="isModalOpenStudentArchive = false" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
const focusedSelect = ref(null)
// Modal states
const isModalOpenStudentList = ref(false);
const isModalOpenStudentScoreRecord = ref(false);
const isModalOpenStudentAttendance = ref(false);
const isModalOpenTimeSchedule = ref(false);
const isModalOpenStudentArchive = ref(false);

const roomId = ref(null)
const courseId = ref(null)
const timeId = ref(null)

const teachingList = ref([])
const courseList = ref([]);
const isLoading = ref(false);
const roomList = ref([])
const timeList = ref([])
const course = ref([])

// Filters
const filters = reactive({
    Course: "",
    Room: "",
    Time: "",
});


const reloadTeachingList = async () => {
    isLoading.value = true
    try {
        await teachingData()
    } catch (error) {
        console.log('Failed to fetch teaching list:', error)
    } finally {
        isLoading.value = false
    }
}


// watch(courseList, timeList, roomList, (newVal) => {
//     console.log('Course changed:', newVal);
//     filters.Course = newVal;
//     filters.Room = newVal;
//     filters.Time = newVal;
// });

// Fetch teaching data function
async function teachingData() {
    isLoading.value = true;

    try {
        const { data, error } = await useHttp('/api/teaching/list', {
            method: 'POST',
            data: {
                Room: filters.Room || null,
                Time: filters.Time || null,
                Course: filters.Course || null,
            },
        });
        if (error) {
            throw new Error(error.message || 'Failed to fetch teaching data');
        }
        if (data.length === 0) {
            console.log('No data returned from API');
            teachingList.value = [];
            return;
        }

        if (data) {
            teachingList.value = data
        }

    } catch (err) {
        console.log('Error fetching teaching data:', err);
        teachingList.value = []; // Reset on error
        throw err;
    } finally {
        isLoading.value = false;
    }
}

// Fetch course data function
// Fetch course data function
async function fetchCourseData() {
    try {
        const { data, error } = await useHttp('/api/course/list', { method: 'POST' });

        if (error) {
            console.log('❌ Error fetching courses:', error);
            return;
        }

        if (data) {
            courseList.value = data;
            console.log('✅ Courses data:', courseList.value);
        } else {
            console.warn('⚠️ No courses returned from API.');
            course.value = [];
        }
    } catch (err) {
        console.log('❗Unexpected error fetching courses:', err);
    }
}


// Fetching Room Data in Nuxt 3 Component
async function fetchRoomData() {
    try {
        const { data, error } = await useHttp('/api/room/list');
        if (error) {
            console.log('Error fetching rooms:', error);
        }
        roomList.value = data
        console.log('Fetched Rooms:', data);
    } catch (err) {
        console.log('Unexpected error fetching rooms:', err);
    }
}

// Fetching Time Data in Nuxt 3 Component
async function fetchTimeData() {
    try {
        const { data, error } = await useHttp('/api/time/list');
        if (error) {
            console.log('Error fetching time slots:', error);
        }
        timeList.value = data
        console.log('Fetched Time Slots:', data);
    } catch (err) {
        console.log('Unexpected error fetching time slots:', err);
    }
}

// Initialize component
onMounted(() => {
    teachingData();
    fetchCourseData()
    fetchRoomData()
    fetchTimeData()
});

// ✅ Reset filter function
const resetFilters = () => {
    roomId.value = null
    courseId.value = null
    timeId.value = null
    reloadTeachingList()
}

// Use watch() for auto-reload:
watch([roomId, courseId, timeId], () => {
    reloadTeachingList()
})


watch(
    () => [filters.Room, filters.Time, filters.Course],
    () => {
        teachingData(); // Call API when any filter changes
    }
);



// Modal logic
const isModalOpen = ref(false);
const modalMode = ref('');
const modalData = ref({});

const openModal = (mode) => {
    modalMode.value = mode;
    isModalOpen.value = true;
};

const openModalSL = (mode) => {
    console.log(mode)
    modalMode.value = mode;
    isModalOpenStudentList.value = true;
};

const openModalSSRCD = (mode) => {
    console.log(mode)
    modalMode.value = mode;
    isModalOpenStudentScoreRecord.value = true;
};

const openModalSATT = (mode) => {
    console.log(mode)
    modalMode.value = mode;
    isModalOpenStudentAttendance.value = true;
};

const openModalACH = (mode) => {
    console.log(mode)
    modalMode.value = mode;
    isModalOpenStudentArchive.value = true;
};

const openModalTimeRCD = (mode) => {
    console.log(mode)
    modalMode.value = mode;
    isModalOpenTimeSchedule.value = true;
};

const handleSave = (data) => {
    console.log("Saving data:", data);
    isModalOpen.value = false;
};


definePageMeta({
    layout: 'layout',
    middleware: 'auth',
    pageTitle: 'RITHTHY'
    // requiresRole: ['SysAdmin'] // optional
});

</script>

<style lang="scss" scoped>
@import "@/assets/styles/rtytable.scss";

.no-data {
    color: var(--secondary-color) !important;
}

th,
td {
    text-align: left;
}

.select-container {
    position: relative;
    height: 48px;

    &:hover {
        .modern-select {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 1px var(--primary-color);
        }

        .select-icon {
            color: var(--primary-color);
        }
    }
}

.modern-select {
    appearance: none;
    width: 100%;
    height: 100%;
    padding: 0 16px;
    padding-right: 40px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background-color: var(--neutral-bg);
    color: var(--general-text-color);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

    &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);

        &+.select-icon {
            color: var(--primary-color);
            transform: rotate(180deg);
        }
    }

    option {
        padding: 8px;
        background: var(--neutral-bg);
        color: var(--general-text-color);
    }
}

.select-icon {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: var(--nokor-w-b-3);
    transition: all 0.2s ease;
}

.dark {
    .modern-select {
        background-color: var(--neutral-bg);
        border-color: var(--color-border);
    }
}
</style>