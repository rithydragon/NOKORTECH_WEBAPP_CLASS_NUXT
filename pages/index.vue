<template>
    <RTPageWrapper>
        <RTYHead :title="$t('home_page')" description="Welcome to our website" :keywords="['website', 'nuxt']" />
        <h2 class="text-lg font-semibold">{{ $t('teaching') }}</h2>
        <div class="rty-card p-4 rounded-lg shadow mt-4">

            <button @click="reloadTeachingList">Reload</button>

            <div class="form-header grid grid-cols-3 gap-4 mb-[30px]">

                <select v-model="filters.Room" class="w-full p-2 border border-e-red-50 rounded">
                    <option value="">{{ $t('select_room') }}</option>
                    <option v-for="room in roomList" :key="room.ID" :value="room.ID">{{ room.ROOM_NAME }}</option>
                </select>

                <select v-model="filters.Time">
                    <option value="">{{ $t('select_time') }}</option>
                    <option v-for="time in timeList" :key="time.ID" :value="time.ID">{{ time.TIME_SLOT }}</option>
                </select>

                <select v-model="filters.Course" class="w-full p-2 border rounded">
                    <option value="">{{ $t('select_course') }}</option>
                    <option v-for="course in courseList" :key="course.ID" :value="course.ID">
                        {{ tBy({ en: course.TITLE, km: course.TITLE_ENGLISH }) }}
                    </option>
                </select>

            </div>
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
                    <tr v-else class="w-full">
                        <td colspan="6" class="text-center p-4">
                            <SpinningLoading v-if="isLoading" class="" />

                            <div v-else class="no-data flex gap-2 items-center">
                                <i class="ri-database-2-fill"></i>
                                <span>{{ $t('no_data') }}</span>
                            </div>
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
        <div>
            <p>📅 English Date: {{ dateFromData }}</p>
            <p>📆 Khmer Date: {{ khmerDate }}</p>
        </div>
    </RTPageWrapper>
    <SystemStudentScoreEntryModal v-model="isModalOpenStudentScoreRecord" :isModalOpen="isModalOpenStudentScoreRecord"
        :modalMode="modalMode" :modalData="modalData" :confirmMessage="'Are you sure?'"
        @close="isModalOpenStudentScoreRecord = false" @save="handleSave" />
    <SystemStudentListModal :isModalOpen="isModalOpenStudentList" :modalMode="modalMode" :modalData="modalData"
        :confirmMessage="'Are you sure?'" @close="isModalOpenStudentList = false" />
    <SystemStudentAttendanceModal :isModalOpen="isModalOpenStudentAttendance" :modalMode="modalMode"
        :modalData="modalData" :confirmMessage="'Are you sure?'" @close="isModalOpenStudentAttendance = false" />
    <SystemTimeScheduleModal :isModalOpen="isModalOpenTimeSchedule" :modalMode="modalMode" :modalData="modalData"
        :confirmMessage="'Are you sure?'" @close="isModalOpenTimeSchedule = false" />
    <SystemArchiveModal :isModalOpen="isModalOpenStudentArchive" :modalMode="modalMode" :modalData="modalData"
        :confirmMessage="'Are you sure?'" @close="isModalOpenStudentArchive = false" />
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';

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
async function fetchCourseData() {
    try {
        const { data, error } = await useHttp('/api/course/course_list', { method: 'POST' });

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
const localData = [
    {
        "Id": 112,
        "Code": "CLS1001",
        "Room": "Room A101",
        "Semester": 1,
        "Year": "2025",
        "Time": "08:00 AM - 10:00 AM",
        "Schedule": "Mon-Wed-Fri",
        "MaxEnrollment": 30,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "MUSIC201",
        "CourseTitle": "Music Theory",
        "CourseTitleEnglish": "Music Theory",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 113,
        "Code": "CLS1002",
        "Room": "Room A102",
        "Semester": 1,
        "Year": "2025",
        "Time": "10:00 AM - 12:00 PM",
        "Schedule": "Tue-Thu",
        "MaxEnrollment": 25,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "BIO301",
        "CourseTitle": "Biology Advanced",
        "CourseTitleEnglish": "Biology Advanced",
        "CourseStatus": "inactive",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 114,
        "Code": "CLS1003",
        "Room": "Room B201",
        "Semester": 2,
        "Year": "2025",
        "Time": "01:00 PM - 03:00 PM",
        "Schedule": "Mon-Wed",
        "MaxEnrollment": 35,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "PHYS101",
        "CourseTitle": "Physics Fundamentals",
        "CourseTitleEnglish": "Physics Fundamentals",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 115,
        "Code": "CLS1004",
        "Room": "Room B202",
        "Semester": 2,
        "Year": "2025",
        "Time": "03:00 PM - 05:00 PM",
        "Schedule": "Tue-Thu",
        "MaxEnrollment": 40,
        "Status": "Disable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "BIO301",
        "CourseTitle": "Biology Advanced",
        "CourseTitleEnglish": "Biology Advanced",
        "CourseStatus": "inactive",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 116,
        "Code": "CLS1005",
        "Room": "Room C301",
        "Semester": 1,
        "Year": "2025",
        "Time": "09:00 AM - 11:00 AM",
        "Schedule": "Mon-Fri",
        "MaxEnrollment": 30,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "CHEM101",
        "CourseTitle": "Intro to Chemistry",
        "CourseTitleEnglish": "Intro to Chemistry",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 117,
        "Code": "CLS1006",
        "Room": "Room C302",
        "Semester": 2,
        "Year": "2025",
        "Time": "02:00 PM - 04:00 PM",
        "Schedule": "Wed-Fri",
        "MaxEnrollment": 20,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "ENG102",
        "CourseTitle": "English Grammar",
        "CourseTitleEnglish": "English Grammar",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 118,
        "Code": "CLS1007",
        "Room": "Room D101",
        "Semester": 1,
        "Year": "2025",
        "Time": "08:30 AM - 10:30 AM",
        "Schedule": "Mon-Wed-Fri",
        "MaxEnrollment": 50,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "HIST201",
        "CourseTitle": "World History",
        "CourseTitleEnglish": "World History",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 119,
        "Code": "CLS1008",
        "Room": "Room D102",
        "Semester": 2,
        "Year": "2025",
        "Time": "11:00 AM - 01:00 PM",
        "Schedule": "Tue-Thu",
        "MaxEnrollment": 45,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "ECON301",
        "CourseTitle": "Macroeconomics",
        "CourseTitleEnglish": "Macroeconomics",
        "CourseStatus": "inactive",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 120,
        "Code": "CLS1009",
        "Room": "Room E201",
        "Semester": 1,
        "Year": "2025",
        "Time": "01:30 PM - 03:30 PM",
        "Schedule": "Mon-Wed",
        "MaxEnrollment": 30,
        "Status": "Disable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "ART101",
        "CourseTitle": "Introduction to Art",
        "CourseTitleEnglish": "Introduction to Art",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 121,
        "Code": "CLS1010",
        "Room": "Room E202",
        "Semester": 2,
        "Year": "2025",
        "Time": "03:00 PM - 05:00 PM",
        "Schedule": "Tue-Thu",
        "MaxEnrollment": 40,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "MUSIC201",
        "CourseTitle": "Music Theory",
        "CourseTitleEnglish": "Music Theory",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 122,
        "Code": "CLS1011",
        "Room": "Room F301",
        "Semester": 1,
        "Year": "2025",
        "Time": "07:30 AM - 09:30 AM",
        "Schedule": "Mon-Fri",
        "MaxEnrollment": 35,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "BIO301",
        "CourseTitle": "Biology Advanced",
        "CourseTitleEnglish": "Biology Advanced",
        "CourseStatus": "inactive",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 123,
        "Code": "CLS1012",
        "Room": "Room F302",
        "Semester": 2,
        "Year": "2025",
        "Time": "09:30 AM - 11:30 AM",
        "Schedule": "Wed-Fri",
        "MaxEnrollment": 20,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "MATH201",
        "CourseTitle": "Advanced Mathematics",
        "CourseTitleEnglish": "Advanced Mathematics",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 124,
        "Code": "CLS1013",
        "Room": "Room G101",
        "Semester": 1,
        "Year": "2025",
        "Time": "10:30 AM - 12:30 PM",
        "Schedule": "Mon-Wed-Fri",
        "MaxEnrollment": 25,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "HIST201",
        "CourseTitle": "World History",
        "CourseTitleEnglish": "World History",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 125,
        "Code": "CLS1014",
        "Room": "Room G102",
        "Semester": 2,
        "Year": "2025",
        "Time": "12:30 PM - 02:30 PM",
        "Schedule": "Tue-Thu",
        "MaxEnrollment": 30,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "ART101",
        "CourseTitle": "Introduction to Art",
        "CourseTitleEnglish": "Introduction to Art",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 126,
        "Code": "CLS1015",
        "Room": "Room H201",
        "Semester": 1,
        "Year": "2025",
        "Time": "02:30 PM - 04:30 PM",
        "Schedule": "Mon-Wed",
        "MaxEnrollment": 45,
        "Status": "Disable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "MATH201",
        "CourseTitle": "Advanced Mathematics",
        "CourseTitleEnglish": "Advanced Mathematics",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 127,
        "Code": "CLS1016",
        "Room": "Room H202",
        "Semester": 2,
        "Year": "2025",
        "Time": "03:00 PM - 05:00 PM",
        "Schedule": "Tue-Thu",
        "MaxEnrollment": 40,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "CS101",
        "CourseTitle": "Computer Science Basics",
        "CourseTitleEnglish": "Computer Science Basics",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 128,
        "Code": "CLS1017",
        "Room": "Room I301",
        "Semester": 1,
        "Year": "2025",
        "Time": "08:00 AM - 10:00 AM",
        "Schedule": "Mon-Fri",
        "MaxEnrollment": 30,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "BIO301",
        "CourseTitle": "Biology Advanced",
        "CourseTitleEnglish": "Biology Advanced",
        "CourseStatus": "inactive",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 129,
        "Code": "CLS1018",
        "Room": "Room I302",
        "Semester": 2,
        "Year": "2025",
        "Time": "10:00 AM - 12:00 PM",
        "Schedule": "Wed-Fri",
        "MaxEnrollment": 25,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "PHYS101",
        "CourseTitle": "Physics Fundamentals",
        "CourseTitleEnglish": "Physics Fundamentals",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 130,
        "Code": "CLS1019",
        "Room": "Room J101",
        "Semester": 1,
        "Year": "2025",
        "Time": "01:00 PM - 03:00 PM",
        "Schedule": "Mon-Wed-Fri",
        "MaxEnrollment": 35,
        "Status": "Enable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "HIST201",
        "CourseTitle": "World History",
        "CourseTitleEnglish": "World History",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    },
    {
        "Id": 131,
        "Code": "CLS1020",
        "Room": "Room J102",
        "Semester": 2,
        "Year": "2025",
        "Time": "03:00 PM - 05:00 PM",
        "Schedule": "Tue-Thu",
        "MaxEnrollment": 40,
        "Status": "Disable",
        "CreatedDate": "2025-03-01T10:41:50.000Z",
        "UpdatedDate": "2025-03-01T10:41:50.000Z",
        "CourseCode": "ENG102",
        "CourseTitle": "English Grammar",
        "CourseTitleEnglish": "English Grammar",
        "CourseStatus": "active",
        "InstructorName": "ប៉ុណ្ណា សេន",
        "InstructorNameEnglish": "ប៉ុណ្ណា សេន",
        "CreatedBy": "សុខ លី"
    }
]
</script>

<style lang="scss" scoped>
@use "@/assets/styles/rtytable.scss" as rtytable;

.no-data {
    color: var(--secondary-color) !important;
}

th,
td {
    text-align: left;
}
</style>