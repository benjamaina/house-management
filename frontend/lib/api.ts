import { jwtDecode } from "jwt-decode"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/"

interface LoginCredentials {
  username: string
  password: string
}

interface RegisterCredentials {
  username: string
  password: string
  email: string
  first_name?: string
  last_name?: string
}

interface TokenResponse {
  access: string
  refresh: string
}

interface DecodedToken {
  exp: number
  user_id: string
  username: string
}

// Helper to check if token is expired
const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token)
    const currentTime = Date.now() / 1000
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

// Get stored tokens
const getTokens = (): { accessToken: string | null; refreshToken: string | null } => {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null }
  }

  const accessToken = localStorage.getItem("accessToken")
  const refreshToken = localStorage.getItem("refreshToken")

  return { accessToken, refreshToken }
}

// Store tokens
const storeTokens = (tokens: TokenResponse) => {
  localStorage.setItem("accessToken", tokens.access)
  localStorage.setItem("refreshToken", tokens.refresh)
}

// Clear tokens
const clearTokens = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
}

// Refresh token
const refreshAccessToken = async (): Promise<string | null> => {
  const { refreshToken } = getTokens()

  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.access)
    return data.access
  } catch (error) {
    clearTokens()
    return null
  }
}

// Fetch with authentication
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  let { accessToken } = getTokens()

  // Check if token is expired and refresh if needed
  if (accessToken && isTokenExpired(accessToken)) {
    accessToken = await refreshAccessToken()
    if (!accessToken) {
      throw new Error("Authentication required")
    }
  }

  // Add authorization header if token exists
  const headers = {
    ...options.headers,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    "Content-Type": "application/json",
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  // If unauthorized and not already trying to refresh, try refreshing token
  if (response.status === 401 && url !== "/api/token/refresh/") {
    const newToken = await refreshAccessToken()

    if (newToken) {
      // Retry with new token
      return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      })
    }
  }

  return response
}

// Helper function to extract results from paginated response
const extractResults = (data: any) => {
  // Check if the response has a results property (paginated response)
  if (data && data.results !== undefined) {
    return data.results
  }
  // If not paginated, return the data as is
  return data
}

// API functions
export const api = {
  // Auth
  login: async (credentials: LoginCredentials): Promise<TokenResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error("Login failed")
    }

    const tokens = await response.json()
    storeTokens(tokens)
    return tokens
  },

  register: async (credentials: RegisterCredentials): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      throw new Error("Registration failed")
    }

    return response.json()
  },

  logout: async (): Promise<void> => {
    clearTokens()
    await fetch(`${API_BASE_URL}/admin/logout/`, {
      method: "POST",
    })
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const { accessToken, refreshToken } = getTokens()
    return !!accessToken && !isTokenExpired(accessToken)
  },

  // Tenants
  getTenants: async () => {
    const response = await fetchWithAuth("/api/tennants/")
    if (!response.ok) throw new Error("Failed to fetch tenants")
    const data = await response.json()
    return extractResults(data)
  },

  getTenant: async (id: string) => {
    const response = await fetchWithAuth(`/api/tennants/${id}/`)
    if (!response.ok) throw new Error("Failed to fetch tenant")
    return response.json()
  },

  createTenant: async (data: any) => {
    const response = await fetchWithAuth("/api/tennants/", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create tenant")
    return response.json()
  },

  updateTenant: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/api/tennants/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update tenant")
    return response.json()
  },

  deleteTenant: async (id: string) => {
    const response = await fetchWithAuth(`/api/tennants/${id}/`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete tenant")
    return response.ok
  },

  // Houses
  getHouses: async () => {
    const response = await fetchWithAuth("/api/houses/")
    if (!response.ok) throw new Error("Failed to fetch houses")
    const data = await response.json()
    return extractResults(data)
  },

  getHouse: async (id: string) => {
    const response = await fetchWithAuth(`/api/houses/${id}/`)
    if (!response.ok) throw new Error("Failed to fetch house")
    return response.json()
  },

  createHouse: async (data: any) => {
    const response = await fetchWithAuth("/api/houses/", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create house")
    return response.json()
  },

  updateHouse: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/api/houses/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update house")
    return response.json()
  },

  deleteHouse: async (id: string) => {
    const response = await fetchWithAuth(`/api/houses/${id}/`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete house")
    return response.ok
  },

  // Flat Buildings
  getFlats: async () => {
    const response = await fetchWithAuth("/api/flats/")
    if (!response.ok) throw new Error("Failed to fetch flat buildings")
    const data = await response.json()
    return extractResults(data)
  },

  getFlat: async (id: string) => {
    const response = await fetchWithAuth(`/api/flat/${id}/info/`)
    if (!response.ok) throw new Error("Failed to fetch flat building")
    return response.json()
  },

  createFlat: async (data: any) => {
    const response = await fetchWithAuth("/api/flats/", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("API Error:", errorData)
      throw new Error(`Failed to create flat building: ${response.status} ${response.statusText}`)
    }
    return response.json()
  },

  updateFlat: async (id: string, data: any) => {
    const response = await fetchWithAuth(`/api/flats/${id}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update flat building")
    return response.json()
  },

  deleteFlat: async (id: string) => {
    const response = await fetchWithAuth(`/api/flats/${id}/`, {
      method: "DELETE",
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("API Error:", errorData)
      throw new Error(`Failed to delete flat building: ${response.status} ${response.statusText}`)
    }
    return true
  },

  // Rent Payments
  getPayments: async () => {
    const response = await fetchWithAuth("/api/rentpayments/")
    if (!response.ok) throw new Error("Failed to fetch payments")
    const data = await response.json()
    return extractResults(data)
  },

  getPayment: async (id: string) => {
    const response = await fetchWithAuth(`/api/rentpayments/${id}/`)
    if (!response.ok) throw new Error("Failed to fetch payment")
    return response.json()
  },

  createPayment: async (data: any) => {
    const response = await fetchWithAuth("/api/rentpayments/", {
      method: "POST",
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create payment")
    return response.json()
  },
}

export default api
