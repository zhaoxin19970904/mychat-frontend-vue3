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
      label="Password"
      name="password"
      :rules="[{ required: true, message: 'Please input your password!' }]"
    >
      <a-input v-model:value="formState.password" />
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

      <a-form-item label="Type">
        <a-radio-group v-model:value="formState.type">
          <a-radio value="admin">Admin</a-radio>
          <a-radio value="client">Client</a-radio>
        </a-radio-group>
      </a-form-item>

      <a-form-item name="birth" label="DatePicker" v-bind="config">
      <a-date-picker v-model:value="formState.birth" value-format="YYYY-MM-DD" />
    </a-form-item>

    <a-form-item has-feedback label="Age" name="age">
      <a-input-number v-model:value="formState.age" />
    </a-form-item>


      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" html-type="submit">Add New User</a-button>
        <a-button  @click="cancel">Cancel</a-button>
      </a-form-item>
    </a-form>
  </template>
  <script setup>
  import { reactive } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router';
  const router = useRouter();
  const formState = reactive({
    username: '',
    password: '',
    type: 'admin',
    gender: 'male',
    age: 0,
    email: '',
    birth: new Date()
});
const onFinish = async () => {
  console.log('Success:', formState);

try {
  
  await axios.post('http://localhost:8000/users/student', formState);
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
  router.go(-1);
};
  const labelCol = {
    style: {
      width: '150px',
    },
  };
  const wrapperCol = {
    span: 14,
  };
  </script>
  