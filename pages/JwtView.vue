<template>
    <div class="jwt-viewer">
      <h2>JWT Token Inspector</h2>
      
      <div v-if="loading" class="loading">
        <Icon name="svg-spinners:270-ring" size="24" />
        <span>Loading token data...</span>
      </div>
  
      <div v-else-if="tokenData" class="token-display">
        <div class="token-meta">
          <div class="meta-item">
            <h3>User ID</h3>
            <p>{{ tokenData.UserId }}</p>
          </div>
          <div class="meta-item">
            <h3>Issued At</h3>
            <p>{{ formatDate(tokenData.iat) }}</p>
            <small>{{ tokenData.iat }} (unix)</small>
          </div>
          <div class="meta-item">
            <h3>Expires At</h3>
            <p>{{ formatDate(tokenData.exp) }}</p>
            <small>{{ tokenData.exp }} (unix)</small>
          </div>
        </div>
  
        <div class="token-visual">
          <div class="progress-bar">
            <div 
              class="progress" 
              :style="{ width: `${tokenPercentage}%` }"
              :class="{ 'expired': isExpired }"
            ></div>
          </div>
          <div class="time-remaining">
            <span v-if="!isExpired">
              {{ countdown }} remaining ({{ tokenPercentage.toFixed(1) }}%)
            </span>
            <span v-else class="expired">
              Token expired {{ formatRelative(tokenData.exp) }}
            </span>
          </div>
        </div>
      </div>
  
      <div v-if="error" class="error">
        <Icon name="material-symbols:error-outline" />
        <p>{{ error }}</p>
        <button @click="retryFetch">Try Again</button>
      </div>
  
      <button v-else @click="fetchToken" class="fetch-button">
        Get My Token Data
      </button>
    </div>
  </template>
  
  <script setup>
  const { fetchTokenData, decodeToken } = useJwt()
  const loading = ref(false)
  const error = ref('')
  const tokenData = ref(null)
  const countdown = ref('')
  const isExpired = ref(false)
  const tokenPercentage = ref(100)
  
  const fetchToken = async () => {
    try {
      loading.value = true
      error.value = ''
      const response = await fetchTokenData()
      tokenData.value = decodeToken(response.token)
      startCountdown()
    } catch (err) {
      error.value = err.message || 'Failed to load token data'
    } finally {
      loading.value = false
    }
  }
  
  const retryFetch = () => {
    tokenData.value = null
    fetchToken()
  }
  
  const formatDate = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleString()
  }
  
  const formatRelative = (timestamp) => {
    const seconds = Math.floor(Date.now() / 1000) - timestamp
    if (seconds < 60) return `${seconds} seconds ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    return `${Math.floor(seconds / 86400)} days ago`
  }
  
  const startCountdown = () => {
    if (!tokenData.value) return
  
    const update = () => {
      const now = Math.floor(Date.now() / 1000)
      const total = tokenData.value.exp - tokenData.value.iat
      const remaining = tokenData.value.exp - now
  
      isExpired.value = remaining <= 0
      tokenPercentage.value = Math.max(0, (remaining / total) * 100)
  
      if (isExpired.value) {
        countdown.value = '00:00:00'
        return
      }
  
      const hours = Math.floor(remaining / 3600)
      const minutes = Math.floor((remaining % 3600) / 60)
      const seconds = remaining % 60
  
      countdown.value = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':')
  
      requestAnimationFrame(update)
    }
  
    update()
  }
  </script>
  
  <style scoped>
  .jwt-viewer {
    max-width: 600px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  h2 {
    color: #333;
    text-align: center;
    margin-bottom: 1.5rem;
  }
  
  .fetch-button {
    display: block;
    width: 100%;
    padding: 1rem;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .fetch-button:hover {
    background: #4338ca;
  }
  
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 2rem;
    color: #64748b;
  }
  
  .token-display {
    margin-top: 1.5rem;
  }
  
  .token-meta {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .meta-item {
    padding: 1rem;
    background: #f8fafc;
    border-radius: 8px;
  }
  
  .meta-item h3 {
    font-size: 0.875rem;
    color: #64748b;
    margin-bottom: 0.25rem;
  }
  
  .meta-item p {
    font-weight: 500;
    margin-bottom: 0.25rem;
  }
  
  .meta-item small {
    color: #94a3b8;
    font-size: 0.75rem;
  }
  
  .progress-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  
  .progress {
    height: 100%;
    background: #10b981;
    transition: width 1s linear;
  }
  
  .progress.expired {
    background: #ef4444;
  }
  
  .time-remaining {
    text-align: center;
    font-size: 0.875rem;
    color: #64748b;
  }
  
  .time-remaining .expired {
    color: #ef4444;
  }
  
  .error {
    padding: 1rem;
    background: #fef2f2;
    border-radius: 8px;
    color: #ef4444;
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .error button {
    margin-top: 0.5rem;
    background: #ef4444;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>