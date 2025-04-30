import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useStudentStore = defineStore('student', () => {
    const students = ref([]);
    const loading = ref(false);
    const error = ref(null);

    const fetchStudents = async () => {
        try {
            loading.value = true;
            const {data} = await useHttp('/api/students/list');
            students.value = data;
            error.value = null;
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const exportToExcel = async () => {
        try {
            loading.value = true;
            const blob = await useHttp('/api/students/list_export/excel', {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'students_report.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    const importStudents = async (file) => {
        try {
            loading.value = true;
            const formData = new FormData();
            formData.append('file', file);
            
            await useHttp('/api/students/list/import', {
                method: 'POST',
                data: formData
            });
            
            await fetchStudents();
            error.value = null;
        } catch (err) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    };

    return {
        students,
        loading,
        error,
        fetchStudents,
        exportToExcel,
        importStudents
    };
});