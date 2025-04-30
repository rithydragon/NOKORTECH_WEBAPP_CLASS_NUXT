
export const useAuth = () => {
    const accessToken = useCookie('rty_access_token')
    const refreshToken = useCookie('rty_refresh_token')
  
    const refreshAccessToken = async () => {
      try {
        const {data,error} = await useHttp('/api/auth/refresh_token', {
          method: 'POST',
          body: { refreshToken: refreshToken.value }
        })
        accessToken.value = data.accessToken
        console.log("Access in composable : ", accessToken.value )
        return true
      } catch (error) {
        console.log('🔁 Refresh failed ---------------:', error)
        return false
      }
    }
  
    return { accessToken, refreshToken, refreshAccessToken }
  }
  