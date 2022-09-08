/* eslint-disable */

import { defineStore } from 'pinia';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
import { ref, inject, unref, toRaw, computed } from 'vue';

export const useUserStore = defineStore('userStore', () => {
  const auth0 = useAuth0();
  const router = useRouter();
  const axios = inject('axios');
  const token = ref(null);
  const _profile = ref(null);
  const profile = computed(async () => {
    if (_profile.value == null) {
      await getUserProfile();
      return _profile;
    } else {
      return _profile;
    }
  })

  async function login() {
    try {
      token.value = await auth0.getAccessTokenSilently();
    } catch (error) {
      router.push('/login');
    }
  }

  async function getUserProfile() {
    let tryAgain = false;
    let attempts = 0;
    const id = auth0.user.value.sub;

    do {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_ENDPOINT}/users/${encodeURI(id)}`, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        });

        if (response != null) {
          tryAgain = false;
          _profile.value = response.data[0];
        }
      } catch (error) {
        tryAgain = true;
      }
      attempts += 1;
      console.log("ATTEMPT NUMBER:",attempts);
    } while (attempts < 3 && tryAgain)
  }

  return { login, getUserProfile, profile, token }
});
