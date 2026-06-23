<template>
  <div class="product-manager-container w-full max-w-md mx-auto p-4 border rounded shadow-sm bg-white">

    <div v-if="loading" class="flex justify-center p-6">
      <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
      <span class="ml-2">အချက်အလက်များ ရယူနေပါသည်...</span>
    </div>

    <div v-else>
      <div v-if="filteredInitialsList.length == 0 && filteredProductsList.length == 0"
        class="flex flex-wrap justify-center gap-4">
        <Button style="margin-left: 5px; margin-bottom: 5px; width: 30px; height: 30px;" v-for="initial in initialsList"
          :key="initial" severity="secondary" size="small" v-on:click="filterInitial(initial)">
          {{ initial }}
        </Button>
      </div>
      <div v-else-if="filteredProductsList.length == 0" class="flex flex-wrap justify-center items-center gap-4">
        <Button
          style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; width: 50px; height: 30px;"
          v-for="initial in filteredInitialsList" :key="initial" severity="secondary" size="small"
          v-on:click="filterProducts(initial)">
          {{ initial }}
        </Button>
        <Button
          style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; width: 50px; height: 30px; line-height: 1;"
          severity="danger" size="small" v-on:click="cancelFilteredInitialsList">
          <i class="pi pi-times" style="margin: 0; padding: 0; line-height: 1;"></i>
        </Button>
      </div>
      <div v-else-if="selectedProduct == null || (filteredProductsList.length > 0 && selectedProduct == null)">
        <Button
          style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; padding-left: 5px; padding-right: 5px; height: 30px;"
          v-for="cust in filteredProductsList" :key="cust.id" severity="secondary" size="small"
          v-on:click="selectProduct(cust)">
          {{ cust.name }}
        </Button>
        <Button
          style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; width: 50px; height: 30px; line-height: 1;"
          severity="danger" size="small" v-on:click="cancelFilteredProductsList">
          <i class="pi pi-times" style="margin: 0; padding: 0; line-height: 1;"></i>
        </Button>
      </div>
      <div class="flex flex-wrap gap-4">
        <InputText placeholder="ကုန်ပစ္စည်းအမည်" :disabled="selectedProduct != null" v-model="displayProductName" />
        <template v-if="submitting">
          <i class="pi pi-spin pi-spinner text-2xl text-primary"></i>
          <span class="ml-2">ကုန်ပစ္စည်းအသစ် ထည့်သွင်းနေပါသည်...</span>
        </template>
        <template v-else>
          <Button v-if="selectedProduct == null && productsList.filter(x => x.name === newProductName).length == 0"
            size=" small" style="margin-left: 10px;" :onclick="createProductFormSubmit">ထည့်သွင်းမည်</Button>
          <Button v-else
            style="display: inline-flex; align-items: center; justify-content: center; vertical-align: middle; padding: 0; margin-left: 5px; margin-bottom: 5px; width: 50px; height: 30px; line-height: 1;"
            severity="danger" size="small" v-on:click="cancelSelectedProduct">
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
import type { Product } from '../../types/Product';
import { API_URL_PRODUCT } from '../../types/Product';


// Define component events to communicate up to the parent component
const emit = defineEmits<{
  (e: 'productSelected', product: Product | null): void
}>();

const toast = useToast();
const authStore = useAuthStore();

const productsList = ref<Product[]>([]);
const initialsList = ref<string[]>([]);
const filteredInitialsList = ref<string[]>([]);
const filteredProductsList = ref<Product[]>([]);
const selectedProduct = ref<Product | null>(null);
const newProductName = ref("");
const loading = ref(true);
const submitting = ref(false);

const displayProductName = computed({
  get() {
    // What the input displays
    return selectedProduct.value ? selectedProduct.value.name : newProductName.value;
  },
  set(newValue) {
    // What happens when the user types
    if (!selectedProduct.value) {
      newProductName.value = newValue;
    }
  }
});
watch(newProductName, (newName: string) => {
  if (newName.length > 0) {
    filteredProductsList.value = productsList.value.filter(x => x.name.includes(newName));
  } else {
    filteredProductsList.value = [];
  }
})
function filterInitial(initial: string) {
  filteredInitialsList.value = [...new Set(productsList.value.filter(x => x.initials.startsWith(initial)).map(x => x.initials))];
}
function cancelFilteredInitialsList() {
  filteredInitialsList.value = [];
}
function filterProducts(initial: string) {
  filteredProductsList.value = productsList.value.filter(x => x.initials === initial);
}
function cancelSelectedProduct() {
  newProductName.value = '';
  selectedProduct.value = null;
  emit('productSelected', null);
}
function cancelFilteredProductsList() {
  filteredProductsList.value = [];
}
// Fetch product data on mounted
onBeforeMount(async () => {
  try {
    const response = await fetch(`${API_URL_PRODUCT}?companyId=${authStore.user!.companyId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error('Product fetch failed.');
    productsList.value = await response.json();
    const uniqueArray = [...new Set(productsList.value.map(x => x.initials[0] || ''))];

    // 2. Sort them so English (A-Z) and Burmese (က-အ) display in correct alphabetical order
    initialsList.value = uniqueArray.sort((a: string, b: string) => a.localeCompare(b, ['my', 'en']));
  } catch (err: unknown) {
    console.log(err)
    toast.add({ severity: 'error', summary: 'မအောင်မြင်ပါ', detail: 'ဒေတာ ဆွဲယူခြင်း မအောင်မြင်ပါ။', life: 3000 });
  } finally {
    loading.value = false;
  }
});

// Action when existing product is clicked
const selectProduct = (product: Product) => {
  selectedProduct.value = product;
  emit('productSelected', product);
};

async function createProductFormSubmit() {
  submitting.value = true;
  try {
    const response = await fetch(`${API_URL_PRODUCT}?companyId=${authStore.user?.companyId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newProductName.value
      })
    });
    if (!response.ok) {
      throw new Error('Error creating a new product');
    }
    const product = await response.json();
    productsList.value = [...productsList.value, product];
    const uniqueArray = [...new Set(productsList.value.map(x => x.initials[0] || ''))];
    // 2. Sort them so English (A-Z) and Burmese (က-အ) display in correct alphabetical order
    initialsList.value = uniqueArray.sort((a: string, b: string) => a.localeCompare(b, ['my', 'en']));
    selectProduct(product);
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
