<script setup>
import { ref, watchEffect, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  url: {
    type: String,
    required: false
  },
  options: {
    type: Array,
    default: () => []
  },
  valueKey: {
    type: String,
    default: 'Id'
  },
  labelKey: {
    type: String,
    default: 'name'
  },
  useI18n: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])
const modelValue = defineModel()

const items = ref([])
const loading = ref(false)

const { locale } = useI18n()

const fetchData = async () => {
  if (!props.url) return
  try {
    loading.value = true
    const res = await $fetch(props.url)
    items.value = res
  } catch (e) {
    console.log('Failed to fetch:', e)
  } finally {
    loading.value = false
  }
}

watchEffect(() => {
  if (props.url) fetchData()
  else items.value = props.options
})

const tBy = ({ en, km }) => (locale.value === 'km' ? km : en)

const formattedOptions = computed(() => {
  return items.value.map(item => {
    const label = props.useI18n
      ? tBy({ en: item[`${props.labelKey}English`] ?? '', km: item[props.labelKey] ?? '' })
      : item[props.labelKey]
    return {
      value: item[props.valueKey],
      label
    }
  })
})
</script>

<template>
  <div>
    <USelect
      v-model="modelValue"
      :options="formattedOptions"
      placeholder="Select..."
      :disabled="loading"
      class="w-full"
    />
  </div>
</template>
