export const useJwt = () => {
    const { $config } = useNuxtApp()
    const baseURL = $config.public.apiBase || 'http://localhost:3000'
  
    const fetchTokenData = async () => {
      try {
        const { data, error } = await useFetch(`${baseURL}/api/auth/token`, {
          headers: {
            'Authorization': `Bearer ${useCookie('access_token').value}`
          }
        })
  
        if (error.value) {
          throw new Error(error.value.message)
        }
  
        return data.value
      } catch (error) {
        console.log('Failed to fetch token data:', error)
        throw error
      }
    }
  
    const decodeToken = (token: string) => {
      try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        return JSON.parse(atob(base64))
      } catch (error) {
        console.log('Failed to decode token:', error)
        throw new Error('Invalid token format')
      }
    }
  
    return {
      fetchTokenData,
      decodeToken
    }
  }