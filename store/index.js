import Vuex from 'vuex';

export const state = () => ({
  authUser: null,
});

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('setUser', req.session.authUser);
    } else {
      commit('setUser', null);
    }
  },

  login({ commit }, { email, password }) {
    return fetch('/api/auth/login', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then((res) => {
      if (res.status === 401) {
        throw new Error('Bad credentials');
      } else {
        return res.json();
      }
    })
    .then((authUser) => {
      commit('setUser', authUser);
      window.location.href = '/secret';
    });
  },

  logout({ commit }) {
    return fetch('/api/auth/logout', {
      credentials: 'same-origin',
      method: 'POST',
    })
    .then(() => {
      commit('setUser', null);
      window.location.href = '/';
    });
  },
};

export const getters = {};

export const mutations = {
  setUser(state, user) {
    state.authUser = user;
  },
};
