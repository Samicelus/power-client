<template>
  <a-layout id="components-layout-demo-top-side-2">
    <a-layout-header class="header">
      <a-row>
        <a-col :span="3">
          <div class="logo" />
        </a-col>
        <a-col :span="20">
        </a-col>
        <a-col :span="1">
          <a-tooltip
            trigger="hover"
            :visible="hovered"
            @visibleChange="handleHoverChange"
          >
            <template slot="title">
              登出
            </template>
            <a-popover
              trigger="click"
              :visible="clicked"
              @visibleChange="handleClickChange"
            >
              <div slot="content">
                <div>确认要登出?</div>
                <a-button type="danger" @click="logout">确认</a-button>
              </div>
              <a-button shape="circle" icon="poweroff" />
            </a-popover>
          </a-tooltip>
        </a-col>
      </a-row>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :defaultSelectedKeys="['1']"
          :defaultOpenKeys="['sub1']"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu key="sub1" @click="handleSubMenuClick">
            <span slot="title"><a-icon type="profile" />卡组管理</span>
            <a-menu-item key="cardSet">卡组</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title"><a-icon type="deployment-unit" />地图管理</span>
            <a-menu-item key="5">地图</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-breadcrumb style="margin: 16px 0;text-align: left">
          <a-breadcrumb-item v-show="['cardSet','card','cardEdit'].includes(mode)"><span @click="toCardSet">卡组列表</span></a-breadcrumb-item>
          <a-breadcrumb-item v-show="['card','cardEdit'].includes(mode)"><span @click="toCard">卡牌列表</span></a-breadcrumb-item>
          <a-breadcrumb-item v-show="['cardEdit'].includes(mode)"><span @click="toCardEdit">卡牌详情</span></a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '1080px' }"
        >
        <cardSet v-if="mode == 'cardSet'"></cardSet>
        <card :setId="card_set_id" v-if="mode == 'card'"></card>
        <cardEdit :cardId="card_id" :setId="card_set_id" v-if="mode == 'cardEdit'"></cardEdit>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script>
  import { EventBus } from '../lib/event-bus.js'; //全局事件总线

  import CardSet from './cardSet'
  import Card from './card'
  import CardEdit from './cardEdit'

  let mode = 'cardSet';

  export default {
    data() {
      return {
        clicked: false,
        hovered: false,
        collapsed: false,
        card_set_id: '',
        card_id: '',
        mode
      };
    },
    components:{
      cardSet: CardSet,
      card: Card,
      cardEdit: CardEdit
    },
    methods:{
      handleHoverChange(visible) {
        this.clicked = false;
        this.hovered = visible;
      },
      handleClickChange(visible) {
        this.clicked = visible;
        this.hovered = false;
      },
      handleSubMenuClick({key}){
        EventBus.$emit('modeChange', key);
      },
      toCardSet(){
        if(this.mode != 'cardSet'){
          EventBus.$emit('modeChange', 'cardSet');
        }
      },
      toCard(){
        if(this.mode != 'card'){
          EventBus.$emit('modeChange', 'card');
        }
      },
      toCardEdit(){
        if(this.mode != 'cardEdit'){
        EventBus.$emit('modeChange', 'cardEdit');
        }
      },
      logout(){
        this.$store.commit('saveUserInfo', "");
        this.$router.push({
          path: '/login'
        });
      }
    },
    mounted(){
      //注册事件监听
      EventBus.$on('modeChange', mode => {
        this.mode = mode;
      });
      EventBus.$on('selectCardSet', set_id => {
        this.card_set_id = set_id;
      });
      EventBus.$on('selectCard', card_id => {
        this.card_id = card_id;
      });
    }
  };
</script>

<style>
  #components-layout-demo-top-side-2 .logo {
    width: 120px;
    height: 31px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px 28px 16px 0;
    float: left;
  }
</style>