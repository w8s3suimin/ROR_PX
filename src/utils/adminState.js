import { ref } from 'vue'
import { supabase } from './supabase'

export const isAdminRole = ref(false)
export const viewAsAdmin = ref(false)

export const initAdminState = async () => {
  try {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      const { data: profile, error } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
      if (error) {
        console.error('Failed to fetch profile role:', error)
      } else if (profile?.role === 'admin') {
        isAdminRole.value = true
        viewAsAdmin.value = true
      }
    }
  } catch (err) {
    console.error('Error initializing admin state:', err)
  }
}
