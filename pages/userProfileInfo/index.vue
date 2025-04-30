<template>

  <RTYHead  :title="$t('user_profile_information')"/>
  <RTPageWrapper>
    <div class="min-h-screen bg-gray-100 py-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-200 to-purple-400 p-6">
        <h1 class="text-[20px] font-bold text-white">{{$t('user_information')}}</h1>
      </div>

      <!-- Loading State with USkeleton -->

      <div v-if="loading" class="p-6 space-y-6">
        <!-- Profile Image Skeleton -->
        <div class="flex justify-center">
          <USkeleton class="w-32 h-32 rounded-full" />
        </div>

        <!-- User Details Skeleton -->
        <div class="space-y-4">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
          </div>

          <div>
            <USkeleton class="h-4 w-3/4 rounded" />
            <USkeleton class="h-6 w-full mt-2 rounded" />
          </div>

          <!-- Roles, Permissions, and Groups -->
          <div>
            <USkeleton class="h-4 w-3/4 rounded" />
            <USkeleton class="h-6 w-full mt-2 rounded" />
          </div>

          <div>
            <USkeleton class="h-4 w-3/4 rounded" />
            <USkeleton class="h-6 w-full mt-2 rounded" />
          </div>

          <div>
            <USkeleton class="h-4 w-3/4 rounded" />
            <USkeleton class="h-6 w-full mt-2 rounded" />
          </div>

          <!-- User Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
          </div>

          <div>
            <USkeleton class="h-4 w-3/4 rounded" />
            <USkeleton class="h-6 w-full mt-2 rounded" />
          </div>

          <div>
            <USkeleton class="h-4 w-3/4 rounded" />
            <USkeleton class="h-6 w-full mt-2 rounded" />
          </div>

          <!-- Parent's Information -->
          <div class="mt-6">
            <h2 class="text-xl font-bold mb-4">
              <USkeleton class="h-6 w-1/4 rounded" />
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <USkeleton class="h-4 w-3/4 rounded" />
                <USkeleton class="h-6 w-full mt-2 rounded" />
              </div>
              <div>
                <USkeleton class="h-4 w-3/4 rounded" />
                <USkeleton class="h-6 w-full mt-2 rounded" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <USkeleton class="h-4 w-3/4 rounded" />
                <USkeleton class="h-6 w-full mt-2 rounded" />
              </div>
              <div>
                <USkeleton class="h-4 w-3/4 rounded" />
                <USkeleton class="h-6 w-full mt-2 rounded" />
              </div>
            </div>
          </div>

          <!-- Guardian's Information -->
          <div class="mt-6">
            <h2 class="text-xl font-bold mb-4">
              <USkeleton class="h-6 w-1/4 rounded" />
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <USkeleton class="h-4 w-3/4 rounded" />
                <USkeleton class="h-6 w-full mt-2 rounded" />
              </div>
              <div>
                <USkeleton class="h-4 w-3/4 rounded" />
                <USkeleton class="h-6 w-full mt-2 rounded" />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <USkeleton class="h-4 w-3/4 rounded" />
                <USkeleton class="h-6 w-full mt-2 rounded" />
              </div>
              <div>
                <USkeleton class="h-4 w-3/4 rounded" />
                <USkeleton class="h-6 w-full mt-2 rounded" />
              </div>
            </div>
          </div>

          <!-- Latest History Event -->
          <div class="mt-6">
            <h2 class="text-xl font-bold mb-4">
              <USkeleton class="h-6 w-1/4 rounded" />
            </h2>
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
            <div>
              <USkeleton class="h-4 w-3/4 rounded" />
              <USkeleton class="h-6 w-full mt-2 rounded" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="p-6">
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {{ error }}
        </div>
      </div>

      <!-- User Profile Data -->
      <div v-if="user && !loading" class="p-6">
        <!-- Profile Image -->
        <div class="flex justify-center mb-6">
          <div class="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <!-- <img
              :src="user.ImagePath || '/images/profile_male.png'"
              :alt="user.Name"
              class="w-full h-full object-cover"
              @error="handleImageError"
              v-if="user.ImagePath"
            /> -->
            <RTYAvata 
              :src="user.ImagePath || '/images/profile_male.png'"
              :alt="user.Name"
              size="128"
              :gender="user.Gender"
              class="w-full h-full object-cover"
              @error="handleImageError"
              v-if="user.ImagePath"
            />
            <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
              <span class="text-gray-500 text-2xl">{{ $t('no_image')}}</span>
            </div>
          </div>
        </div>

        <!-- User Details -->
        <div class="space-y-4">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">{{ $t('name') }}</label>
              <p class="text-lg font-semibold">{{ user.Name }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">{{$t('username')}}</label>
              <p class="text-lg font-semibold">{{ user.Username }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">{{$t('email')}}</label>
              <p class="text-lg font-semibold">{{ user.Email }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">{{ $t('gender') }}</label>
              <p class="text-lg font-semibold">{{ user.Gender }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">{{$t('dob')}}</label>
              <p class="text-lg font-semibold">{{ formatDate(user.DateOfBirth) }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">{{$t('phone_number')}}</label>
              <p class="text-lg font-semibold">{{ user.PhoneNumber }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-500">{{$t('address')}}}</label>
            <p class="text-lg font-semibold">{{ user.Address }}</p>
          </div>

          <!-- Roles, Permissions, and Groups -->
          <div>
            <label class="text-sm text-gray-500">{{$t('role')}}}</label>
            <p class="text-lg font-semibold">{{ user.Roles.join(', ') }}</p>
          </div>

          <div>
            <label class="text-sm text-gray-500">{{$t('permission')}}</label>
            <p class="text-lg font-semibold">{{ user.Permissions.join(', ') }}</p>
          </div>

          <div>
            <label class="text-sm text-gray-500">{{ $t('group') }}</label>
            <p class="text-lg font-semibold">{{ user.Groups.join(', ') }}</p>
          </div>

          <!-- User Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">{{$t('nationaliy')}}</label>
              <p class="text-lg font-semibold">{{ user.Nationality }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">{{$t('religion')}}</label>
              <p class="text-lg font-semibold">{{ user.Religion }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-sm text-gray-500">{{$t('martial_status')}}</label>
              <p class="text-lg font-semibold">{{ user.MaritalStatus }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">{{$t('occupation')}}</label>
              <p class="text-lg font-semibold">{{ user.Occupation }}</p>
            </div>
          </div>

          <div>
            <label class="text-sm text-gray-500">{{ $t('company_name') }}</label>
            <p class="text-lg font-semibold">{{ user.CompanyName }}</p>
          </div>

          <div>
            <label class="text-sm text-gray-500">{{$t('company_address')}}</label>
            <p class="text-lg font-semibold">{{ user.CompanyAddress }}</p>
          </div>

          <!-- Parent's Information -->
          <div class="mt-6">
            <h2 class="text-xl font-bold mb-4">{{ $t('parent_information') }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">{{$t('father_name')}}</label>
                <p class="text-lg font-semibold">{{ user.FatherName }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">{{$t('mother_name')}}</label>
                <p class="text-lg font-semibold">{{ user.MotherName }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">{{$t('father_occupation')}}</label>
                <p class="text-lg font-semibold">{{ user.FatherOccupation }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">{{$t('mother_occupation')}}</label>
                <p class="text-lg font-semibold">{{ user.MotherOccupation }}</p>
              </div>
            </div>
          </div>

          <!-- Guardian's Information -->
          <div class="mt-6">
            <h2 class="text-xl font-bold mb-4">{{$t('guardian_information')}}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">{{$t('guardian_name')}}</label>
                <p class="text-lg font-semibold">{{ user.GuardianName }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">{{$t('relationship')}}</label>
                <p class="text-lg font-semibold">{{ user.GuardianRelationship }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="text-sm text-gray-500">{{$t('guardian_information')}}</label>
                <p class="text-lg font-semibold">{{ user.GuardianOccupation }}</p>
              </div>
              <div>
                <label class="text-sm text-gray-500">{{ $t('guardian_phone_number') }}</label>
                <p class="text-lg font-semibold">{{ user.GuardianPhoneNumber }}</p>
              </div>
            </div>
          </div>

          <!-- Latest History Event -->
          <div class="mt-6">
            <h2 class="text-xl font-bold mb-4">{{$t('last_activity')}}</h2>
            <div>
              <label class="text-sm text-gray-500">{{$t('event_type')}}</label>
              <p class="text-lg font-semibold">{{ user.LatestHistoryEvent.EventType }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">{{$t('event_description')}}</label>
              <p class="text-lg font-semibold">{{ user.LatestHistoryEvent.EventDescription }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-500">{{ $t('event_date') }}</label>
              <p class="text-lg font-semibold">{{ formatDate(user.LatestHistoryEvent.EventDate) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!user && !loading && !error" class="p-6">
        <p class="text-lg text-gray-500">{{$t('no_user_data')}}</p>
      </div>
    </div>
  </div>
  </RTPageWrapper>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { format } from 'date-fns';

const loading = ref(false);
const error = ref(null);
const user = ref(null);

const safeJsonParse = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log('Failed to parse JSON:', e);
    return [];
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return format(new Date(dateString), 'yyyy-MM-dd');
};

const handleImageError = (event) => {
  event.target.style.display = 'none';
};

const getUserProfileInformation = async () => {
  try {
    loading.value = true;
    const { data, error: fetchError } = await useHttp('/api/user/profile', {
      method: 'POST',
    });

    if (fetchError) {
      error.value = fetchError.message || 'Failed to fetch user profile';
    } else {
      user.value = {
        ...data,
        Roles: safeJsonParse(data.Roles),
        Permissions: safeJsonParse(data.Permissions),
        Groups: safeJsonParse(data.Groups),
      };
    }
  } catch (err) {
    error.value = 'An unexpected error occurred';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getUserProfileInformation();
});

definePageMeta({
  layout:'layout',
  middleware:'auth',
  title: 'User Profile',
  description: 'View user profile information',
});
</script>

<style scoped>
</style>