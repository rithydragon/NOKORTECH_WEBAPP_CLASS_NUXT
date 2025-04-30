<template>
  <USlideover v-if="fields.length > 0" :model-value="isOpen" prevent-close
    @update:model-value="emit('update:isOpen', $event)">
    <UCard class="flex flex-col flex-1 h-full"
      :ui="{ 
        body: { base: 'flex-1 overflow-hidden' }, 
        ring: '', 
        divide: 'divide-y divide-gray-200 dark:divide-gray-700',
        header: { padding: 'px-4 py-4 sm:px-6' },
        footer: { padding: 'px-4 py-3 sm:px-6' }
      }">

      <!-- Header with close button -->
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold leading-6 text-gray-900 dark:text-white">
            {{ title }}
          </h3>
          <UButton 
            color="gray" 
            variant="ghost" 
            icon="i-heroicons-x-mark-20-solid" 
            class="-my-1"
            @click="closeSlideover" 
          />
        </div>
      </template>

      <!-- Form content with scrollable area -->
      <UForm :schema="formSchema" :state="formState" @submit="saveData" class="flex flex-col h-full">
        <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-2">
          <div class="space-y-6">
            <template v-for="field in fields" :key="field.key">
              <UFormGroup 
                :label="field.label" 
                :name="field.key"
                :help="field.help"
                :required="field.required"
                class="[&+&]:mt-6"
              >
                <!-- Text/Email Input -->
                <UInput 
                  v-if="field.type === 'text' || field.type === 'email'" 
                  v-model="formState[field.key]" 
                  :type="field.type" 
                  :placeholder="field.placeholder || field.label"
                  :trailing="field.trailingIcon"
                  :leading="field.leadingIcon"
                  size="md"
                  autocomplete="off"
                />

                <!-- Select Dropdown -->
                <USelect 
                  v-else-if="field.type === 'select'" 
                  v-model="formState[field.key]" 
                  :options="field.options" 
                  :placeholder="field.placeholder || `Select ${field.label}`"
                  size="md"
                />

                <!-- Textarea -->
                <UTextarea 
                  v-else-if="field.type === 'textarea'" 
                  v-model="formState[field.key]" 
                  :placeholder="field.placeholder || field.label"
                  :rows="field.rows || 3"
                  resize
                />

                <!-- Checkbox -->
                <UCheckbox
                  v-else-if="field.type === 'checkbox'"
                  v-model="formState[field.key]"
                  :label="field.checkboxLabel"
                />

                <!-- Radio Group -->
                <URadioGroup
                  v-else-if="field.type === 'radio'"
                  v-model="formState[field.key]"
                  :options="field.options"
                  :legend="field.label"
                  class="mt-2"
                />

                <!-- Date Picker -->
                <UInput
                  v-else-if="field.type === 'date'"
                  v-model="formState[field.key]"
                  type="date"
                  size="md"
                />
              </UFormGroup>
            </template>
          </div>
        </div>

        <!-- Footer with action buttons -->
        <template #footer>
          <div class="flex items-center justify-between">
            <UButton 
              v-if="isEditMode" 
              color="red" 
              variant="soft" 
              @click="deleteData"
              class="mr-auto"
            >
              {{ $t('delete') }}
            </UButton>
            
            <div class="flex gap-x-2">
              <UButton 
                color="gray" 
                variant="soft" 
                @click="cancelEdit"
              >
                {{ $t('cancel') }}
              </UButton>
              
              <UButton 
                type="submit" 
                color="primary"
                :loading="isSubmitting"
              >
                {{ isEditMode ? $t('update') : $t('save') }}
              </UButton>
            </div>
          </div>
        </template>
      </UForm>
    </UCard>
  </USlideover>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import * as z from 'zod'

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  title: { type: String, default: 'Manage Data' },
  fields: {
    type: Array,
    default: () => [],
    validator: (value) => {
      return value.every(field => {
        return typeof field.key === 'string' && 
               typeof field.label === 'string' &&
               (!field.type || ['text', 'email', 'select', 'textarea', 'checkbox', 'radio', 'date'].includes(field.type))
      })
    }
  },
  formData: { type: Object, required: true },
  isEditMode: { type: Boolean, default: false },
  isSubmitting: { type: Boolean, default: false }
})

const emit = defineEmits(['update:isOpen', 'save', 'delete'])

const formState = ref({ ...props.formData })

// Watch for changes in the slideover and reset form data accordingly
watch(() => props.isOpen, (newVal) => {
  if (newVal) formState.value = { ...props.formData }
})

// Dynamically create a Zod schema for form validation
const formSchema = computed(() => {
  const shape = props.fields.reduce((acc, field) => {
    if (field.type === 'text' || field.type === 'email') {
      acc[field.key] = field.required 
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional()
    } 
    else if (field.type === 'select' && field.options) {
      acc[field.key] = field.required
        ? z.enum(field.options.map(opt => opt.value), { 
            required_error: `${field.label} is required` 
          })
        : z.string().optional()
    } 
    else if (field.type === 'textarea') {
      acc[field.key] = field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional()
    }
    else if (field.type === 'checkbox') {
      acc[field.key] = z.boolean().optional()
    }
    else if (field.type === 'radio' && field.options) {
      acc[field.key] = field.required
        ? z.enum(field.options.map(opt => opt.value), {
            required_error: `${field.label} is required`
          })
        : z.string().optional()
    }
    else if (field.type === 'date') {
      acc[field.key] = field.required
        ? z.string().min(1, `${field.label} is required`)
        : z.string().optional()
    }
    return acc
  }, {})

  return z.object(shape)
})

const closeSlideover = () => {
  emit('update:isOpen', false)
}

const cancelEdit = () => {
  formState.value = { ...props.formData }
  closeSlideover()
}

const saveData = () => {
  try {
    formSchema.value.parse(formState.value)
    emit('save', formState.value)
  } catch (error) {
    console.log('Form validation failed:', error)
  }
}

const deleteData = () => {
  if (confirm($t('confirm_delete'))) {
    emit('delete', formState.value.id)
    closeSlideover()
  }
}
</script>

<style scoped>
/* Custom scrollbar for the form content */
:deep(.overflow-y-auto) {
  scrollbar-width: thin;
  scrollbar-color: #9ca3af #f3f4f6;
}

:deep(.dark .overflow-y-auto) {
  scrollbar-color: #4b5563 #1f2937;
}

:deep(.overflow-y-auto::-webkit-scrollbar) {
  width: 8px;
}

:deep(.overflow-y-auto::-webkit-scrollbar-track) {
  background: #f3f4f6;
}

:deep(.dark .overflow-y-auto::-webkit-scrollbar-track) {
  background: #1f2937;
}

:deep(.overflow-y-auto::-webkit-scrollbar-thumb) {
  background-color: #9ca3af;
  border-radius: 4px;
}

:deep(.dark .overflow-y-auto::-webkit-scrollbar-thumb) {
  background-color: #4b5563;
}
</style>