<template>
  <div class="card flex justify-center" style="width: 200px;">
    <Form v-slot="$form" :resolver="resolver" :initialValues="initialValues" @submit="onFormSubmit"
      class="flex flex-col gap-4 w-full sm:w-56">
      <div class="flex flex-col gap-1">
        <InputText name="email" type="text" placeholder="အီးေမး" fluid />
        <Message v-if="$form.email?.invalid" severity="error" size="small" variant="simple">{{
          $form.email.error?.message }}</Message>
      </div>
      <div class="flex flex-col gap-1" style="margin-top: 10px;">
        <InputText name="password" type="password" placeholder="လျှို့ဝှက်ကုဒ်" fluid />
        <Message v-if="$form.password?.invalid" severity="error" size="small" variant="simple">{{
          $form.password.error?.message }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="ဝင်ရောက်မည်" style="margin-top: 10px;" />
    </Form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { useToast } from "primevue/usetoast";
import { z } from 'zod';
import { Form } from '@primevue/forms';
import { Button, Message, InputText } from 'primevue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const initialValues = ref({
  email: '',
  password: ''
});

const resolver = ref(zodResolver(
  z.object({
    email: z.email({ message: 'အီးမေးလိပ်စာ မမှန်ပါ' }),
    password: z.string().min(3, { message: 'လျှို့ဝှက်ကုဒ် လိုအပ်ပါသည်' })
  })
));

const onFormSubmit = async ({ valid, values }: { valid: boolean, values: Record<string, string> }) => {
  if (!valid) return;

  try {
    // 1. Send form credentials to your Pinia API action
    await authStore.login({
      email: values.email!,
      password: values.password!
    });

    // 2. If successful, display success toast
    toast.add({
      severity: 'success',
      summary: 'အောင်မြင်ပါသည်',
      detail: 'စနစ်ထဲသို့ ဝင်ရောက်ပြီးပါပြီ။',
      life: 3000
    });

    // 3. Kick the user to the dashboard automatically
    router.push('/dashboard');

  } catch (error: unknown) {
    // 4. Handle failed login (wrong password, network down, etc.)
    toast.add({
      severity: 'error',
      summary: 'မှားယွင်းနေပါသည်',
      detail: error instanceof Error ? error.message : error || 'တစ်ခုခုမှားယွင်းနေပါသည်။',
      life: 4000
    });
  }
};
</script>
