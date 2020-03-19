<template>
  <div>
  <a-table 
    :columns="columns" 
    :dataSource="data"
    :rowKey="item => item._id"
    :pagination="pagination"
    :loading="loading"
    @change="handleTableChange"
    v-if="mode == 'cardSet'"
  >
    <a slot="name" slot-scope="text">{{text}}</a>
    <span slot="action" slot-scope="text, record">
      <a-button type="primary" shape="circle" icon="edit" style='margin: 5px' @click="handleEdit(record._id)"></a-button>
    </span>
  </a-table>
  <card :setId="current_set_id" :mode="mode" v-if="mode == 'card'"></card>
  </div>
</template>
<script>
  import Card from './card';
  import axios from 'axios';

  const instance = axios.create({
    baseURL: 'http://localhost:12133/api/card'
  });
  instance.defaults.headers.common['b-json-web-token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWU3MmU2MGVhNjMwNGYyOTUwYzc5MDUxIiwiaWF0IjoxNTg0NTg4MzIzLCJleHAiOjE1ODQ2NzQ3MjN9.86t3LxUDqr-qkWRP76jCR3nzw87vJgrg8QggGAmPVfk';

  const columns = [
    {
      title: '卡组名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '卡牌数',
      dataIndex: 'count',
      key: 'count',
    },
    {
      title: '简介',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' },
    },
  ];

  export default {
    data() {
      return {
        data: [],
        pagination: {},
        loading: false,
        columns,
        current_set_id: ''
      };
    },
    props: ['mode'],
    components:{
      card: Card
    },
    methods:{
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        this.fetch({
          pageSize: pagination.pageSize,
          page: pagination.current,
          sortField: sorter.field,
          sortOrder: sorter.order,
          ...filters,
        });
      },
      fetch(params = {}) {
        console.log('params:', params);
        this.loading = true;
        instance
        .get(
          '/listCardSets',
          {params}
        )
        .then(response => {
          console.log(response);
          const pagination = { ...this.pagination };
          let result = response.data.data;
          pagination.total = result.count;
          this.loading = false;
          this.data = result.list;
          this.pagination = pagination;
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
      },
      handleEdit(value){
        console.log(value);
        this.current_set_id = value;
        this.mode = 'card';
      },
    },
    mounted(){
      this.fetch({
        page:1,
        pageSize:10
      })
    }
  };
</script>