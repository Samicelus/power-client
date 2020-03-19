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
          <img
            alt=""
            :src="currentResource"
            slot="cover"
            style="z-index:2;position:relative;top:-50px;left:10px;height:48px;width:48px;"
            v-show="card.consume>0"
          />
          <img
            alt=""
            :src="currentResource"
            slot="cover"
            style="z-index:3;position:relative;top:-98px;left:26px;height:48px;width:48px;"
            v-show="card.consume>1"
          />
          <img
            alt=""
            :src="currentResource"
            slot="cover"
            style="z-index:4;position:relative;top:-146px;left:42px;height:48px;width:48px;"
            v-show="card.consume>2"
          />
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
            <a-select defaultValue="coal" @change="handleChange" style="margin-left: 16px">
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
  </div>
</template>
<script>
  import axios from 'axios';

  const instance = axios.create({
    baseURL: 'http://localhost:12133/api/card'
  });
  instance.defaults.headers.common['b-json-web-token'] = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNWU3MmU2MGVhNjMwNGYyOTUwYzc5MDUxIiwiaWF0IjoxNTg0NTg4MzIzLCJleHAiOjE1ODQ2NzQ3MjN9.86t3LxUDqr-qkWRP76jCR3nzw87vJgrg8QggGAmPVfk';

  export default {
    data() {
      return {
        card: {},
        fixConsume: false,
        minConsume: 1,
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
    props: ['cardId'],
    methods:{
      handleCardChange() {

      },
      fetch(params = {}) {
        console.log('params:', params);
        this.loading = true;
        instance
        .get(
          '/getCardDetail',
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
      }
    },
    mounted(){
      console.log(`card_id: ${this.cardId}`);
      this.fetch({
        card_id: this.cardId
      })
    }
  };
</script>