<template>
  <div class="signup-container">
    <div class="signup-box">
      <LanguageSwitcher />
      <h2 class="signup-title">Sign Up</h2>
      <form @submit.prevent="handleSignup" class="signup-form">
        <!-- Name Field -->
        <div class="input-group">
          <i class="ri-user-line input-icon"></i>
          <input v-model="form.name" :placeholder="$t('name')" :disabled="loading" class="signup-input" />
        </div>

        <!-- NameEnglish Field -->
        <div class="input-group">
          <i class="ri-user-voice-line input-icon"></i>
          <input v-model="form.nameEnglish" :placeholder="$t('name_latin')" :disabled="loading"
            class="signup-input" />
        </div>

        <!-- Username Field -->
        <div class="input-group">
          <i class="ri-user-3-line input-icon"></i>
          <input v-model="form.username" :placeholder="$t('username')" :disabled="loading" class="signup-input" />
        </div>

        <!-- Email Field -->
        <div class="input-group">
          <i class="ri-mail-line input-icon"></i>
          <input v-model="form.email" type="email" :placeholder="$t('email')" :disabled="loading"
            class="signup-input" />
        </div>

        <!-- Password Field -->
        <div class="input-group">
          <i class="ri-lock-line input-icon"></i>
          <input v-model="form.password" :type="showPassword ? 'text' : 'password'" :placeholder="$t('password')"
            :disabled="loading" class="signup-input" />
          <i @click="togglePassword" class="password-toggle-icon"
            :class="showPassword ? 'ri-eye-line' : 'ri-eye-off-line'"></i>
        </div>

        <!-- Confirm Password Field -->
        <div class="input-group">
          <i class="ri-lock-password-line input-icon"></i>
          <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
            :placeholder="$t('confirm_password')" :disabled="loading" class="signup-input" />
          <i @click="toggleConfirmPassword" class="password-toggle-icon"
            :class="showConfirmPassword ? 'ri-eye-line' : 'ri-eye-off-line'"></i>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="signup-button" :disabled="loading">
          <span v-if="loading">
            <i class="ri-loader-4-line ri-spin"></i> Processing...
          </span>
          <span v-else>{{ $t('sign_up') }}</span>
        </button>

        <!-- Error Message -->
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>

      <!-- Footer -->
      <div class="signup-footer">
        <p>{{ $t('no_account') }} <a href="/auths/login" class="footer-link">{{ $t('login') }}</a></p>
      </div>
    </div>
    <FormDescription>
      <ul class="list-disc pl-5 text-sm">
        <li v-for="(req, i) in validation.passwordRequirements" :key="i">
          {{ req }}
        </li>
      </ul>
    </FormDescription>
  </div>
</template>
<script setup>
const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: ''
});

const validation = ref({
  passwordRequirements: [
    t('password.min_length', { count: 8 }),
    t('password.uppercase'),
    t('password.number')
  ]
});

const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const validatePassword = () => {
  const strongRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongRegex.test(form.value.password);
};

const handleSignup = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = t('auth.password_mismatch');
    return;
  }

  if (!validatePassword()) {
    error.value = t('auth.password_weak');
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    await auth.signup({
      Name: form.value.name,
      Username: form.value.username,
      Email: form.value.email,
      Password: form.value.password,
      PhoneNumber: form.value.phoneNumber
    });

    useToast().add({
      title: t('auth.registration_success'),
      description: t('auth.awaiting_approval'),
      color: 'green'
    });

    router.push('/login');
  } catch (err) {
    error.value = err.message || t('auth.registration_failed');
  } finally {
    loading.value = false;
  }
};
</script>

<!-- 
<template>
  <div class="max-w-md mx-auto mt-10">
    <h1 class="text-2xl font-bold mb-6">{{ t('auth.register') }}</h1>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded">
        {{ error }}
      </div>

      <FormField name="name" :label="t('auth.name')" required>
        <FormInput v-model="form.name" />
      </FormField>

      <FormField name="username" :label="t('auth.username')" required>
        <FormInput v-model="form.username" />
      </FormField>

      <FormField name="email" :label="t('auth.email')" type="email" required>
        <FormInput v-model="form.email" />
      </FormField>

      <FormField name="phoneNumber" :label="t('auth.phone')">
        <FormInput v-model="form.phoneNumber" />
      </FormField>

      <FormField name="password" :label="t('auth.password')" required>
        <FormInput 
          v-model="form.password" 
          :type="showPassword ? 'text' : 'password'" 
        />
        <button 
          type="button" 
          @click="showPassword = !showPassword"
          class="absolute right-2 top-2"
        >
          <Icon :name="showPassword ? 'heroicons:eye-slash' : 'heroicons:eye'" />
        </button>
        <FormDescription>
          <ul class="list-disc pl-5 text-sm">
            <li v-for="(req, i) in validation.passwordRequirements" :key="i">
              {{ req }}
            </li>
          </ul>
        </FormDescription>
      </FormField>

      <FormField 
        name="confirmPassword" 
        :label="t('auth.confirm_password')" 
        required
      >
        <FormInput 
          v-model="form.confirmPassword" 
          :type="showPassword ? 'text' : 'password'" 
        />
      </FormField>

      <Button type="submit" :loading="loading" class="w-full">
        {{ t('auth.register') }}
      </Button>
    </form>

    <div class="mt-4 text-center">
      <NuxtLink to="/login" class="text-primary hover:underline">
        {{ t('auth.have_account') }}
      </NuxtLink>
    </div>
  </div>
</template> -->

<!-- <script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth'; // Import auth store

const auth = useAuthStore();
const router = useRouter();

const form = ref({
  name: '',
  nameEnglish: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const errorMessage = ref('');
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Toggle password visibility
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// Handle Signup
const handleSignup = async () => {
  if (userData.value.password !== userData.value.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    const success = await auth.signup(userData.value);
    if (success) {
      router.push('/'); // Redirect to home page
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }

  

    // Check authentication status after login
    if (auth.isAuthenticated()) {
        console.log('User is authenticated');
    } else {
        console.log('User is not authenticated');
    }
};
</script> -->

<style lang="scss" scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 20px;
}

.signup-box {
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.signup-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;

  .signup-input {
    width: 100%;
    padding: 12px 40px 12px 40px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
      border-color: #6a11cb;
      outline: none;
    }
  }

  .input-icon {
    position: absolute;
    left: 12px;
    font-size: 1.2rem;
    color: #6a11cb;
  }

  .password-toggle-icon {
    position: absolute;
    right: 12px;
    font-size: 1.2rem;
    color: #6a11cb;
    cursor: pointer;
  }
}

.signup-button {
  background: #6a11cb;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;

  &:disabled {
    background: #999;
    cursor: not-allowed;
  }

  &:hover {
    background: #2575fc;
  }
}

.error-message {
  color: #ff4d4d;
  font-size: 0.9rem;
  margin-top: 10px;
}

.signup-footer {
  margin-top: 20px;
  font-size: 0.9rem;
  color: #666;

  .footer-link {
    color: #6a11cb;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>