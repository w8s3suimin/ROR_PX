import { ref } from 'vue'
import { supabase } from './supabase'

export const isAdminRole = ref(false)
export const viewAsAdmin = ref(false)

export const initAdminState = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', session.user.id).single()
    if (profile?.role === 'admin') {
      isAdminRole.value = true
      viewAsAdmin.value = true
    }
  }
}
