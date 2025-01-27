<script setup lang="ts">
import { computed, reactive, ref } from 'vue' 
import type { Ref, UnwrapRef } from 'vue' 
import { CheckOutlined, EditOutlined, CloudUploadOutlined, SaveOutlined, FileAddOutlined } from '@ant-design/icons-vue'
import { cloneDeep } from 'lodash-es'
import { useUser } from '../Store/useUser.ts'
import { storeToRefs } from 'pinia'
import { invoke } from '@tauri-apps/api/core'
import { message } from 'ant-design-vue'
import axios from 'axios'

const { isLogin ,key } = storeToRefs(useUser())
const load_loading = ref<boolean>(false)

const now_input = reactive({
  name: '',
  age: '',
  job: '',
  other: '',
})

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
  {
    title: '操作',
    dataIndex: 'operation',
  },
]

interface DataItem {
  key: string 
  name: string 
  age: string 
  job: string 
  other: string
}


const dataSource: Ref<DataItem[]> = ref([])
const count = computed(() => dataSource.value.length + 1) 
const editableData: UnwrapRef<Record<string, DataItem>> = reactive({}) 

const edit = (key: string) => {
  editableData[key] = cloneDeep(dataSource.value.filter(item => key === item.key)[0]) 
} 
const save = (key: string) => {
  Object.assign(dataSource.value.filter(item => key === item.key)[0], editableData[key]) 
  delete editableData[key] 
} 

const onDelete = (key: string) => {
  dataSource.value = dataSource.value.filter(item => item.key !== key) 
}

const handleAdd = () => {
  const newData = {
    key: count.value.toString(),
    name: now_input.name,
    age: now_input.age,
    job: now_input.job,
    other: now_input.other,
  }
  dataSource.value.push(newData)
  message.success('已添加')
  now_input.name = ''
  now_input.age = ''
  now_input.job = ''
  now_input.other = ''
}

const btn_is_valid = () => (now_input.name === '' || now_input.age === '' || now_input.job === '' || now_input.other === '')

const upload = async () => {
  try {
    const res = await axios.post('https://blog.hmountainln.cn/api/store-json',{
      json: dataSource.value
    },{ headers: { Authorization: key.value } })
    message.success(res.data)
  } catch (err: any) {
    message.error(err.response.data)
  }
}

const saveToFile = () => {
  invoke('save_neu', { data: JSON.stringify(dataSource.value) })
}

const loadFile = async () => {
  load_loading.value = true
  try {
    const res: string = await invoke('load_neu')
    dataSource.value = JSON.parse(res)
    message.success('载入成功')
  } catch (_) {
    message.error('选择的文件不合法')
  }
  finally {
    load_loading.value = false
  }
}
</script>

<template>
  <a-table bordered :data-source="dataSource" :columns="columns" :scroll="{ y: 300 }">
    <template #title>
      <a-flex justify="space-evenly">
        <a-input v-model:value="now_input.name" addon-before="姓名" class="inp" />
        <a-input v-model:value="now_input.age" addon-before="年龄" class="inp" />
        <a-input v-model:value="now_input.job" addon-before="职业" class="inp" />
        <a-input v-model:value="now_input.other" addon-before="备注" class="inp" />
        <a-button class="editable-add-btn" style="margin-bottom: 8px" @click="handleAdd" :disabled="btn_is_valid()">添加数据</a-button>
      </a-flex>

    </template>
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'name'">
        <div class="editable-cell">
          <div v-if="editableData[record.key]" class="editable-cell-input-wrapper">
            <a-input v-model:value="editableData[record.key].name" @pressEnter="save(record.key)" />
            <check-outlined class="editable-cell-icon-check" @click="save(record.key)" />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || ' ' }}
            <edit-outlined class="editable-cell-icon" @click="edit(record.key)" />
          </div>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <a-popconfirm
            v-if="dataSource.length"
            title="确定要删除吗?"
            @confirm="onDelete(record.key)"
        >
          <a>删除行</a>
        </a-popconfirm>
      </template>
    </template>
    <template #footer>
      <a-flex justify="space-evenly">
        <a-button-group>
          <a-button type="primary" :disabled="count === 1" @click="saveToFile"><SaveOutlined />保存到本地</a-button>
          <a-button type="primary" @click="loadFile" :loading="load_loading"><FileAddOutlined />从本地读取</a-button>
        </a-button-group>
        <a-button type="primary" :disabled="!isLogin || count === 1" @click="upload"><CloudUploadOutlined />上传到云服务器</a-button>
      </a-flex>
    </template>
  </a-table>
</template>

<style scoped lang="less">
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.inp {
  width: 250px;
}
</style>