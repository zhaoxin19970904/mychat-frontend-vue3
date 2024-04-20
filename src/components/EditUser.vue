<template>
    <a-form 
    :model="formState" 
    :label-col="labelCol" 
    :wrapper-col="wrapperCol"
    @finish="onFinish"
    @finishFailed="onFinishFailed"
    >
        <a-form-item
      label="Username"
      name="username"
      :rules="[{ required: true, message: 'Please input your username!' }]"
    >
      <a-input v-model:value="formState.username" />
    </a-form-item>

        
        <a-form-item
      label="Email"
      name="email"
      :rules="[{ required: true, message: 'Please input your email!' }]"
    >
      <a-input v-model:value="formState.email" />
    </a-form-item>

      <a-form-item label="Gender">
        <a-radio-group v-model:value="formState.gender">
          <a-radio value="male">Male</a-radio>
          <a-radio value="female">Female</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="birth" label="DatePicker" v-bind="config">
      <a-date-picker v-model:value="formState.birth" value-format="YYYY-MM-DD" />
    </a-form-item>

    <a-form-item has-feedback label="Age" name="age">
      <a-input-number v-model:value="formState.age" />
    </a-form-item>


      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" html-type="submit">Update New Information</a-button>
        <a-button  @click="cancel">Cancel</a-button>
      </a-form-item>
    </a-form>
    <div v-if="role==='client'">
    <a-button @click="chat">Add Chat</a-button>
    </div>
    <div>
    <a-modal v-model:open="open" title='Chat' @ok="handleOk">
       <h1>{{id}}</h1>
       <div class="chat-history">
       <div v-for="(msg, index) in message" :key="index" class="chat-message">
      <p>{{msg}}</p>
    </div>
</div>
    </a-modal>
  </div>

    <a-table :columns="columns" 
    :data-source="dataSource" 
    :pagination="pagination"
    @change="handleTableChange"

    bordered>
    <template #bodyCell="{ record, column }">
        <div v-if="column.dataIndex === 'show'">
      <a-button type="primary" @click="edit(record.id)">Show</a-button>
    </div>
    <div v-else-if="column.dataIndex === 'remove'">
      <a-button 
      type="primary" 
      @click="deleteRecord(record.id)" 
      style="background-color: #f5222d; 
      color: white;">Remove</a-button>
    </div>
    <div v-else>
      {{ record[column.dataIndex] }}
    </div>
    </template>
  </a-table>

  </template>
  <script setup>
import { reactive, onMounted,ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const open = ref(false);
let dataSource = ref(null)
let role = ref('')
let message = ref('');
const token = localStorage.getItem('token');
const decoded = jwtDecode(token);
role.value = decoded.role;
const router = useRouter();
const route = useRoute();
  const formState = reactive({
    username: '',
    password: '',
    type: 'admin',
    gender: 'male',
    age: 0,
    email: '',
    birth: new Date()
});

onMounted(() => {
  fetchData();
});

const fetchData = async () => {
  const userId = route.params.id; 
  if (userId) {
    try {
      const response = await axios.get(`http://localhost:8000/users/students/${userId}`);
      const userData = response.data;
      formState.username = userData.username;
      formState.password = userData.password; 
      formState.type = userData.type;
      formState.gender = userData.gender;
      formState.age = userData.age;
      formState.email = userData.email;
      formState.birth = userData.birth; 

      const chatResponse = await axios.get(`http://localhost:8000/getchat/${userId}`);

      dataSource.value = chatResponse.data.chats;
    
    } catch (error) {
      console.error('Failed to fetch user data:', error);
  
    }
  }

};

const onFinish = async () => {
  console.log('Success:', formState);

try {
    const userId = route.params.id; 
  await axios.post(`http://localhost:8000/users/update/${userId}`, formState);
  router.push('/adminpage/adminlist');
} catch (error) {
  console.error('Error submitting form', error.response || error);
  alert('Add failed');

}
}
const onFinishFailed = errorInfo => {
  console.log('Failed:', errorInfo);
};
const cancel = () => {
    
    console.log(formState.type)
    if(decoded.role==='admin'){
        router.go(-1);
    }
    else{
        router.push('/');
    }
};
  const labelCol = {
    style: {
      width: '150px',
    },
  };
  const wrapperCol = {
    span: 14,
  };

  const chat = () =>{
    router.push('/chat')
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: '8%',
    },
    {
      title: 'Id',
      dataIndex: 'id',
      width: '8%',
    },
    {
      title: 'Created_At',
      dataIndex: 'created_at',
      width: '8%',
    },

    {
      title: 'Show',
      dataIndex: 'show',
      width: '10%',

    },
    {
      title: 'Remove',
      dataIndex: 'remove',
      width: '10%',
    },
  ];
  const edit= async (id)=>{
    open.value = true;

    const chatmessage = await axios.get(`http://localhost:8000/chatdetails/${id}`)
    message.value = JSON.parse(chatmessage.data.chats[0].message);
    console.log(message)

  }
  const handleOk = () => {
  open.value = false;
};

const deleteRecord = async (key) => {
  try {
    await axios.post(`http://localhost:8000/deletechat/${key}`)
    console.log('Record deleted successfully');
    fetchData();
  } catch (error) {
    console.error('Failed to delete the record:', error);
  }
};
  </script>
<style scoped>
.chat-history {

  white-space: pre-wrap;
}
.chat-message pre {
    white-space: pre-wrap; 
    word-wrap: break-word; 
    margin: 0;
  }

    </style>
  