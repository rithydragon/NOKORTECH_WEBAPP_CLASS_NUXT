<template>
  <div class="profile-form-container">
    <div class="profile-header">
      <h2>{{ $t('profile_information') }}</h2>
      <p class="profile-subheader">{{ $t('update_your_profile') }}</p> 
    </div>
    
    <form @submit.prevent="updateProfile" class="profile-form">
      <div class="form-grid">
        <div class="form-group">
          <label>{{ $t('full_name') }}</label>
          <input
            v-model="form.Name"
            type="text"
            :placeholder="$t('name')"
            class="form-input"
          />
          <div class="input-underline"></div>
        </div>

        <div class="form-group">
          <label>{{ $t('username') }}</label>
          <input
            v-model="form.Username"
            type="text"
            :placeholder="$t('username')"
            class="form-input"
          />
          <div class="input-underline"></div>
        </div>

        <div class="form-group">
          <label>{{ $t('email') }}</label>
          <input
            v-model="form.Email"
            type="email"
            :placeholder="$t('email')"
            class="form-input"
          />
          <div class="input-underline"></div>
        </div>

        <div class="form-group">
          <label>{{ $t('phone_number') }}</label>
          <input
            v-model="form.PhoneNumber"
            type="tel"
            :placeholder="$t('phone_number')"
            class="form-input"
          />
          <div class="input-underline"></div>
        </div>
      </div>

      <div class="form-group">
        <label>{{ $t('bio') }}</label>
        <textarea
          v-model="form.Bio"
          class="form-textarea"
          :placeholder="$t('tell_us_about_yourself')"
        ></textarea>
        <div class="textarea-underline"></div>
      </div>

      <button
        type="submit"
        class="submit-btn"
        :disabled="userStore.loading"
      >
        <span v-if="userStore.loading" class="spinner"></span>
        <span v-else>{{ $t('update_profile') }}</span>
      </button>
    </form>
  </div>
</template>


<script setup>
const userStore = useUserStore();
const toast = useToast()

const form = reactive({
  Name: userStore.userData?.name || '',
  Username: userStore.userData?.username || '',
  Email: userStore.userData?.email || '',
  PhoneNumber: userStore.userData?.phoneNumber || '',
  Bio: userStore.userData?.bio || '',
});

const updateProfile = async () => {
  try {
    await userStore.updateProfile(form);
    toast.add({title:'Profile updated successfully!'});
  } catch (error) {
    toast.add({title:error.message || 'Failed to update profile'});
  }
};

</script>


<style lang="scss">
.profile-form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--neutral-bg);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  .dark & {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
}

.profile-header {
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--general-text-color);
    margin-bottom: 0.5rem;
  }

  .profile-subheader {
    color: var(--nokor-w-b-3);
    font-size: 0.875rem;
  }
}

.profile-form {
  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--general-text-color);
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.form-input, .form-textarea {
  width: 100%;
  padding: 22px 16px 10px;
  // padding: 0.75rem 0;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  color: var(--general-text-color);
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-bottom-color: var(--primary-color);

    & ~ .input-underline, & ~ .textarea-underline {
      transform: scaleX(1);
    }
  }
}

.form-textarea {
  min-height: 100px;
  resize: vertical;
}

.input-underline, .textarea-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary-color);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.submit-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 2rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  float: right;

  &:hover {
    background-color: var(--secondary-color);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
