<template>
  <div class="p-6">
    <h2 class="text-xl font-bold mb-4">အဝယ်</h2>
    <CreateCustomer @customerSelected="onCustomerPicked" />
    <CreateProduct @productSelected="onProductPicked" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CreateCustomer from '@/components/customers/CreateCustomer.vue';
import CreateProduct from '@/components/products/CreateProduct.vue';
import type { Customer } from '@/types/Customer';
import type { Product } from '@/types/Product';

// Local layout tracking state variable
const activeCustomer = ref<Customer | null>(null);
const activeProduct = ref<Product | null>(null);

// Callback event fired directly by the child component
const onCustomerPicked = (customer: Customer | null) => {
  activeCustomer.value = customer;
  console.log("Parent component received selected customer data details:", customer);

  // You can now proceed to link transactions, weights, or receipts to customer.id!
};
const onProductPicked = (product: Product | null) => {
  activeProduct.value = product;
  console.log("Parent component received selected product data details:", product);

  // You can now proceed to link transactions, weights, or receipts to customer.id!
};
</script>
