<template>
  <div class="onboarding-mobile">
    <div class="onboarding-preamble">
      <div class="onboarding-preamble-icon">
        <fa-icon icon="feather-pointed"/>
      </div>
      <p>Multihabit offers a number of different tracking options for writers and non-writers alike. Please choose one of the options below. You can change your choice at any time.</p>
    </div>
    <div class="onboarding-selection">
      <div v-for="option in options" :key="option.value">
        <input type="radio" 
          :value="option.value" 
          v-model="selection"
          :id="option.value" />
        <label :for="option.value">{{option.label}}</label>
      </div>
    </div>
    <div class="onboarding-option-confirm-button" @click="confirmSelection">
      Confirm My Choice
    </div>
  </div>
</template>

<script>
  export default {
    name: 'onboarding-mobile'
  }
</script>

<script setup>
  import { ref, inject } from 'vue';
  import { useAuth0 } from '@auth0/auth0-vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';

  const axios = inject('axios');
  const auth0 = useAuth0();
  const token = await auth0.getAccessTokenSilently();
  const router = useRouter();
  const user = useUserStore();

  let selection = ref('words-writer');
  const options = [
    {
      label: 'Writer (Words)',
      value: 'words-writer',
    },
    {
      label: 'Writer (Time)',
      value: 'time-writer'
    },
    {
      label: 'Non-Writer',
      value: 'non-writer'
    }
  ]

  async function confirmSelection() {
    try {
      const result = await axios.post(`${process.env.VUE_APP_API_ENDPOINT}/onboarding`,{
        userID: auth0.user.value.sub,
        trackingMode: selection.value
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (result.status === 200) {
        await user.getUserProfile();
        router.push('/dashboard');
      }
    } catch (error) {
      console.log(error);
    }
  }
</script>

<style scoped lang="scss">
  .onboarding-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    .onboarding-preamble {
    padding: 2rem 2rem 1rem 2rem;
    font-size: 11pt;

      .onboarding-preamble-icon {
        margin-bottom: 1.5rem;
        font-size: 48pt;
      }
    }

    .onboarding-selection {
      padding-bottom: 2rem;
    }

    .onboarding-option-confirm-button {
      padding: 1rem;
      background-color: var(--nav-background);
      display: inline-block;
      color: rgba(220,220,220,1);
      border-radius: 4px;
    }
  }
</style>
