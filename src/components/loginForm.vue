<template>
  <div>
    <a-input placeholder="Login" allowClear v-model="username">
      <a-icon slot="prefix" type="user" />
    </a-input>
    <br />
    <br />
    <a-input-password placeholder="password" v-model="password">
      <a-icon slot="prefix" type="key" />
    </a-input-password>
    <br />
    <br />
    <a-button class="loginButton" type="primary" @click="login" :loading="loginLoading">Login</a-button>
    <a-button class="loginButton" type="primary">Signin</a-button>
  </div>
</template>

<script>
  export default {
    name: 'loginForm',
    data() {
      return {
        username: "",
        password: "",
        loginLoading: false
      }
    },
    methods: {
      login(){
        let data = {
          login: this.username,
          password: this.password
        }

        this.loginLoading = true;
        let that = this;
        this.instance
        .post(
          '/user/login',
          data
        )
        .then(response => {
          that.loginLoading = false;
          if(response.data.result){
            that.clearInput();
            let result = response.data.data;
            that.$store.commit('saveUserInfo', result.token);
            that.$router.push({
              name: 'home'
            });
          }else{
            //TODO 显示登录错误
            that.clearInput();
          }
        })
        .catch(function (error) { // 请求失败处理
          that.loginLoading = false;
          that.clearInput();
          console.log(error);
        });
      },
      clearInput(){
        this.username = "";
        this.password = "";
      }
    },
    mounted: function() {
    }
  }
</script>

<style scoped>
  .loginButton{
    margin: 20px
  }
</style>