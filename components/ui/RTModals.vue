<script setup lang="ts">
import { defineProps, defineEmits, ref, watchEffect } from 'vue';

// Props that the modal will accept
const props = defineProps({
    isOpen: {
        type: Boolean,
        required: true,
    },
    apiUrl: {
        type: String,
        required: true,
    }
});

// Emits event to close the modal or send data to the parent
const emit = defineEmits(['update:isOpen', 'modalDataFetched']);

const toast = useToast();  // Assuming toast is defined in your project

const modalData = ref<any>(null);

// Fetch data from API
const fetchData = async () => {
    try {
        const response = await fetch(props.apiUrl);
        const data = await response.json();
        modalData.value = data;
        toast.add({ color: 'green', title: 'Data fetched successfully' });
        emit('modalDataFetched', data);  // Emit the data back to the parent
    } catch (error) {
        toast.add({ color: 'red', title: 'Error fetching data' });
    }
};

watchEffect(() => {
    if (props.isOpen) {
        fetchData();
    }
});

</script>

<template>
    <UModal v-model="props.isOpen" prevent-close>
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        Modal
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
                        @click="emit('update:isOpen', false)" />
                </div>
            </template>

            <!-- Modal Body -->
            <div v-if="modalData">
                <p>Data from API: {{ modalData }}</p>
                <!-- You can display the API data however you want -->
            </div>
            <div v-else>
                <p>Loading...</p>
            </div>

            <Placeholder class="h-32" />
        </UCard>
    </UModal>
</template>

<style scoped>
/* You can add your modal styles here */
</style>
