<template>
    <form class="login-container" v-show="isShow">
        <h3>登录</h3>
        <div class="username">
            <span>用户名</span>
            <input type="text" v-model="username">
        </div>
        <div class="password">
            <span>密码</span>
            <input type="password" v-model="password">
        </div>
        <div class="submint">
            <input type="button" value="提交" @click="commitForm">
            <input type="button" value="取消">
        </div>
    </form>
</template>
<script>
const axios = require('axios');
export default {
    data(){
        return{
            isShow:true,
            username:'',
            password:''
        }
    },
    methods:{
        commitForm(){
            var _this=this;
            axios.post('http://localhost:3000/signin',{
                username:this.username,
                password:this.password,
            },{withCredentials:true}).then(function(res){
                console.log(res)
                _this.username='';
                _this.password='';
                alert('提交成功')
            }).catch(function(error){
                console.log(error)
            })
        }
    }
}
</script>
<style scoped>
    .login-container{
        color: white;
        width: 400px;
        height:400px;
        padding: 20px;
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        transform: translate(-50%,-50%);
        z-index: 999;
        background: turquoise;
        box-shadow: 0 0 2px 2px #50968f;
    }
    .login-container h3{
        text-align: center;
    }
    .login-container>div{
        display: flex;
        margin-top: 30px;
        text-align: center;
        justify-content: center;
    }
    .login-container>div input{
        flex: auto;
        width: 0;
    }
    .login-container>div span{
        width: 50px;
    }
    .login-container>div input,span,button{
      height: 30px;
      line-height: 30px;
    }
    .login-container button{
    width: 100px;
    color: white;
    background: #635353;
    border: 1px solid #151a1b;
    }
    .login-container button:nth-child(1){
        margin-right: 50px;
    }
    .login-container .submint input{
        width: 100px;
        flex:0 1 auto;
        margin: 0 10px;
    }   
</style>


