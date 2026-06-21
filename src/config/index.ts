const baseApi = import.meta.env.VITE_BASE_API || '/api'
const mock = import.meta.env.VITE_MOCK === 'true'
const mockApi = import.meta.env.VITE_MOCK_API || 'http://localhost:3000/mock'

export default {
  env: import.meta.env.MODE || 'development',
  baseApi,
  mock,
  mockApi
}
