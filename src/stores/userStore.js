/* eslint-disable */

import { defineStore } from 'pinia';
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router';
import { ref, inject, unref, toRaw, computed } from 'vue';
import { getNowInteger } from '@/helpers/util';

export const useUserStore = defineStore('userStore', () => {
  const auth0 = useAuth0();
  const router = useRouter();
  const axios = inject('axios');
  const token = ref(null);
  const _profile = ref(null);
  const _habits = ref(null);
  const _entries = ref(null);
  const _config = ref(null);

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

  const config = computed(async () => {
    if (_config.value == null) {
      await _initConfig();
      console.log("Grabbing config");
      return _config;
    } else {
      return _config;
    }
  })

  async function _initConfig() {
    if (_profile.value == null) {
      await getUserProfile();
    }

    if (_profile.value.config == null) {

      if (_habits.value == null) {
        await getHabits();
      }

      _config.value = {
        habits: {
          'professional': {
            columns: 3,
            habits: []
          },
          'self-improvement': {
            columns: 3,
            habits: []
          },
          'leisure': {
            columns: 3,
            habits: []
          }
        },
      };

      for (let [category, habits] of Object.entries(_habits.value)) {
        for (let [id, habit] of Object.entries(habits)) {
          _config.value.habits[category].habits.push({id, label: habit.label});
          _profile.value.config = _config.value;
        }
      }
    } else {
      _config.value = _profile.value.config;
    }
  }

  async function login() {
    try {
      token.value = await auth0.getAccessTokenSilently();
    } catch (error) {
      router.push('/login');
    }
  }

  async function getHabits() {
    const id = auth0.user.value.sub;
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

    const entry = {
      ower: auth0.user.value.sub,
      habit_id,
      month,
      day,
      year,
      value
    };

    if (isNewEntry) {
      habit.activeEntry = entry

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

    if (_entries.value && _entries.value[dateInteger]) {
      _entries.value[dateInteger][habit_id] = entry;
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

  async function getEntries(dateInteger) {
    if (_entries.value && _entries.value[dateInteger]) {
      return _entries.value[dateInteger];
    } else {
      const id = auth0.user.value.sub;

      try {
        const response = await axios.get(`${process.env.VUE_APP_API_ENDPOINT}/users/${encodeURI(id)}/entries/${dateInteger}`, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        });

        if (response != null) {
          _entries.value = {..._entries.value, [dateInteger]: response.data.data}
        }

        return _entries.value;
      } catch (error) {
        console.error(error.message);
      }
    }
  }

  async function getEntry(dateInteger, habit_id) {
    return _entries.value[dateInteger][habit_id];
  }

  async function updateEntry(dateInteger, habit, value, note, isNewEntry) {
    const nowInteger = getNowInteger();
    const {habit_id, category} = habit;
    let entry;

    if(isNewEntry) {
      entry = await _createEntry(dateInteger,habit_id,value, note)
    } else {
      entry = await _updateEntry(dateInteger,habit_id,value, note)
    }

    if (nowInteger === dateInteger) {
      _habits.value[category][habit_id].activeEntry = entry;
    }
    
    return entry;
  }

  /**
   * 
   */
  async function _createEntry(dateInteger,habit_id,value = 0, note = '') {
    const year = Math.floor(dateInteger/10000);
    const month = Math.floor((dateInteger - year*10000)/100);
    const day = dateInteger%100;
    const owner = auth0.user.value.sub;
    const entry = {
      year,
      month,
      day,
      value,
      note,
      dateInteger,
      habit_id,
      owner
    }
    
    if (_entries.value[dateInteger]==null) {
      _entries.value[dateInteger] = {};
    }

    _entries.value[dateInteger][habit_id] = entry;

    try {
      const response = axios.post(`${process.env.VUE_APP_API_ENDPOINT}/entries`, {
        userID: owner,
        habitID: habit_id,
        year: year,
        month: month,
        day: day,
        value: value,
        note: note
      }, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
    } catch (error) { 
      console.error(err.message);
      throw new Error(error);
    }

    return entry;
  }

  async function _updateEntry(dateInteger,habit_id,value, note) {
    const user = auth0.user.value.sub;

    if (value) {
      _entries.value[dateInteger][habit_id].value = value;
    }

    if (note) {
      _entries.value[dateInteger][habit_id].note = note;
    }

    try {
      const response = axios.put(`${process.env.VUE_APP_API_ENDPOINT}/user/${encodeURI(user)}/habit/${habit_id}/entry/${dateInteger}`, {
        ...(value != null && {value}),
        ...(note != null && {note})
      }, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });
    } catch(error) {
      console.error(error.message);
      throw new Error(error);
    }
    return _entries.value[dateInteger][habit_id];
  }

  return { login, getUserProfile, updateHabit, getEntry, getEntries, updateEntry, profile, habits, token, config }
});
