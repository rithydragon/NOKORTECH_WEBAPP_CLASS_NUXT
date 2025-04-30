import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    userData: null,
    loading: false,
    error: null,
  }),

  getters: {
    fullName: (state) => state.userData?.Name || 'Anonymous',
    avatar: (state) => state.userData?.ImagePath || '/default-avatar.png',
    isAuthenticated: (state) => !!state.userData,
    userRoles: (state) => state.userData?.Role || [],
    userPermissions: (state) => state.userData?.Permission || [],
    userGroups: (state) => state.userData?.Group || [],
    // hasAdminAccess: (state) => state.userData?.roles?.includes('admin') || false,
    userRoles: (state) => {
      try {
        return state.userData?.Roles ? JSON.parse(state.userData.Roles) : [];
      } catch {
        return [];
      }
    },
    userPermissions: (state) => {
      try {
        return state.userData?.Permissions ? JSON.parse(state.userData.Permissions) : [];
      } catch {
        return [];
      }
    },
    hasAdminAccess: (state) =>
      Array.isArray(state.userData?.Roles)
        ? state.userData.Roles.includes('Admin')
        : JSON.parse(state.userData?.Roles || '[]').includes('Admin'),
    userGroups: (state) => {
      try {
        return state.userData?.Groups ? JSON.parse(state.userData.Groups) : [];
      } catch {
        return [];
      }
    },
    formattedBirthDate: (state) => {
      if (!state.userData?.DateOfBirth) return 'N/A';
      const date = new Date(state.userData.DateOfBirth);
      return date.toLocaleDateString();
    },
    formattedLastLogin: (state) => {
      if (!state.userData?.LastLogin) return 'Never logged in';
      const date = new Date(state.userData.LastLogin);
      return date.toLocaleString();
    }
  },
  // persist: {
  //   enabled: true,
  //   strategies: [
  //     {
  //       key: 'user',
  //       storage: localStorage,
  //       paths: ['userData'],
  //     },
  //   ],
  // },

  actions: {
    async initialize() {
      if (process.client) {
        const token = useCookie('authToken');
        if (token.value && !this.userData) {
          await this.getUserProfile();
        }
      }
    },

    async getUserProfile() {
      this.loading = true;
      this.error = null;

      try {
        const response = await useHttp('/api/user/profile', { method: 'POST' });
        console.log('User profile response:--------', response);

        if (response.error) {
          throw new Error(response.error.message || 'Failed to fetch profile');
        }

        this.userData = response.data;
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to fetch profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(updateData) {
      this.loading = true;
      try {
        const data = await useHttp('/api/user/profile', {
          method: 'POST',
          body: updateData,
        });

        if (data.error) {
          throw new Error(data.error.message || 'Failed to update profile');
        }

        if (this.userData) {
          this.userData = { ...this.userData, ...data.data };
        }
        return data.data;
      } catch (error) {
        this.error = error.message || 'Failed to update profile';
        throw error;
      } finally {
        this.loading = false;
      }
    },



    async changePassword({ currentPassword, newPassword, confirmPassword }) {
      this.isLoading = true
      this.error = null

      try {
        if (newPassword !== confirmPassword) {
          throw new Error('New password and confirm password do not match')
        }

        const userId = this.user?.id || this.user?._id // Adjust based on your structure

        const response = await $fetch(`/api/auth/change-password/${userId}`, {
          method: 'POST',
          body: {
            currentPassword,
            newPassword,
            changedBy: userId
          }
        })

        return response
      } catch (err) {
        this.error = err.data?.message || err.message
        throw new Error(this.error)
      } finally {
        this.isLoading = false
      }
    },


    async changePassword11(payload) {
      console.log('Changing password with payload:', payload);
      this.loading = true;
      this.error = null

      try {
        const response = await useHttp('/api/user/change_password', {
          method: 'POST',
          data: payload,
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to change password');
        }
      } catch (error) {
        this.error = error.message || 'Failed to change password';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async resetPassword(payload) {
      console.log('Resetting password with payload:', payload);
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await useHttp('/api/user/reset_password', {
          method: 'POST',
          data: {
            Username: payload.Username,
            NewPassword: payload.NewPassword
          }
        })

        if (error) {
          throw new Error(error?.Message || 'Failed to reset password')
        }

        return data
      } catch (err) {
        this.error = err.data?.Message || err.message || 'Reset password error'
        throw err
      } finally {
        this.isLoading = false
      }
    },


    async resetPassword11({ username, newPassword }) {
      this.loading = true
      this.error = null

      try {
        if (!username || !newPassword) {
          throw new Error('Username and new password are required')
        }

        const { data, error } = await useHttp('/api/user/reset_password', {
          method: 'POST',
          data: {
            Username: username,
            NewPassword: newPassword,
          },
        })
        if (error) {
          throw new Error(error?.Message || 'Failed to reset password')
        }
        return data
      } catch (err) {
        this.error = err.data?.message || err.message
        throw new Error(this.error)
      } finally {
        this.loading = false
      }
    },
    async updateAvatar11(image) {
      this.loading = true;
      try {
        const formData = new FormData();
        formData.append('Image', image);

        const { data, error } = await useHttp('/api/user/upload_avatar', {
          method: 'POST',
          data: formData,
        });

        if (error) {
          throw new Error(error.message || 'Failed to update avatar');
        }

        if (data) {
          console.log('Updating userData with new image:', response.data?.image);
          this.userData.image = data?.image;
        }
        return response.data;
      } catch (error) {
        this.error = error.message || 'Failed to update avatar';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAvatar22(file) {
      this.loading = true;
      this.error = null;
      console.log('Updating avatar with file:', file);

      try {
        const formData = new FormData();
        formData.append('Image', file);

        const { data, error } = await useHttp('/api/user/upload_avatar', {
          method: 'POST',
          data: formData
        });

        if (error) throw new Error(error?.Message || 'Failed to upload avatar');

        console.log('Avatar upload response:', data);
        if (data?.imagePath) {
          this.userData.ImagePath = data.imagePath; // Update image path in store
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to upload avatar';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateAvatar(file) {
      this.loading = true;
      this.error = null;
      console.log('Updating avatar with file:', file);

      try {
        const formData = new FormData();
        formData.append('Image', file);
        formData.append('UserId', this.userData.UserId); // Add UserId to form data

        const { data, error } = await useHttp('/api/user/upload_avatar', {
          method: 'POST',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (error) throw new Error(error?.Message || 'Failed to upload avatar');

        console.log('Avatar upload response:', data);
        if (data?.imagePath) {
          this.userData.ImagePath = data.imagePath; // Update image path in store
          // You might want to add a cache-buster to force image reload
          this.userData.ImagePath = `${data.imagePath}?${Date.now()}`;
        }
        return data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to upload avatar';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteAvatar() {
      this.loading = true;
      this.error = null;

      try {
        const { data, error } = await useHttp('/api/user/remove_image', {
          method: 'GET'
        });

        this.user.avatar = '';
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Failed to delete avatar';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearError() {
      this.error = null;
    },

    reset() {
      this.userData = null;
      this.loading = false;
      this.error = null;
    }
  },
});