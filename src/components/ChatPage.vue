<template>
    <div class="chat-container">
      <div class="chat-history">
        <div v-for="(msg, index) in store.state.messages" :key="index" class="chat-message">
        {{ msg }}
      </div>
      </div>
      <div class="chat-input">
        <input
          type="text"
          v-model="newMessage"
          @keyup.enter="send"
          placeholder="text message..."
        />
        <button @click="send">Send</button>
        <button @click="save">Save and Back</button>
        <button @click="back">Back</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import axios from 'axios';
  import router from '@/router';
  import { useStore } from 'vuex';
  import { jwtDecode } from 'jwt-decode';

  const store = useStore();
const newMessage = ref('');
const messages = reactive([]);
const newAws = ref('');
store.dispatch('initializeState');

const send = async () => {
  if (newMessage.value.trim() !== '') {
    const currentTime = new Date().toLocaleTimeString();
    const textform = `your_name: (${currentTime}) \n ${newMessage.value}`;
    store.dispatch('addMessage', textform);
    messages.push(textform); 
  const prompt = `${newMessage.value}`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt }
      ],
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer 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`,
      }
    });

    newAws.value = response.data.choices[0].message.content; 
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
  store.dispatch('addMessage', `AI (${currentTime}): \n ${newAws.value}`);
    messages.push(`AI (${currentTime}): \n ${newAws.value}`);
    newMessage.value = ''; 
  }
}
  const save = async ()=>{
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    try{
        const chat = {
            cid:decoded.id,
            name:decoded.username,
            message:JSON.stringify(messages),
        }
        console.log(chat)
        await axios.post(`http://localhost:8000/chatmessage`,chat);

        console.log("successful");
        localStorage.removeItem('chat_messages');
        router.go(-1);

        
    } catch (error){
        console.err("Error",error.response ? error.response.data : error.message)
    }
  }
  const back = () =>{
    router.go(-1)
  }
  </script>
  
  <style scoped>
  .chat-container {
    display: flex;
    flex-direction: column;
    padding: 10px;
    height: 400px;
    border: 1px solid #ccc;
  }
  
  .chat-history {
    flex-grow: 1;
    overflow-y: auto;
  }
  
  .chat-message {
    margin-bottom: 10px;
    padding: 5px;
    background-color: #f3f3f3;
  }
  
  .chat-input {
    display: flex;
    padding-top: 10px;
  }
  
  input[type="text"] {
    flex-grow: 1;
    margin-right: 10px;
    padding: 10px;
  }
  
  button {
    padding: 10px 20px;
  }

  .chat-history {
  /* 应用 CSS 以保持文本格式，包括换行 */
  white-space: pre-wrap;
}
.chat-message pre {
  white-space: pre-wrap; /* 保留空白符和格式 */
  word-wrap: break-word; /* 防止内容溢出 */
  margin: 0; /* 调整 pre 元素的默认外边距 */
}
/* 其他样式可以根据需要调整 */
  </style>