<template>
  <div class="rty-avatar-wrapper">
    <div :class="['avatar-container', `avatar-size-${props.size}`]" :style="avatarStyle">
      <img :src="src || '/images/defaultProfile.png'" :alt="altText" class="avatar-img" @error="onImageError"
        :style="imageStyle" />

      <!-- Active Badge -->
      <div v-if="active" class="active-indicator"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Define props for dynamic image source, alt text, size, and gender
const props = defineProps({
  src: {
    type: String,
    required: true,
  },
  altText: {
    type: String,
    default: 'Avatar',
  },
  size: {
    type: [String, Number],
    default: 50, // Default size is 50px
  },
  gender: {
    type: String,
    required: true, // Gender for dynamic border color
    validator: (value) => ['Male', 'Female'].includes(value?.toLowerCase()), // Ensur
  },
  active: {
    type: Boolean,
    default: false, // Default is not active
  },
});

// const defaultImage = '/images/defaultProfile.png';  // Fallback image URL
const defaultImage = {
  male: '/images/profile_male.png', // Path to default male image
  female: '/images/profile_female.png', // Path to default female image
};

// Ref to hold the dynamic image source
const src = ref(props.src ?? defaultImage[props.gender?.toLowerCase()]); // Initialize with the prop or gender-specific default image

// // Handle error when image fails to load
// function onImageError() {
//   src.value = defaultImage;  // Set fallback image if image fails to load
// }
// Handle error when image fails to load
function onImageError() {
  // Set the gender-specific default image on error
  src.value = defaultImage[props.gender?.toLowerCase()];
}

// Compute the avatar size dynamically based on the size prop
const avatarStyle = computed(() => {
  const sizeValue = typeof props.size === 'number' ? `${props.size}px;` : props.size;
  const borderColor = props.gender === 'Female' ? 'blue' : 'red'; // Border color based on gender

  return {
    width: sizeValue + ' !important',
    height: sizeValue + ' !important',
    borderRadius: '50%',
    border: `3px solid ${borderColor}` + ' !important',  // Dynamic border color based on gender
    overflow: 'hidden',  // To keep image inside the avatar
    position: 'relative',
  };
});

// Compute the image size dynamically (adjusting for the border)
const imageStyle1 = computed(() => {
  return {
    width: `calc(${props.size}px - 3px) !important`, // Image is 3px smaller than avatar container to account for border
    height: `calc(${props.size}px - 3px) !important`, // Image is 3px smaller than avatar container to account for border
    objectFit: 'cover',
    objectPosition: 'center',
  };
});

// Compute the avatar container style (for border, position, etc.)
const avatarContainerStyle = computed(() => {
  const borderColor = props.gender === 'Female' ? 'blue' : 'red'; // Border color based on gender
  return {
    border: `3px solid ${borderColor}`,  // Dynamic border color based on gender
    overflow: 'hidden',  // To keep image inside the avatar
    position: 'relative',  // Ensure child elements can be positioned relative to this container
  };
});

// Compute the image style (adjusting for the border)
const imageStyle = computed(() => {
  const size = props.size;
  return {
    width: `calc(${size}px - 3px)`,
    height: `calc(${size}px - 3px)`,
    objectFit: 'cover',
    objectPosition: 'center',
  };
});

// Compute the dynamic size class
const dynamicSizeClass = computed(() => {
  const size = props.size;
  return `avatar-size-${size}`;
});
</script>

<style lang="scss" scoped>
.avatar-container {
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1.5px solid;

  // Default border colors for light mode
  &.male {
    border-color: red;
  }

  &.female {
    border-color: blue;
  }

  // Dark mode styles
  &.dark {
    &.male {
      border-color: darkred; // Darker red for dark mode
    }

    &.female {
      border-color: darkblue; // Darker blue for dark mode
    }
  }

  // .avatar-img {
  //   width: 100%;
  //   height: 100%;
  //   object-fit: cover;
  //   object-position: center;
  //   padding: 4px 4px;
  // }

  &img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    object-position: center !important;
    border-radius: 100% !important;
    padding: 4px 4px !important;
  }

  // Active indicator style
  .active-indicator {
    position: absolute;
    bottom: 2px;
    right: 5px;
    width: 12px;
    height: 12px;
    // background-color: green;
    background: linear-gradient(135deg, #00ff00, #00ff7f); // Green gradient for active status
    border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    z-index: 2 !important;
    /* Make sure the status is above the avatar container */
  }

}

// Dynamic size classes with !important
.avatar-size-30 {
  width: 40px !important;
  height: 40px !important;

  &img {
    width: 28px !important;
    height: 28px !important;
  }
}

.avatar-size-50 {
  width: 50px !important;
  height: 50px !important;

  img {
    width: 48px !important;
    height: 48px !important;
  }
}

.avatar-size-75 {
  width: 75px !important;
  height: 75px !important;

  img {
    width: 73px !important;
    height: 73px !important;
  }
}

.avatar-size-100 {
  width: 100px !important;
  height: 100px !important;

  img {
    width: 98px !important;
    height: 98px !important;
  }
}

.avatar-size-150 {
  width: 150px !important;
  height: 150px !important;

  img {
    width: 148px !important;
    height: 148px !important;
  }
}

.avatar-size-200 {
  width: 200px !important;
  height: 200px !important;

  img {
    width: 198px !important;
    height: 198px !important;
  }
}

.avatar-size-250 {
  width: 250px !important;
  height: 250px !important;

  img {
    width: 248px !important;
    height: 248px !important;

  }
}
</style>
