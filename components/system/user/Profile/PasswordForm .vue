<script setup lang="ts">
const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const userStore = useUserStore();

const ActionChangePassword = async () => {
  if (form.newPassword !== form.confirmPassword) {
    console.log('Passwords do not match');
    return;
  }

  const payload = {
    CurrentPassword: form?.currentPassword,
    NewPassword: form?.newPassword
  }
  try {
    await userStore.changePassword(payload);
    console.log('Password changed successfully!');
    form.currentPassword = '';
    form.newPassword = '';



    form.confirmPassword = '';
  } catch (error) {
    console.log('Failed to change password');
  }

  const passwordStrengthClass = computed(() => {
    if (!form.newPassword) return '';
    if (form.newPassword.length < 6) return 'weak';
    if (form.newPassword.length < 10) return 'medium';
    return 'strong';
  })
};
</script>


<template>
  <form @submit.prevent="ActionChangePassword" class="password-change-form">
    <div class="form-header">
      <h2>{{ $t('change_password') }}</h2>
      <div class="form-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 15V17M6 21H18C19.1046 21 20 20.1046 20 19V13C20 11.8954 19.1046 11 18 11H6C4.89543 11 4 11.8954 4 13V19C4 20.1046 4.89543 21 6 21ZM16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11H16Z"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
    </div>

    <div class="form-group">
      <div class="input-field">
        <input v-model="form.currentPassword" type="password" required class="password-input" />
        <label>{{ $t('current_password') }}</label>
        <div class="input-border"></div>
      </div>
    </div>

    <div class="form-group">
      <div class="input-field">
        <input v-model="form.newPassword" type="password" required class="password-input" />
        <label>{{ $t('new_password') }}</label>
        <div class="input-border"></div>
      </div>
      <div class="password-strength">
        <div class="strength-meter" :class="passwordStrengthClass"></div>
      </div>
    </div>

    <div class="form-group">
      <div class="input-field">
        <input v-model="form.confirmPassword" type="password" required class="password-input" />
        <label>{{ $t('confirm_new_password') }}</label>
        <div class="input-border"></div>
      </div>
    </div>

    <button type="submit" class="submit-btn" :disabled="userStore.loading" :class="{ 'loading': userStore.loading }">
      <span v-if="userStore.loading" class="spinner"></span>
      <span v-else>{{ $t('change_password') }}</span>
    </button>
  </form>
</template>

<style lang="scss">
.password-change-form {
  max-width: 480px;
  margin: 2rem auto;
  padding: 2.5rem;
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(90deg, #4f46e5, #8b5cf6);
  }

  .form-header {
    text-align: center;
    margin-bottom: 2.5rem;

    h2 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
    }

    .form-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(79, 70, 229, 0.1);
      border-radius: 50%;
      color: #4f46e5;
    }
  }

  .form-group {
    margin-bottom: 1.75rem;
    position: relative;
  }

  .input-field {
    position: relative;
    margin-bottom: 0.5rem;

    label {
      position: absolute;
      top: 16px;
      left: 16px;
      color: #64748b;
      font-size: 1rem;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    .password-input {
      width: 100%;
      padding: 22px 16px 10px;
      font-size: 1rem;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      background: #ffffff;
      transition: all 0.3s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

      &:focus {
        outline: none;
        border-color: #a5b4fc;

        &~label {
          top: 8px;
          font-size: 0.75rem;
          color: #4f46e5;
        }

        &~.input-border {
          transform: scaleX(1);
        }
      }

      &:valid~label {
        top: 8px;
        font-size: 0.75rem;
      }
    }

    .input-border {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #4f46e5;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 0.3s ease;
    }
  }

  .password-strength {
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    overflow: hidden;
    margin-top: 0.5rem;

    .strength-meter {
      height: 100%;
      width: 0%;
      transition: width 0.4s ease, background 0.4s ease;

      &.weak {
        width: 30%;
        background: #ef4444;
      }

      &.medium {
        width: 60%;
        background: #f59e0b;
      }

      &.strong {
        width: 100%;
        background: #10b981;
      }
    }
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(79, 70, 229, 0.25);
    }

    &:active {
      transform: translateY(0);
    }

    &:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .spinner {
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 3px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>