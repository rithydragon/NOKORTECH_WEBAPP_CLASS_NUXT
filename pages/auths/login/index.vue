<template>
  <RTYHead :title="$t('login')" description="Welcome to our website" :keywords="['website', 'nuxt']" />
  <div class="login-container">
    <div class="login-box relative">
      <div class="flex justify-center gap-2 items-center absolute -mt-[30px] mr-0 ml-[290px]">
        <LanguageSwitcher />
        <DarkModeToggle />
      </div>

      <h2 class="login-title">{{ $t('login') }}</h2>
      <form @submit.prevent="handleLogin" @keyup.enter="handleKeyPress" class="login-form">
        <!-- Username Input -->
        <div class="input-group">
          <input v-model="username" :placeholder="$t('username')" class="login-input" :disabled="isLoading"
            aria-describedby="username-error" @input="validateUsername" />
          <span class="input-icon"><i class="ri-user-line"></i></span>
        </div>
        <!-- Username Validation Message -->
        <p id="username-error" v-if="!isUsernameValid && usernameTouched" class="error-message">
          {{ $t('username_required') }}
        </p>

        <!-- Password Input -->
        <div class="input-group">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" :placeholder="$t('password')"
            class="login-input" :disabled="isLoading" @input="validatePassword" />
          <span class="input-icon cursor-pointer" @click="showPassword = !showPassword">
            <i :class="showPassword ? 'ri-eye-line' : 'ri-eye-off-line'"></i>
          </span>
        </div>
        <!-- Password Validation Message -->
        <p v-if="!isPasswordValid && passwordTouched" class="error-message">
          {{ $t('password_required') }}
        </p>

        <button type="submit" class="login-button" :disabled="isLoading">
          <span v-if="!isLoading">{{ $t('login') }}</span>
          <div v-else class="loading-spinner flex gap-1">
            <!-- <i class="ri-loop-left-line ri-loader-2-line"></i> -->
            <i v-show="isLoading" class="ri-loader-2-line animate-spin items-center"> </i>
            <p>{{ $t('loading_') }}</p>
          </div>
        </button>
        <!-- <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p> -->
      </form>
      <!-- <div class="login-footer">
        <p>{{ $t('no_account') }} <a href="/auths/signup" class="footer-link">{{ $t('sign_up') }}</a></p>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth.js';
import { useRouter, useRoute } from 'vue-router';
const { t } = useI18n();
const toast = useToast();
import { useDeviceId } from '~/composables/useDeviceId'

const showPassword = ref(false); // Track password visibility
const auth = useAuthStore();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false)
const usernameTouched = ref(false);
const passwordTouched = ref(false);

// Use router and route hooks
const router = useRouter()
const route = useRoute()

// Validation functions
const validateUsername = () => {
  usernameTouched.value = true;
};

const validatePassword = () => {
  passwordTouched.value = true;
};

// Computed properties for validation
const isUsernameValid = computed(() => username.value.trim() !== '');
const isPasswordValid = computed(() => password.value.trim() !== '');

// const isUsernameValid = computed(() => /^[a-zA-Z0-9_]{3,15}$/.test(username.value.trim()));
// const isPasswordValid = computed(() => password.value.length >= 8); // minimum 8 characters

const isFormValid = computed(() => isUsernameValid.value && isPasswordValid.value);
// const getDeviceId = (username) => {
//   const key = `rty_device_id_${username}`;
//   let deviceId = localStorage.getItem(key);
//   if (!deviceId) {
//     deviceId = crypto.randomUUID(); // or use uuidv4()
//     localStorage.setItem(key, deviceId);
//   }
//   return deviceId;
// };

const handleLogin = async () => {
  if (!isFormValid.value) {
    toast.add({color:'red',title: t('fill_all_fields')});
    return;
  }
  // const deviceId = getDeviceId(credentials.Username);

  const deviceId = useDeviceId()

  errorMessage.value = '';
  isLoading.value = true;

  try {
    const success = await auth.login({
      Username: username.value,
      Password: password.value,
      DeviceId: deviceId
    });

    console.log("Success Payload  : ", success)

    if (success) {
      router.push('/'); // Redirect to profile page after successful login
      toast.add({ color: 'green', title: t('login_successful') })
      // You can optionally delay the check
      setTimeout(() => auth.isAuthenticated, 1000);
      // Retrieve the redirect path, if any
      // const redirectPath = localStorage.getItem('redirectPath') || '/';  // Default to home page if no path saved
      const redirectPath = route.query.next ? decodeURIComponent(route.query.next) : '/'
      await router.push(redirectPath)
      // Redirect the user to the saved path
      router.push(redirectPath);
    } else {
      toast.add({ color: 'red', title: t('invalid_username_password') })
    }

    // Check authentication status after login
    if (auth.isAuthenticated) {
      console.log('User is authenticated');
    } else {
      toast.add({color:'red', title:'User is not authenticated'})
      console.log('User is not authenticated');
    }

  } catch (error) {
    console.log('Login error:', error);
    toast.add({ color: 'red', title: error?.message || t('login_failed') })
  } finally {
    isLoading.value = false
  }
};

// Function to handle Enter key press
const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !isLoading.value) {
    handleLogin();
  }
};
</script>

<style lang="scss" scoped>
:root {
  --background-color: #f0f0f0;
  --text-color: #333;
  --input-background: #ffffff;
  --input-border: #ddd;
  --button-background: #6a11cb;
  --button-hover: #2575fc;
  --error-color: #ff4d4d;
}

.dark {
  --background-color: rgb(188, 177, 177);
  --text-color: #ffffff;
  --input-background: #cac4c4;
  --input-border: #555;
  --button-background: #6a11cb;
  --button-hover: #2575fc;
  --error-color: #ff4d4d;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  transition: background 0.3s ease, color 0.3s ease;
  padding: 20px;
}

.login-box {
  background: var(--nokor-w-b-5);
  color: var(--general-text-color);
  padding: 40px;
  padding-top: 50px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.login-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--general-text-color);
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  position: relative;
}

.login-input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 2px solid var(--input-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--input-background);
  color: var(--text-color);
  transition: border-color 0.3s ease;

  &:focus {
    border-color: var(--button-background);
    outline: none;
  }

  &:disabled {
    background-color: #d4ff00;
    cursor: not-allowed;
  }
}

.loading-spinner {
  display: inline-block;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    // font-size: 3px;
    animation: spin 1s linear infinite; // Apply spin animation to the icon
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.input-icon {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.2rem;
  color: var(--button-background);
}

// .login-button {
//   background: var(--button-background);
//   color: var(--text-color);
//   padding: 12px;
//   border: none;
//   border-radius: 8px;
//   font-size: 1rem;
//   font-weight: bold;
//   cursor: pointer;
//   transition: background 0.3s ease;
//   position: relative;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   gap: 0.5rem;

//   &:hover:not(:disabled) {
//     background: var(--button-hover);
//   }

//   &:disabled {
//     opacity: 0.7;
//     background: #a8a8a8;
//     cursor: not-allowed;
//   }
// }

.login-button {
  width: 100%;
  padding: 12px 15px;
  // border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #6a11cb;
    outline: none;
  }

  // &:hover:not(:disabled) {
  //   background: var(--button-hover);
  // }
  &:disabled {
    opacity: 0.7;
    background: rgba(46, 43, 43, 0.3);
    cursor: not-allowed;
  }
}

.error-message {
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 10px;
}

.login-footer {
  margin-top: 20px;
  font-size: 0.9rem;
  color: var(--general-text-color);

  .footer-link {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
