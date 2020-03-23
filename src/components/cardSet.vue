<template>
  <div>
    <a-row type="flex" justify="end" style="margin-bottom:10px;">
      <a-col :span="8">
      </a-col>
      <a-col :span="4">
      </a-col>
      <a-col :span="4">
        <a-button type="primary" shape="round" @click="showModal"><a-icon type="folder-add"/>添加卡组</a-button>
      </a-col>
    </a-row>
    <a-modal title="Modal" v-model="addSetVisible" @ok="hideModal" okText="添加" cancelText="取消">
      <a-input placeholder="卡组名称" v-model="nameInput"></a-input>
      <a-textarea placeholder="添加卡组描述" :rows="4" style="margin-top:20px" v-model="descriptionInput"/>
    </a-modal>
    <a-table 
      :columns="columns" 
      :dataSource="data"
      :rowKey="item => item._id"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <a slot="name" slot-scope="text">{{text}}</a>
      <span slot="action" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
            编辑卡组
          </template>
          <a-button type="primary" shape="circle" icon="edit" style='margin: 5px' @click="handleEdit(record._id)"></a-button>
        </a-tooltip>
      </span>
    </a-table>
  </div>
</template>
<script>
  import { EventBus } from '../lib/event-bus.js'; //全局事件总线

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
      sorter: true
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
        mode: 'cardSet',
        addSetVisible: false,
        nameInput: "",
        descriptionInput: ""
      };
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
        this.instance
        .get(
          '/card/listCardSets',
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
        EventBus.$emit('selectCardSet', value);
        EventBus.$emit('modeChange', 'card');
      },
      showModal(){
        this.addSetVisible = true;
      },
      hideModal(){
        this.addSetVisible = false;
        this.addSetAndRefetch();
      },
      addSetAndRefetch(){
        let that = this;
        let data = {
          name: this.nameInput,
          description: this.descriptionInput
        };
        this.instance
        .post(
          '/card/addCardSet',
          data
        )
        .then(response => {
          console.log(response);
          that.fetch();
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
      }
    },
    mounted(){
      //注册事件监听
      EventBus.$on('modeChange', mode => {
        this.mode = mode;
        console.log(`cardSet receive: ${mode}`);
      });
      EventBus.$emit('selectCardSet', "");
      this.fetch({
        page:1,
        pageSize:10
      })
    }
  };
</script>