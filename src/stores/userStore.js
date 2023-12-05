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
      // console.log("Grabbing config");
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

  async function updateConfig(config) {
    if (_profile.value == null) {
      await getUserProfile();
    }
    
    const id = auth0.user.value.sub;

    try {
      const response = await axios.put(`${process.env.VUE_APP_API_ENDPOINT}/users/${encodeURI(id)}/config`, {
          config,
          owner: id,
        }, {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        })
    } catch (error) {
      console.log(error);
    }

    _profile.value.config = config;
    _config.value = config;

    return _config.value;
  }

  async function login() {
    try {
      token.value = await auth0.getAccessTokenSilently();
    } catch (error) {
      router.push('/login');
    }
  }

  async function createHabit(label, category) {
    const id = auth0.user.value.sub;

    try {
      const response = await axios.post(`${process.env.VUE_APP_API_ENDPOINT}/habits`, {
        userID: id,
        label,
        category
      }, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      });

      if (response != null) {
        const { habit_id, label, category } = response.data.data;

        if (_habits.value == null) {
          await getHabits();
        }

        _habits.value[category][habit_id] = { habit_id, 
          label, 
          category 
        }

        if (_config.value == null) {
          await _initConfig();
        }

        _config.value.habits[category].habits.push({id: habit_id, label});
        
        await updateConfig(_config.value);
      }
    } catch (err) {
      console.error(err);
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

    // console.log(habit);
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

  async function updateEntry(dateInteger, habit, mode, value, note) {
    const { habit_id } = habit;
    if (_entries.value == null || _entries.value[dateInteger] == null) {
      const entries = await getEntries(dateInteger);
      if (entries == null) {
        _entries.value = {};
      }

      if (_entries.value[dateInteger] == null) {
        _entries.value[dateInteger] = {};
      }

      if (_entries.value[dateInteger][habit_id] == null) {
        _entries.value[dateInteger][habit_id] = {value: 0, note: ''}
      }
    }

    const user = auth0.user.value.sub;
    const year = parseInt(String(dateInteger).slice(0,4));
    const month = parseInt(String(dateInteger).slice(4,6));
    const day = parseInt(String(dateInteger).slice(6,8));
    const entry = _entries.value[dateInteger][habit_id];
    Object.assign(entry,{
      habit_id, 
      year, 
      month, 
      day, 
      owner: user, 
      dateInteger
    });

    if(value) {
      if (entry.value) {
        entry.value += value;
      } else {
        entry.value = value;
      }
    }

    if (note) {
      entry.note = note;
    }

    try {
      const response = await axios.put(`${process.env.VUE_APP_API_ENDPOINT}/user/${encodeURI(user)}/habit/${habit_id}/entry/${dateInteger}`, {
        ...(value != null && {value}),
        ...(note != null && {note}),
        mode
      }, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        }
      })
    } catch (error) {
      console.error(error.message);
      throw new Error(error);
    }
  }

  return { login, getUserProfile, updateHabit, getEntry, getEntries, updateEntry, updateConfig, createHabit, profile, habits, token, config }
});
