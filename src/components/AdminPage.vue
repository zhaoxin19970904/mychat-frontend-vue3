<template>
    <div>
      <h1>Hello, {{ userName }}</h1>
      <a-button @click="addNewUser">Add New User</a-button>
      <a-button @click="logOut">Log Out</a-button>
      <a-menu v-model:selectedKeys="current" mode="horizontal">
        <a-menu-item key="admin">
          <router-link to="/adminpage/adminlist">Admin List</router-link>
        </a-menu-item>
        <a-menu-item key="client">
          <router-link to="/adminpage/clientlist">Client List</router-link>
        </a-menu-item>
      </a-menu>
      <router-view></router-view>
    </div>
  </template>
  <script setup>
  import { ref } from 'vue';
  import router from '@/router';
  import {jwtDecode} from 'jwt-decode'; // 确保正确地导入了 jwtDecode
  
  const current = ref(['admin']);
  let userName = ref('');
  
  // 封装了解码 Token 的函数
  function decodeToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        userName.value = decoded.username; // 假设 token 确实包含用户名信息
        console.log(decoded.username, decoded.role, decoded.id);
      } catch (error) {
        console.error(error);
        // 可以在这里处理错误，例如显示错误信息或重定向到登录页面
        // router.push('/login');
      }
    }
  }
  
  // 解码 Token
  decodeToken();
  
  // 登出函数
  const logOut = () => {
    localStorage.removeItem('token');
    router.push('/');
  }
  
  // 添加新用户函数
  const addNewUser = () => {
    router.push('/adduser');
  }
  </script>
  