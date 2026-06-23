<template>
  <header>
    <!-- Your right-aligned menu bar stays globally fixed at the top -->
    <div class="card right-aligned-container">
      <Button style="margin-right: 10px;" type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true"
        aria-controls="overlay_menu" />
      <Menu ref="menu" id="overlay_menu" :model="menuItems" :popup="true" />
    </div>
  </header>

  <main>
    <Toast></Toast>
    <!-- CRUCIAL: This component loads the matching view based on the URL (e.g. /login) -->
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Menu, Button, Toast } from "primevue";
import { useAuthStore } from "./stores/auth";
import { useRouter } from "vue-router";
const router = useRouter();
// Providing explicit template ref type for PrimeVue Menu to avoid TS errors
const menu = ref<InstanceType<typeof Menu> | null>(null);
const authStore = useAuthStore();

const menuItems = computed(() => {
  if (authStore.isLoggedIn) {
    return [
      {
        label: '',
        items: [
          { label: 'ပင်မစာမျက်နှာ', icon: 'pi pi-home', command: () => router.push('/dashboard') },
          { label: 'အဝယ်', icon: 'pi pi-shopping-cart', command: () => router.push('/buy') },
          { label: 'အရောင်း', icon: 'pi pi-percentage', command: () => router.push('/sell') },
          { label: 'ထွက်ခွာမည်', icon: 'pi pi-sign-out', command: () => { authStore.logout(); router.push('/'); } },
        ]
      }
    ]
  } else {
    return [
      {
        label: 'လုပ်ဆောင်ချက်များ',
        items: [
          { label: 'ဝင်ရောက်မည်', icon: 'pi pi-sign-in', command: () => router.push('/login') },
          { label: 'စာရင်းသွင်းမည်', icon: 'pi pi-user-plus', command: () => router.push('/register') }
        ]
      }
    ]
  }
})

const toggle = (event: Event) => {
  menu.value?.toggle(event);
};
</script>

<style scoped>
.card {
  margin-top: 10px;
}

.right-aligned-container {
  display: flex;
  justify-content: flex-end;
  /* Pushes the child button to the right */
  width: 100%;
  /* Forces the container to span the full width available */
  box-sizing: border-box;
  /* Prevents any unexpected padding layout issues */
}

main {
  margin-left: 20px;
}
</style>
