<template>
    <div class="telegram-setup">
        <div class="setup-header">
            <h2>{{ $t('telegram_link_setup') }}</h2>
            <p class="subheader">{{ $t('configure_telegram_links') }}</p>
        </div>

        <form @submit.prevent="submitForm" class="setup-form">
            <!-- Link Type Selection -->
            <div class="form-section">
                <label class="section-label">{{ $t('link_type') }}</label>
                <div class="type-selector">
                    <button v-for="type in linkTypes" :key="type.value" type="button" class="type-option"
                        :class="{ active: form.linkType === type.value }" @click="form.linkType = type.value">
                        <i :class="type.icon" class="type-icon"></i>
                        <span>{{ $t(type.label) }}</span>
                    </button>
                </div>
            </div>

            <!-- Link Information -->
            <div class="form-section">
                <label class="section-label">{{ $t('link_information') }}</label>

                <div class="input-group">
                    <label>{{ $t('link_title') }}</label>
                    <input v-model="form.linkTitle" type="text" :placeholder="$t('enter_link_title')"
                        class="styled-input">
                </div>

                <div class="input-group">
                    <label>{{ $t('telegram_link') }}</label>
                    <div class="link-input-wrapper">
                        <span class="prefix">t.me/</span>
                        <input v-model="form.telegramLink" type="text" :placeholder="$t('enter_link_path')"
                            class="styled-input">
                    </div>
                </div>

                <div class="input-group">
                    <label>{{ $t('description') }} <span class="optional">({{ $t('optional') }})</span></label>
                    <textarea v-model="form.linkDescription" :placeholder="$t('enter_description')"
                        class="styled-textarea" rows="3"></textarea>
                </div>
            </div>

            <!-- Relationship Selection -->
            <div class="form-section">
                <label class="section-label">{{ $t('link_to') }}</label>
                <div class="relationship-grid">
                    <div class="input-group">
                        <label>{{ $t('course') }}</label>
                        <select v-model="form.courseId" class="styled-select">
                            <option value="">{{ $t('select_course') }}</option>
                            <option v-for="course in courses" :key="course.id" :value="course.id">
                                {{ course.title }}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>{{ $t('class') }}</label>
                        <select v-model="form.classId" class="styled-select">
                            <option value="">{{ $t('select_class') }}</option>
                            <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                                {{ cls.name }}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>{{ $t('academic_period') }}</label>
                        <select v-model="form.academicId" class="styled-select">
                            <option value="">{{ $t('select_academic') }}</option>
                            <option v-for="academic in academics" :key="academic.id" :value="academic.id">
                                {{ academic.name }}
                            </option>
                        </select>
                    </div>

                    <div class="input-group">
                        <label>{{ $t('department') }}</label>
                        <select v-model="form.departmentId" class="styled-select">
                            <option value="">{{ $t('select_department') }}</option>
                            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                                {{ dept.name }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Options -->
            <div class="form-section options-section">
                <div class="option-toggle">
                    <label class="toggle-label">
                        <input type="checkbox" v-model="form.isOfficial" class="toggle-input">
                        <span class="toggle-slider"></span>
                        <span class="toggle-text">{{ $t('official_link') }}</span>
                    </label>
                    <p class="option-description">{{ $t('official_link_description') }}</p>
                </div>

                <div class="option-toggle">
                    <label class="toggle-label">
                        <input type="checkbox" v-model="form.isActive" class="toggle-input">
                        <span class="toggle-slider"></span>
                        <span class="toggle-text">{{ $t('active_link') }}</span>
                    </label>
                    <p class="option-description">{{ $t('active_link_description') }}</p>
                </div>
            </div>

            <!-- Form Actions -->
            <div class="form-actions">
                <button type="button" class="cancel-btn" @click="resetForm">
                    {{ $t('cancel') }}
                </button>
                <button type="submit" class="submit-btn" :disabled="isSubmitting">
                    <span v-if="isSubmitting" class="spinner"></span>
                    {{ $t('save_changes') }}
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const linkTypes = [
    { value: 'GROUP', label: 'group_chat', icon: 'ri-telegram-line' },
    { value: 'PERSONAL', label: 'personal_chat', icon: 'ri-telegram-line' },
    { value: 'OFFICIAL', label: 'official_channel', icon: 'ri-telegram-line' },
    { value: 'STUDY_GROUP', label: 'study_group', icon: 'ri-telegram-line' }
];

const form = ref({
    linkType: 'GROUP',
    linkTitle: '',
    telegramLink: '',
    linkDescription: '',
    courseId: '',
    classId: '',
    academicId: '',
    departmentId: '',
    isOfficial: false,
    isActive: true
});

const courses = ref([]);
const classes = ref([]);
const academics = ref([]);
const departments = ref([]);
const isSubmitting = ref(false);

// Fetch data functions would go here
// async function fetchCourses() { ... }

function resetForm() {
    form.value = {
        linkType: 'GROUP',
        linkTitle: '',
        telegramLink: '',
        linkDescription: '',
        courseId: '',
        classId: '',
        academicId: '',
        departmentId: '',
        isOfficial: false,
        isActive: true
    };
}

async function submitForm() {
    isSubmitting.value = true;
    try {
        // Validate at least one relationship is selected
        if (!form.value.courseId && !form.value.classId && !form.value.academicId && !form.value.departmentId) {
            alert('Please select at least one relationship (course, class, academic period, or department)');
            return;
        }

        // Submit logic would go here
        // await api.createTelegramLink(form.value);

        alert('Link created successfully!');
        resetForm();
    } catch (error) {
        console.log('Error creating link:', error);
        alert('Failed to create link. Please try again.');
    } finally {
        isSubmitting.value = false;
    }
}

definePageMeta({ layout: 'layout', middleware: 'auth' })
</script>

<style lang="scss" scoped>
:root {
    // Colors
    --primary-color: #4361ee;
    --primary-dark: #3a56d4;
    --primary-color-rgb: 67, 97, 238;

    // Backgrounds
    --card-bg: #ffffff;
    --card-bg-dark: #1e293b;
    --section-bg: #f8fafc;
    --section-bg-dark: #1e293b;
    --option-bg: #ffffff;
    --option-bg-dark: #1e293b;
    --option-hover-bg: #f1f5f9;
    --option-hover-bg-dark: #334155;
    --option-active-bg: #e0e7ff;
    --option-active-bg-dark: #3730a3;
    --input-bg: #ffffff;
    --input-bg-dark: #1e293b;
    --prefix-bg: #f1f5f9;
    --prefix-bg-dark: #334155;
    --toggle-bg: #cbd5e1;
    --toggle-bg-dark: #475569;
    --button-hover-bg: #f1f5f9;
    --button-hover-bg-dark: #334155;
    --button-disabled-bg: #94a3b8;

    // Text
    --text-primary: #1e293b;
    --text-primary-dark: #f8fafc;
    --text-secondary: #64748b;
    --text-secondary-dark: #94a3b8;
    --text-tertiary: #94a3b8;
    --text-tertiary-dark: #64748b;

    // Borders
    --border-color: #e2e8f0;
    --border-color-dark: #334155;

    // Shadows
    --card-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    --card-shadow-dark: 0 4px 20px rgba(0, 0, 0, 0.2);
    --section-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    --section-shadow-dark: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark {
    --card-bg: var(--card-bg-dark);
    --section-bg: var(--section-bg-dark);
    --option-bg: var(--option-bg-dark);
    --option-hover-bg: var(--option-hover-bg-dark);
    --option-active-bg: var(--option-active-bg-dark);
    --input-bg: var(--input-bg-dark);
    --prefix-bg: var(--prefix-bg-dark);
    --toggle-bg: var(--toggle-bg-dark);
    --button-hover-bg: var(--button-hover-bg-dark);
    --text-primary: var(--text-primary-dark);
    --text-secondary: var(--text-secondary-dark);
    --text-tertiary: var(--text-tertiary-dark);
    --border-color: var(--border-color-dark);
    --card-shadow: var(--card-shadow-dark);
    --section-shadow: var(--section-shadow-dark);
}

.telegram-setup {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    background: var(--card-bg);
    border-radius: 16px;
    box-shadow: var(--card-shadow);
}

.setup-header {
    margin-bottom: 2rem;
    text-align: center;

    h2 {
        font-size: 1.75rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }

    .subheader {
        color: var(--text-secondary);
        font-size: 1rem;
    }
}

.setup-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.form-section {
    background: var(--section-bg);
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: var(--section-shadow);
}

.section-label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.1rem;
}

.type-selector {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
}

.type-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--option-bg);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: var(--primary-color);
        background: var(--option-hover-bg);
    }

    &.active {
        border-color: var(--primary-color);
        background: var(--option-active-bg);
        box-shadow: 0 0 0 1px var(--primary-color);
    }

    .type-icon {
        width: 24px;
        height: 24px;
        margin-bottom: 0.5rem;
        fill: currentColor;
    }

    span {
        font-size: 0.9rem;
        font-weight: 500;
    }
}

.input-group {
    margin-bottom: 1.5rem;

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);

        .optional {
            color: var(--text-tertiary);
            font-weight: 400;
        }
    }
}

.styled-input,
.styled-textarea,
.styled-select {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.2s ease;

    &:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.1);
    }
}

.styled-textarea {
    min-height: 100px;
    resize: vertical;
}

.link-input-wrapper {
    display: flex;
    align-items: center;
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;

    .prefix {
        padding: 0 0.75rem;
        background: var(--prefix-bg);
        color: var(--text-secondary);
        font-size: 0.9rem;
        white-space: nowrap;
    }

    .styled-input {
        border: none;
        border-radius: 0;
        padding-left: 0.5rem;
    }
}

.relationship-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
}

.options-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.option-toggle {
    display: flex;
    align-items: flex-start;
    gap: 1rem;

    .toggle-label {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
    }

    .toggle-input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;

        &:checked+.toggle-slider {
            background-color: var(--primary-color);

            &::before {
                transform: translateX(20px);
            }
        }
    }

    .toggle-slider {
        position: relative;
        width: 48px;
        height: 24px;
        background-color: var(--toggle-bg);
        border-radius: 12px;
        transition: all 0.3s ease;

        &::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            left: 2px;
            top: 2px;
            background-color: white;
            border-radius: 50%;
            transition: all 0.3s ease;
        }
    }

    .toggle-text {
        font-weight: 500;
        color: var(--text-primary);
    }

    .option-description {
        margin-top: 0.25rem;
        font-size: 0.85rem;
        color: var(--text-secondary);
        line-height: 1.4;
    }
}

.form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1rem;

    button {
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        font-size: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }
}

.cancel-btn {
    border: 1px solid var(--border-color);
    background: transparent;
    color: var(--text-primary);

    &:hover {
        background: var(--button-hover-bg);
    }
}

.submit-btn {
    border: none;
    background: var(--primary-color);
    color: white;

    &:hover {
        background: var(--primary-dark);
    }

    &:disabled {
        background: var(--button-disabled-bg);
        cursor: not-allowed;
    }
}

.spinner {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
    margin-right: 8px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Dark mode adjustments */
.dark {
    .telegram-setup {
        background: var(--card-bg-dark);
    }

    .type-option {
        background: var(--option-bg-dark);
    }

    .styled-input,
    .styled-textarea,
    .styled-select {
        background: var(--input-bg-dark);
    }

    .link-input-wrapper {
        background: var(--input-bg-dark);
    }
}
</style>