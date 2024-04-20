<template>
  <h1>Welcome Chat</h1>
  <a-form
    :model="formState"
    name="basic"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    autocomplete="off"
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
      <a-input-password v-model:value="formState.password" />
    </a-form-item>

    <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 16 }">
      <a-checkbox v-model:checked="formState.remember">Remember me</a-checkbox>
    </a-form-item>

    <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
    </a-form-item>
  </a-form>
  <div>
    <GoogleLogin :callback="callback" />
  </div>
</template>
<script setup>
import { reactive } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { jwtDecode } from 'jwt-decode';



const router = useRouter();
const formState = reactive({
  username: '',
  password: '',
  remember: true,
});


const onFinish = async values => {
  try {
    const response = await axios.post('http://localhost:8000/submit', values);
    const token = response.data.token; 
    localStorage.setItem('token', token); 

    const decoded = jwtDecode(token); 
    
    if (decoded.role === 'admin') {
      router.push('/adminpage/adminlist');
    }
    else if(decoded.role ==='client'){
      router.push(`/edit/${decoded.id}`);
    } else {
      alert('No permission');
      history.go(-1); 
    }
  } catch (error) {
    console.error('Error submitting form', error.response || error);
    alert('Login failed');
  }
};

const callback= async (response1)=>{
  try{
    const response = await axios.post('http://localhost:8000/google',response1)
    const { token } = await response.data;
    localStorage.setItem("token",token);
    let decoded2 = jwtDecode(token);
    if(decoded2.role==='admin'){
      await router.push("/adminpage/adminlist");
    }
    else{
      await router.push(`/edit/${decoded2.id}"`)
    }
    
  } catch (err){
    console.log(err)
  }
}

</script>
  