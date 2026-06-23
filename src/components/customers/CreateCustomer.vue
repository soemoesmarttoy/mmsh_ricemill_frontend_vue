<template>
  <div class="customer-manager-container w-full max-w-md mx-auto p-4 border rounded shadow-sm bg-white">

    <div v-if="loading" class="flex justify-center p-6">
      <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
      <span class="ml-2">အချက်အလက်များ ရယူနေပါသည်...</span>
    </div>

    <div v-else>
      <div v-if="filteredInitialsList.length == 0 && filteredCustomersList.length == 0"
        class="flex flex-wrap justify-center gap-4">
        <Button style="margin-left: 5px; margin-bottom: 5px; width: 30px; height: 30px;" v-for="initial in initialsList"
          :key="initial" severity="secondary" size="small" v-on:click="filterInitial(initial)">
          {{ initial }}
        </Button>
      </div>
      <div v-else-if="filteredCustomersList.length == 0" class="flex flex-wrap justify-center items-center gap-4">
        <Button
          style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; width: 50px; height: 30px;"
          v-for="initial in filteredInitialsList" :key="initial" severity="secondary" size="small"
          v-on:click="filterCustomers(initial)">
          {{ initial }}
        </Button>
        <Button
          style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; width: 50px; height: 30px; line-height: 1;"
          severity="danger" size="small" v-on:click="cancelFilteredInitialsList">
          <i class="pi pi-times" style="margin: 0; padding: 0; line-height: 1;"></i>
        </Button>
      </div>
      <div v-else-if="selectedCustomer == null || (filteredCustomersList.length > 0 && selectedCustomer == null)">
        <Button
          style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; padding-left: 5px; padding-right: 5px; height: 30px;"
          v-for="cust in filteredCustomersList" :key="cust.id" severity="secondary" size="small"
          v-on:click="selectCustomer(cust)">
          {{ cust.name }}
        </Button>
        <Button
          style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; width: 50px; height: 30px; line-height: 1;"
          severity="danger" size="small" v-on:click="cancelFilteredCustomersList">
          <i class="pi pi-times" style="margin: 0; padding: 0; line-height: 1;"></i>
        </Button>
      </div>
      <div class="flex flex-wrap gap-4">
        <InputText placeholder="ဖောက်သည်အမည်" :disabled="selectedCustomer != null" v-model="displayCustomerName" />
        <template v-if="submitting">
          <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
          <span class="ml-2">ဖောက်သည်အသစ် ထည့်သွင်းနေပါသည်...</span>
        </template>
        <template v-else>
          <Button v-if="selectedCustomer == null && customersList.filter(x => x.name === newCustomerName).length == 0"
            size=" small" style="margin-left: 10px;" :onclick="createCustomerFormSubmit">ထည့်သွင်းမည်</Button>
          <Button v-else
            style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; width: 50px; height: 30px; line-height: 1;"
            severity="danger" size="small" v-on:click="cancelSelectedCustomer">
            <i class="pi pi-times" style="margin: 0; padding: 0; line-height: 1;"></i>
          </Button>
        </template>


      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeMount, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/stores/auth'; // Using your Pinia store token

import { InputText, Button } from 'primevue';
import type { Customer } from '@/types/Customer';
import { API_URL_CUSTOMER } from '@/types/Customer';


// Define component events to communicate up to the parent component
const emit = defineEmits<{
  (e: 'customerSelected', customer: Customer | null): void
}>();

const toast = useToast();
const authStore = useAuthStore();

const customersList = ref<Customer[]>([]);
const initialsList = ref<string[]>([]);
const filteredInitialsList = ref<string[]>([]);
const filteredCustomersList = ref<Customer[]>([]);
const selectedCustomer = ref<Customer | null>(null);
const newCustomerName = ref("");
const loading = ref(true);
const submitting = ref(false);

const displayCustomerName = computed({
  get() {
    // What the input displays
    return selectedCustomer.value ? selectedCustomer.value.name : newCustomerName.value;
  },
  set(newValue) {
    // What happens when the user types
    if (!selectedCustomer.value) {
      newCustomerName.value = newValue;
    }
  }
});
watch(newCustomerName, (newName: string) => {
  if (newName.length > 0) {
    filteredCustomersList.value = customersList.value.filter(x => x.name.includes(newName));
  } else {
    filteredCustomersList.value = [];
  }
})
function filterInitial(initial: string) {
  filteredInitialsList.value = [...new Set(customersList.value.filter(x => x.initials.startsWith(initial)).map(x => x.initials))];
}
function cancelFilteredInitialsList() {
  filteredInitialsList.value = [];
}
function filterCustomers(initial: string) {
  filteredCustomersList.value = customersList.value.filter(x => x.initials === initial);
}
function cancelSelectedCustomer() {
  newCustomerName.value = '';
  selectedCustomer.value = null;
  emit('customerSelected', null);
}
function cancelFilteredCustomersList() {
  filteredCustomersList.value = [];
}
// Fetch customer data on mounted
onBeforeMount(async () => {
  try {
    const response = await fetch(`${API_URL_CUSTOMER}?companyId=${authStore.user!.companyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Customer fetch failed.');
    customersList.value = await response.json();
    const uniqueArray = [...new Set(customersList.value.map(x => x.initials[0] || ''))];

    // 2. Sort them so English (A-Z) and Burmese (က-အ) display in correct alphabetical order
    initialsList.value = uniqueArray.sort((a: string, b: string) => a.localeCompare(b, ['my', 'en']));
  } catch (err: unknown) {
    console.log(err)
    toast.add({ severity: 'error', summary: 'မအောင်မြင်ပါ', detail: 'ဒေတာ ဆွဲယူခြင်း မအောင်မြင်ပါ။', life: 3000 });
  } finally {
    loading.value = false;
  }
});

// Action when existing customer is clicked
const selectCustomer = (customer: Customer) => {
  selectedCustomer.value = customer;
  emit('customerSelected', customer);
};

async function createCustomerFormSubmit() {
  submitting.value = true;
  try {
    const response = await fetch(`${API_URL_CUSTOMER}?companyId=${authStore.user?.companyId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newCustomerName.value
      })
    });
    if (!response.ok) {
      throw new Error('Error creating a new customer');
    }
    const customer = await response.json();
    customersList.value = [...customersList.value, customer];
    const uniqueArray = [...new Set(customersList.value.map(x => x.initials[0] || ''))];
    // 2. Sort them so English (A-Z) and Burmese (က-အ) display in correct alphabetical order
    initialsList.value = uniqueArray.sort((a: string, b: string) => a.localeCompare(b, ['my', 'en']));
    selectCustomer(customer);
  } catch (e) {
    console.error(e);
  } finally {
    submitting.value = false;
  }
}

</script>

<style scoped>
.grouped-list-scroll::-webkit-scrollbar {
  width: 4px;
}

.grouped-list-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
</style>
