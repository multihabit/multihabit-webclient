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
  const _habits = ref(null);
  const profile = computed(async () => {
    if (_profile.value == null) {
      await getUserProfile();
      return _profile;
    } else {
      return _profile;
    }
  })

  const habits = computed(async () => {
    if (_habits.value == null) {
      await getHabits();
      return _habits;
    } else {
      return _habits;
    }
  })

  async function login() {
    try {
      token.value = await auth0.getAccessTokenSilently();
    } catch (error) {
      router.push('/login');
    }
  }

  async function getHabits() {
    const id = auth0.user.value.sub;
    console.log("gettingHabits!");
    const now = new Date();
    const dateInteger = (now.getFullYear()*10000) + ((now.getMonth() + 1)*100) + now.getDate();

    try {
      const response = await axios.get(`${process.env.VUE_APP_API_ENDPOINT}/users/${encodeURI(id)}/habits`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        },
        params: {
          'includeActiveEntries': true,
          'dateInteger': dateInteger
        }
      });

      if (response != null) {
        const tmpHabits = {};
        response.data.data.forEach((habit)=>{
          if (tmpHabits[habit.category] == null) {
            tmpHabits[habit.category] = { [habit.habit_id]: habit}
          } else {
            tmpHabits[habit.category][habit.habit_id] = habit;
          }
        })
        _habits.value = tmpHabits;
      }
      
    } catch (error) {
      console.error(error.message);
    }
  }

  async function updateHabit(category,habit_id,value,isNewEntry) {
    const habit = _habits.value[category][habit_id];
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const dateInteger = (year*10000) + (month*100) + day;

    if (isNewEntry) {
      habit.activeEntry = {
        owner: auth0.user.value.sub,
        habit_id: habit_id,
        month: month,
        day: day,
        year: year,
        value: value
      }

      try {
        const response = axios.post(`${process.env.VUE_APP_API_ENDPOINT}/entries`, {
            userID: auth0.user.value.sub,
            habitID: habit_id,
            year: year,
            month: month,
            day: day,
            value: value
        }, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        });
      } catch (err) {
        console.error(err.message);
      }
    } else {
      habit.activeEntry.value = value;

      try {
        const response = axios.put(`${process.env.VUE_APP_API_ENDPOINT}/user/${encodeURI(auth0.user.value.sub)}/habit/${habit_id}/entry/${dateInteger}`,{
          year: year,
          month: month,
          day: day,
          value: value
        }, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        });
      } catch (err) {
        console.error(err.message);
      }
    }

    console.log(habit);
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
          _profile.value = response.data.data;
        }
      } catch (error) {
        tryAgain = true;
      }
      attempts += 1;
    } while (attempts < 3 && tryAgain)
  }

  return { login, getUserProfile, updateHabit, profile, habits, token }
});
