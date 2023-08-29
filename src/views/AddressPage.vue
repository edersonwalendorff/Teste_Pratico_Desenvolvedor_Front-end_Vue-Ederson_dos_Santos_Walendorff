<template>
  <v-app>
    <v-container>
      <AddressForm />
    </v-container>
  </v-app>
</template>

<script>
import AddressForm from '@/components/AddressForm.vue';

export default {
  components: {
    AddressForm,
  },
};
</script>
