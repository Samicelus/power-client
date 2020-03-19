<template>
  <div>
    <a-table 
      :columns="columns" 
      :dataSource="data" 
      :rowKey="item => item._id"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      v-if="mode == 'card'"
    >
      <a slot="name" slot-scope="text">{{text}}</a>
      <span slot="action" slot-scope="text, record">
        <a-button type="primary" shape="circle" icon="edit" style='margin: 5px' @click="handleEdit(record._id)"></a-button>
      </span>
    </a-table>
    <cardEdit v-if="mode == 'cardEdit'" :mode="mode" :cardId="current_card_id"></cardEdit>
  </div>
</template>
<script>
  import CardEdit from './cardEdit';
  import axios from 'axios';

  const instance = axios.create({
    baseURL: 'http://localhost:12133/api/card'
  });
  instance.defaults.headers.common['b-json-web-token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWU3MmU2MGVhNjMwNGYyOTUwYzc5MDUxIiwiaWF0IjoxNTg0NTg4MzIzLCJleHAiOjE1ODQ2NzQ3MjN9.86t3LxUDqr-qkWRP76jCR3nzw87vJgrg8QggGAmPVfk';

  const columns = [
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order'
    },
    {
      title: '类型',
      dataIndex: 'plantType',
      key: 'plantType',
    },
    {
      title: '消耗',
      dataIndex: 'consume',
      key: 'consume',
    },
    {
      title: '产能',
      dataIndex: 'produce',
      key: 'produce',
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
        current_card_id: ''
      };
    },
    components:{
      cardEdit: CardEdit
    },
    props: ['setId', 'mode'],
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
          '/listCards',
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
        this.current_card_id = value;
        this.mode = 'cardEdit';
      }
    },
    mounted(){
      console.log(`set-id: ${this.setId}`);
      this.fetch({
        page:1,
        pageSize:10,
        set_id: this.setId
      })
    }
  };
</script>