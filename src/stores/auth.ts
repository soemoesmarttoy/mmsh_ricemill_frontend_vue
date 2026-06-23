import { defineStore } from "pinia";
import { ref, computed } from "vue";

// Define an interface for your user data structure so TypeScript stops using 'unknown'
interface UserProfile {
  email: string;
  username: string;
  userId: string;
  companyId: string;
  role: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(
    localStorage.getItem('user_data') ? JSON.parse(localStorage.getItem('user_data')!) : null
  );

  const token = ref<string | null>(localStorage.getItem('auth_token'));
  const isLoggedIn = computed(() => user.value !== null);

  async function login(credentials: Record<string, string>) {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'ဝင်ရောက်မှု မအောင်မြင်ပါ။ သင်၏ အီးမေးလ်နှင့် လျှို့ဝှက်နံပါတ်ကို မှန်ကန်စွာ ထည့်သွင်းပါ။');
      }

      const data = await response.json();

      // FIX HERE: Match whatever your backend sends.
      // If backend sends 'token', use data.token for both state and localStorage!
      console.log(data);
      token.value = data.authToken;
      localStorage.setItem('auth_token', data.authToken);

      // Construct user object safely based on your backend response shape
      const userProfile: UserProfile = {
        email: credentials.email || '',
        username: data.username || data.user?.username,
        userId: data.userId || data.user?.id,
        companyId: data.companyId || data.user?.companyId,
        role: data.role || data.user?.role
      };

      user.value = userProfile;
      localStorage.setItem('user_data', JSON.stringify(userProfile));

      return data;
    } catch (error) {
      console.error('API Authentication Error: ', error);
      throw error;
    }
  }

  async function register(credentials: Record<string, string>) {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'စာရင်းသွင်းမှု မအောင်မြင်ပါ။');
      }
      return await response.json();
    } catch (error) {
      console.error('API Registration Error: ', error);
      throw error;
    }
  }

  function logout() {
    token.value = null;
    user.value = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  return { user, token, isLoggedIn, login, logout, register };
});
