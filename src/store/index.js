import { createStore } from 'vuex';

export default createStore({
  state: {
    messages: []
  },
  mutations: {
    addMessage(state, message) {
      state.messages.push(message);
      // 更新 localStorage
      localStorage.setItem('chat_messages', JSON.stringify(state.messages));
    },
    initializeState(state) {
      // 从 localStorage 加载状态
      const storedMessages = localStorage.getItem('chat_messages');
      if (storedMessages) {
        state.messages = JSON.parse(storedMessages);
      }
    }
  },
  actions: {
    addMessage({ commit }, message) {
      commit('addMessage', message);
    },
    initializeState({ commit }) {
      commit('initializeState');
    }
  }
});