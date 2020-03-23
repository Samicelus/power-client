<template>
  <div>
    <a-row type="flex" justify="center" align="top">
      <a-col :span="8">
        <a-card hoverable style="width: 240px;height: 240px">
          <img
            alt=""
            :src="currentImage"
            slot="cover"
            style="z-index:1"
          />
          <p style="z-index:2;position:relative;top:-268px;left:-82px;color:white;font-size:48px;font-weight:bolder;">{{card.order}}</p>
          <div style="z-index:3;position:relative;top:-197px;left:-60px;">
            <img
              alt=""
              :src="currentResource"
              slot="cover"
              style="height:48px;width:48px;margin-left:-32px;"
              v-show="card.consume>0"
            />
            <img
              alt=""
              :src="currentResource"
              slot="cover"
              style="height:48px;width:48px;margin-left:-32px;"
              v-show="card.consume>1"
            />
            <img
              alt=""
              :src="currentResource"
              slot="cover"
              style="height:48px;width:48px;margin-left:-32px;"
              v-show="card.consume>2"
            />
          </div>
          <div style="z-index:3;position:relative;top:-243px;left:50px;font-size:28px;">
            <a-icon type="thunderbolt" theme="twoTone" twoToneColor="#888888" style="margin-left:-20px;"/>
            <a-icon v-show="card.produce>1" type="thunderbolt" theme="twoTone" twoToneColor="#888888" style="margin-left:-20px;"/>
            <a-icon v-show="card.produce>2" type="thunderbolt" theme="twoTone" twoToneColor="#888888" style="margin-left:-20px;"/>
            <a-icon v-show="card.produce>3" type="thunderbolt" theme="twoTone" twoToneColor="#888888" style="margin-left:-20px;"/>
            <a-icon v-show="card.produce>4" type="thunderbolt" theme="twoTone" twoToneColor="#888888" style="margin-left:-20px;"/>
            <a-icon v-show="card.produce>5" type="thunderbolt" theme="twoTone" twoToneColor="#888888" style="margin-left:-20px;"/>
            <a-icon v-show="card.produce>6" type="thunderbolt" theme="twoTone" twoToneColor="#888888" style="margin-left:-20px;"/>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <h4 style="text-align:left;">序号</h4>
        <a-row>
          <a-col :span="12">
            <a-slider :min="1" :max="60" v-model="card.order" />
          </a-col>
          <a-col :span="4">
            <a-input-number :min="1" :max="60" style="marginLeft: 16px" v-model="card.order" />
          </a-col>
        </a-row>
        <h4 style="text-align:left;">消耗</h4>
        <a-row>
          <a-col :span="12">
            <a-slider :min="minConsume" :max="3" v-model="card.consume" :disabled="fixConsume"/>
          </a-col>
          <a-col :span="4">
            <a-select :value="card.plantType" @change="handleChange" style="margin-left: 16px">
              <a-select-option value="coal">煤炭</a-select-option>
              <a-select-option value="oil">石油</a-select-option>
              <a-select-option value="hybrid">混合能源</a-select-option>
              <a-select-option value="garbage">垃圾</a-select-option>
              <a-select-option value="nuclear">核能</a-select-option>
              <a-select-option value="clean energy">清洁能源</a-select-option>
            </a-select>
          </a-col>
        </a-row>
        <h4 style="text-align:left;">产能</h4>
        <a-row>
          <a-col :span="12">
            <a-slider :min="1" :max="7" v-model="card.produce" />
          </a-col>
          <a-col :span="4">
            <a-input-number :min="1" :max="7" style="marginLeft: 16px" v-model="card.produce" />
          </a-col>
        </a-row>
      </a-col>
    </a-row>  
    <a-row>
      <a-col :span="8">
      </a-col>
      <a-col :span="8">
        <a-button type="primary" :disabled="!!cardId" style="margin:20px" @click="createCard">添加</a-button>
        <a-button type="primary" :disabled="!cardId" style="margin:20px" @click="modifyCard">修改</a-button>
      </a-col>
    </a-row>
  </div>
</template>
<script>
  import { EventBus } from '../lib/event-bus.js'; //全局事件总线

  export default {
    data() {
      return {
        card: {},
        fixConsume: false,
        minConsume: 1,
        mode: 'card',
        plantImages:{
          coal: require('../../static/images/card/coal_plant.png'),
          oil: require('../../static/images/card/oil_plant.png')
        },
        resourceImages:{
          coal: require('../../static/images/card/coalDeco.png'),
          oil: require('../../static/images/card/oilDeco.png'),
        }
      };
    },
    computed:{
      currentImage: function(){
        if(this.card.plantType){
          return this.plantImages[this.card.plantType]
        }else{
          return "#"
        }
      },
      currentResource: function(){
        if(this.card.plantType){
          return this.resourceImages[this.card.plantType]
        }else{
          return "#"
        }
      }
    },
    props: ['cardId', 'setId'],
    methods:{
      fetch(params = {}) {
        console.log('params:', params);
        this.loading = true;
        this.instance
        .get(
          '/card/getCardDetail',
          {params}
        )
        .then(response => {
          console.log(response);
          this.card = response.data.data;
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
      },
      handleChange(value){
        if(value == "clean energy"){
          this.minConsume = 0;
          this.card.consume = 0;
          this.fixConsume = true;
        }else{
          if(!this.card.consume){
            this.card.consume = 1;
          }
          this.minConsume = 1;
          this.fixConsume = false;
        }
        this.card.plantType = value;
      },
      createCard(){
        let data = {
          set_id: this.setId,
          order: this.card.order,
          plantType: this.card.plantType,
          consume: this.card.consume,
          produce: this.card.produce
        };
        this.instance
        .post(
          '/card/addCard',
          data
        )
        .then(response => {
          console.log(response);
          this.card = response.data.data;
          EventBus.$emit('selectCard', "");
          EventBus.$emit('modeChange', 'card');
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
      },
      modifyCard(){
        let data = {
          card_id: this.cardId,
          order: this.card.order,
          plantType: this.card.plantType,
          consume: this.card.consume,
          produce: this.card.produce
        };
        this.instance
        .post(
          '/card/editCard',
          data
        )
        .then(response => {
          console.log(response);
          this.card = response.data.data;
          EventBus.$emit('selectCard', "");
          EventBus.$emit('modeChange', 'card');
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
        console.log(`cardEdit receive: ${mode}`);
      });
      if(this.cardId){
        console.log(`card_id: ${this.cardId}`);
        this.fetch({
          card_id: this.cardId
        })
      }else{
        this.card = {
          order: 1,
          plantType: 'coal',
          consume: 3,
          produce: 1
        }
      }
    }
  };
</script>