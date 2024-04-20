<template>
    <a-table :columns="columns" 
    :data-source="dataSource" 
    :pagination="pagination"
    @change="handleTableChange"

    bordered>
    <template #bodyCell="{ record, column }">
        <div v-if="column.dataIndex === 'edit'">
      <a-button type="primary" @click="edit(record.id)">Edit</a-button>
    </div>
    <div v-else-if="column.dataIndex === 'delete'">
      <a-button type="primary" @click="deleteRecord(record.id)" style="background-color: #f5222d; color: white;">Delete</a-button>
    </div>
    <div v-else>
      {{ record[column.dataIndex] }}
    </div>
    </template>
  </a-table>
  </template>
  <script setup>

  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';

const router = useRouter();

const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 2,showSizeChanger: true, pageSizeOptions: ['2', '5', '10']});


const fetchData = async () => {
  try {
    const pageSize = pagination.value.pageSize;
    const currentPage = pagination.value.current;
    const response = await axios.get(`http://localhost:8000/users/admins?page=${currentPage}&pageSize=${pageSize}`);
    const data = await response.data;
    dataSource.value = data.students; 
    pagination.value.totalPages = data.totalPages;
    pagination.value.total = data.totalItems;
  } catch (error) {
    console.error("Fetching error:", error);
  }
};

onMounted(() => {
  fetchData();
});
const edit = (key) => {
    console.log(key)
  router.push(`/edit/${key}`);
};

const deleteRecord = async (key) => {
  try {
    await axios.post(`http://localhost:8000/users/delete/${key}`)
    console.log('Record deleted successfully');
    fetchData();
  } catch (error) {
    console.error('Failed to delete the record:', error);
  }
};

const handleTableChange = (newPagination) => {
        pagination.value.current=newPagination.current;
        pagination.value.pageSize=newPagination.pageSize
        fetchData(newPagination);
      };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'username',
      width: '8%',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      width: '5%',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      width: '6%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      width: '6%',
    },
    {
      title: 'Birth',
      dataIndex: 'birth',
      width: '20%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: '20%',
    },
    {
      title: 'Edit',
      dataIndex: 'edit',
      width: '10%',

    },
    {
      title: 'Delete',
      dataIndex: 'delete',
      width: '10%',
    },
  ];
  

  
 </script>

 <style>

</style>