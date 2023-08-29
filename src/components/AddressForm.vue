<template>
  <v-app>
    <v-container>
      <v-form @submit.prevent="submitForm">
        <v-row>
          <div class="flex-center">
            <v-title class="text-h3">Cadastro de Endereços</v-title>
          </div>
        </v-row>
        <v-row>
          <v-col class="mt-40" cols="12">
            <v-text-field v-model="address.zipCode" label="CEP" mask="########" :rules="zipCodeRules"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="address.street" label="Logradouro"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="address.complement" label="Complemento"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="address.neighborhood" label="Bairro"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="address.city" label="Localidade"></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6">
            <v-select v-model="address.state" :items="states" label="UF"></v-select>
          </v-col>
        </v-row>
        <v-row>
        <v-col cols="6">
          <v-date-picker v-model="address.creationDate" label="Data de criação" disabled></v-date-picker>
        </v-col>
        <v-col cols="6">
          <v-date-picker v-model="address.updateDate" label="Data de atualização" disabled></v-date-picker>
        </v-col>
      </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn class="m-4 mr-4" :color="selectedAddress ? 'success' : 'primary'" @click="selectedAddress ? updateAddress() : insertAddress()">
              {{ selectedAddress ? 'Salvar Edição' : 'Inserir endereço' }}
            </v-btn>
          </v-col>
        </v-row>
      </v-form>

      <!-- Título da lista de endereços -->
      <v-row v-if="addresses.length > 0">
        <div class="flex-center">
          <v-title class="text-h3">Lista de Endereços Cadastrados</v-title>
        </div>
      </v-row>

      <!-- Lista de endereços -->
      <v-row v-if="addresses.length > 0">
        <v-col cols="12">
          <v-list>
            <v-list-item v-for="(address, index) in addresses" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ address.street }}</v-list-item-title>
                <v-list-item-title>{{ address.complement }}</v-list-item-title>
                <v-list-item-title>{{ address.neighborhood }}</v-list-item-title>
                <v-list-item-title>{{ address.city }}</v-list-item-title>
                <v-list-item-title>{{ address.state }}</v-list-item-title>
                <v-list-item-title>{{ address.zipCode }}</v-list-item-title>
                <v-list-item-title>{{ formatDate(address.creationDate) }}</v-list-item-title>
                <v-list-item-title>{{ formatDate(address.updateDate) }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn class="mr-4" color="#ffe716" @click="editAddress(address)">Editar</v-btn>
                <v-btn class="mr-4" color="error" @click="deleteAddress(address)">Excluir</v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      title: '',
      address: {
        street: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      },
      states: [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MG',
        'MS',
        'MT',
        'PA',
        'PB',
        'PE',
        'PI',
        'PR',
        'RJ',
        'RN',
        'RO',
        'RR',
        'RS',
        'SC',
        'SE',
        'SP',
        'TO'
      ], // Lista de estados
      creationDate: '',
      updateDate: '',
      addresses: [],
      selectedAddress: null,
      zipCodeRules: [
        v => !!v || 'CEP é obrigatório',
        v => /^\d{5}\d{3}$/.test(v) || 'CEP inválido'
      ]
    };
  },
  methods: {
    insertAddress() {
      // Adiciona o endereço atual à lista de endereços
      const newAddress = {
        ...this.address,
        creationDate: new Date(),
        updateDate: new Date()
      };

      this.addresses.push(newAddress);
      console.log(newAddress);

      // Limpe o formulário
      this.clearForm();
    },
    editAddress(address) {
      this.selectedAddress = address;
      this.address = { ...address }; // Preenche os campos do formulário com os valores do endereço selecionado
    },
    updateAddress() {
      if (this.selectedAddress) {
        // Encontre o índice do endereço selecionado na lista
        const index = this.addresses.indexOf(this.selectedAddress);
        if (index !== -1) {
          // Atualiza os dados do endereço
          this.addresses[index] = { ...this.address, updateDate: new Date() };
          this.selectedAddress = null;
          this.clearForm();
        }
      }
    },
    deleteAddress(address) {
      const index = this.addresses.indexOf(address);
      if (index !== -1) {
        this.addresses.splice(index, 1);
      }
    },
    clearForm() {
      // Limpa todos os campos do formulário
      this.address = {
        street: '',
        complement: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: ''
      };
      this.creationDate = '';
      this.updateDate = '';
    },
    formatDate(dateString) {
      if (!dateString) {
        return '';
      }

      const date = new Date(dateString);
      const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
      return date.toLocaleDateString('pt-BR', options);
    },
    async fetchAddress() {
      const newZipCode = this.address.zipCode.replace('-', '');

      if (newZipCode.length === 8) {
        try {
          const response = await axios.get(`https://viacep.com.br/ws/${newZipCode}/json/`);
          const data = response.data;

          // Preenche os campos automaticamente
          this.address.street = data.logradouro;
          this.address.complement = data.complemento;
          this.address.neighborhood = data.bairro;
          this.address.city = data.localidade;
          this.address.state = data.uf;
        } catch (error) {
          console.error('Erro na requisição à API ViaCep:', error.message);
        }
      }
    },
  },
  watch: {
    async 'address.zipCode'(newZipCode) {
      // ...
      if (newZipCode.length === 8) {
        try {
          const response = await axios.get(`https://viacep.com.br/ws/${newZipCode}/json/`);
          const data = response.data;

          // Preenche os campos automaticamente
          this.address.street = data.logradouro;
          this.address.complement = data.complemento;
          this.address.neighborhood = data.bairro;
          this.address.city = data.localidade;
          this.address.state = data.uf;
        } catch (error) {
          console.error('Erro na requisição à API ViaCep:', error.message);
        }
      }
    },
  },
};
</script>

<style>
.flex-center {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin: 20px auto;
}
.text-h1 {
  font-size: 2.5rem; 
  font-weight: bolder; 
  margin-bottom: 20px; 
}
</style>
