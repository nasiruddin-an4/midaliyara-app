import AsyncStorage from '@react-native-async-storage/async-storage'

const BASE_URL = 'https://middlealiyara.vercel.app/api'
const CACHE_EXPIRATION_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Helper to fetch data with a caching strategy.
 * @param {string} endpoint - The API endpoint to fetch.
 * @param {boolean} forceRefresh - If true, bypass cache and fetch directly.
 */
async function fetchWithCache (endpoint, forceRefresh = false) {
  const cacheKey = `api_cache_${endpoint}`
  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`

  try {
    // 1. If we don't force a refresh, check the cache first.
    if (!forceRefresh) {
      const cachedRecordStr = await AsyncStorage.getItem(cacheKey)
      if (cachedRecordStr) {
        const cachedRecord = JSON.parse(cachedRecordStr)
        const now = Date.now()
        // If the cache is still fresh, return it immediately.
        if (now - cachedRecord.timestamp < CACHE_EXPIRATION_MS) {
          return cachedRecord.data
        }
      }
    }

    // 2. Fetch fresh data from network.
    const res = await fetch(url, {
      headers: {
        'x-api-key': 'maywopudb_jwt_secret_2026_secure_key_xk9q'
      }
    })
    if (!res.ok) throw new Error(`Failed to fetch ${url}`)

    const json = await res.json()
    const dataToCache = json && json.success ? json.data : json

    // 3. Save fresh data to cache.
    const newRecord = {
      timestamp: Date.now(),
      data: dataToCache
    }
    await AsyncStorage.setItem(cacheKey, JSON.stringify(newRecord))

    return dataToCache
  } catch (error) {
    console.warn(`fetchWithCache Warning (${endpoint}):`, error.message)

    // Fallback to cache even if it's expired, when offline/error occurs
    try {
      const cachedRecordStr = await AsyncStorage.getItem(cacheKey)
      if (cachedRecordStr) {
        const cachedRecord = JSON.parse(cachedRecordStr)
        return cachedRecord.data
      }
    } catch (cacheError) {
      // Ignore cache read error on fallback
    }

    // Return null if completely failed and no cache exists
    return null
  }
}

export async function fetchStats (forceRefresh = false) {
  try {
    const data = await fetchWithCache('/stats', forceRefresh)
    return data || {}
  } catch (error) {
    return {}
  }
}

export async function fetchActivities (forceRefresh = false) {
  try {
    const data = await fetchWithCache('/activities', forceRefresh)
    return data || []
  } catch (error) {
    return []
  }
}

export async function fetchActivityById (id, forceRefresh = false) {
  try {
    const data = await fetchWithCache(`/activities/${id}`, forceRefresh)
    return data
  } catch (error) {
    return null
  }
}

export async function fetchMembers (forceRefresh = false) {
  try {
    const data = await fetchWithCache('/members', forceRefresh)
    return data || []
  } catch (error) {
    return []
  }
}

export async function fetchGallery (forceRefresh = false) {
  try {
    const data = await fetchWithCache('/gallery', forceRefresh)
    return data || []
  } catch (error) {
    return []
  }
}

export async function fetchExpenses (forceRefresh = false) {
  try {
    const data = await fetchWithCache('/expenses', forceRefresh)
    return data || []
  } catch (error) {
    return []
  }
}

export async function fetchPayments (forceRefresh = false) {
  try {
    const data = await fetchWithCache('/payments', forceRefresh)
    return data || []
  } catch (error) {
    return []
  }
}

export async function submitMemberApplication (application) {
  try {
    const response = await fetch(`${BASE_URL}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'maywopudb_jwt_secret_2026_secure_key_xk9q'
      },
      body: JSON.stringify(application)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || 'Failed to submit join request')
    }

    return await response.json()
  } catch (error) {
    throw error
  }
}

export async function uploadJoinProfileImage (uri) {
  const formData = new FormData()

  const filename = uri.split('/').pop() || 'profile.jpg'
  const match = filename.match(/\.([a-zA-Z0-9]+)$/)
  const extension = match?.[1]?.toLowerCase() || 'jpg'
  const mimeType = extension === 'jpg' ? 'image/jpeg' : `image/${extension}`

  formData.append('file', {
    uri,
    name: filename,
    type: mimeType
  })

  const response = await fetch(`${BASE_URL}/join/upload`, {
    method: 'POST',
    body: formData
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => null)
    throw new Error(errorData?.message || 'Failed to upload image')
  }

  return await response.json()
}

export async function verifyAccountAccess (password) {
  try {
    const res = await fetch(
      'https://middlealiyara.vercel.app/api/auth/account-access',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      }
    )
    if (!res.ok) {
      const errorJson = await res.json()
      throw new Error(errorJson.error || 'ভুল পাসওয়ার্ড')
    }
    return await res.json()
  } catch (error) {
    throw error
  }
}

export async function savePushToken (token, userId = null) {
  try {
    const response = await fetch(`${BASE_URL}/notifications/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'maywopudb_jwt_secret_2026_secure_key_xk9q'
      },
      body: JSON.stringify({ token, userId })
    })

    if (!response.ok) {
      throw new Error('Failed to register push token')
    }

    return await response.json()
  } catch (error) {
    console.warn('savePushToken Error:', error)
    return null
  }
}

export async function registerPushToken (token, userId) {
  try {
    // Replace with your actual admin dashboard endpoint for storing tokens
    const response = await fetch(`${BASE_URL}/notifications/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'maywopudb_jwt_secret_2026_secure_key_xk9q'
      },
      body: JSON.stringify({ token, userId: userId || 'Guest' })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || 'Failed to register push token')
    }

    return await response.json()
  } catch (error) {
    console.warn('Failed to register push token:', error.message)
    return null
  }
}
