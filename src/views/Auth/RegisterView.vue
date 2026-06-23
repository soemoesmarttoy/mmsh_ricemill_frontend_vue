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
      <div class="flex flex-col gap-1" style="margin-top: 10px;">
        <InputText name="confirmPassword" type="password" placeholder="လျှို့ဝှက်ကုဒ်" fluid />
        <Message v-if="$form.confirmPassword?.invalid" severity="error" size="small" variant="simple">{{
          $form.confirmPassword.error?.message }}</Message>
      </div>
      <Button type="submit" severity="secondary" label="စာရင်းသွင်းမည်" style="margin-top: 10px;" />
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
import { useAuthStore } from '../../stores/auth.ts';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
const toast = useToast();
const initialValues = ref({
  email: '',
  password: '',
  confirmPassword: ''
});

const resolver = ref(zodResolver(
  z.object({
    email: z.email({ message: 'အီးမေးလိပ်စာ မမှန်ပါ' }),
    password: z.string().min(6, { message: 'အနည်းဆုံး ၆ လုံးရှိရပါမည်' }),
    confirmPassword: z.string().min(6, { message: 'အနည်းဆုံး ၆ လုံးရှိရပါမည်' })
  })
    .refine((data) => data.password === data.confirmPassword, {
      message: "လျှို့ဝှက်ကုဒ်များ တူညီမှုမရှိပါ",
      path: ["confirmPassword"] // <-- This target maps the error message specifically onto the confirmPassword input field
    })
));

const onFormSubmit = async ({ valid, values }: { valid: boolean; values: Record<string, string> }) => {
  if (valid) {
    // values.email and values.password hold your actual typed strings safely
    const usernameFromEmail = values.email ? values.email.split("@")[0] : '';

    const payload = {
      username: usernameFromEmail || '',
      email: values.email || '',
      phone: "123456789",
      address: "No.123, Insein",
      companyName: usernameFromEmail || '',
      password: values.password || ''
    };

    await authStore.register(payload);

    toast.add({ severity: 'success', summary: 'အောင်မြင်ပါသည်', detail: 'ဖောင်တင်သွင်းပြီးပါပြီ', life: 3000 });
    router.push('/login');
  }
};
</script>
