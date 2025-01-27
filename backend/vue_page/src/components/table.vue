<script setup lang="ts">

const dataSource = defineModel()

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    width: '20%',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width: '20%',
  },
  {
    title: '职业',
    dataIndex: 'job',
    width: '20%',
  },
  {
    title: '备注',
    dataIndex: 'other',
    width: '20%',
  },
]

</script>

<template>
    <a-table :dataSource="dataSource" :columns="columns" />
</template>