<template>
  <div>
    <a-row type="flex" justify="end" style="margin-bottom:10px;">
      <a-col :span="8">
      </a-col>
      <a-col :span="4">
      </a-col>
      <a-col :span="4">
        <a-button type="primary" shape="round" @click="toAddCard"><a-icon type="folder-add"/>添加卡牌</a-button>
      </a-col>
    </a-row>
    <a-table 
      :columns="columns" 
      :dataSource="data" 
      :rowKey="item => item._id"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      v-if="setId"
    >
      <a slot="name" slot-scope="text">{{text}}</a>
      <span slot="action" slot-scope="text, record">
        <a-tooltip>
          <template slot="title">
          编辑卡牌
          </template>
          <a-button type="primary" shape="circle" icon="edit" style='margin: 5px' @click="handleEdit(record._id)"></a-button>
        </a-tooltip>
        <a-tooltip>
          <template slot="title">
          删除卡牌
          </template>
          <a-popconfirm
            title="确认要删除?"
            @confirm="handleRemove(record._id)"
          >
            <a-button type="primary" shape="circle" icon="delete" style='margin: 5px'></a-button>
          </a-popconfirm>
        </a-tooltip>
      </span>
    </a-table>
  </div>
</template>
<script>
  import { EventBus } from '../lib/event-bus.js'; //全局事件总线

  const columns = [
    {
      title: '序号',
      dataIndex: 'order',
      key: 'order',
      sorter: true
    },
    {
      title: '类型',
      dataIndex: 'plantType',
      key: 'plantType',
      filters: [
        { text: '煤炭', value: 'coal' }, 
        { text: '石油', value: 'oil' }, 
        { text: '混合能源', value: 'hybrid' }, 
        { text: '垃圾', value: 'garbage' }, 
        { text: '核能', value: 'nuclear' }, 
        { text: '清洁能源', value: 'clean energy' }
      ]
    },
    {
      title: '消耗',
      dataIndex: 'consume',
      key: 'consume',
      sorter: true
    },
    {
      title: '产能',
      dataIndex: 'produce',
      key: 'produce',
      sorter: true
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
        current_card_id: '',
        mode: 'card'
      };
    },
    props: ['setId'],
    methods:{
      handleTableChange(pagination, filters, sorter) {
        const pager = { ...this.pagination };
        pager.current = pagination.current;
        this.pagination = pager;
        let fetchPayload = {
          set_id: this.setId,
          ...filters
        };
        if(pagination){
          fetchPayload.pageSize = pagination.pageSize;
          fetchPayload.page = pagination.current;
        }
        if(sorter){
          fetchPayload.sortField = sorter.field;
          fetchPayload.sortOrder = sorter.order;
        }
        this.fetch(fetchPayload);
      },
      fetch(params = {}) {
        console.log('params:', params);
        this.loading = true;
        this.instance
        .get(
          '/card/listCards',
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
      toAddCard(){
        EventBus.$emit('modeChange', 'cardEdit');
      },
      handleEdit(value){
        EventBus.$emit('selectCard', value);
        EventBus.$emit('modeChange', 'cardEdit');
      },
      handleRemove(value){
        console.log(value);
        let that = this;
        this.instance
        .delete(
          '/card/'+value+'/delete'
        )
        .then(() => {
          console.log({
            pagination: that.pagination,
            filters: that.filters, 
            sorter: that.sorter
          });
          that.handleTableChange({
            pagination: that.pagination,
            filters: that.filters, 
            sorter: that.sorter
          });
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
        console.log(`card receive: ${mode}`);
      });
      EventBus.$emit('selectCard', "");
      console.log(`set-id: ${this.setId}`);
      this.fetch({
        page:1,
        pageSize:10,
        set_id: this.setId
      })
    }
  };
</script>