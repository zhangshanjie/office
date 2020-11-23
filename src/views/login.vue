<template>
  <div class="login">
    <Row type="flex" justify="center" align="middle" @keydown.enter.native="submitLogin">
      <Col style="width: 368px;">
        <Header />
        <Row v-if="!socialLogining">
          <Tabs v-model="tabName">
            <TabPane :label="$t('usernameLogin')" name="username" icon="md-person">
              <Form
                ref="usernameLoginForm"
                :model="form"
                :rules="rules"
                class="form"
                v-if="tabName=='username'"
              >
                <FormItem prop="username">
                  <Input
                    v-model="form.username"
                    prefix="ios-contact"
                    size="large"
                    clearable
                    placeholder="请输入用户名"
                    autocomplete="off"
                  />
                </FormItem>
                <FormItem prop="password">
                  <Input
                    type="password"
                    v-model="form.password"
                    prefix="ios-lock"
                    size="large"
                    clearable
                    placeholder="请输入密码"
                    autocomplete="off"
                  />
                </FormItem>
                <FormItem prop="imgCode">
                  <Row
                    type="flex"
                    justify="space-between"
                    style="align-items: center;overflow: hidden;"
                  >
                    <!-- <Input
                      v-model="form.imgCode"
                      size="large"
                      clearable
                      placeholder="请输入图片验证码"
                      :maxlength="10"
                      class="input-verify"
                    />-->
                    <!-- <div style="position:relative">
                      <Spin v-if="loadingCaptcha" fix></Spin>
                      <img
                        :src="captchaImg"
                        @click="getCaptchaImg"
                        alt="加载验证码失败"
                        style="width:100px;cursor:pointer;display:block"
                      />
                    </div>-->
                  </Row>
                </FormItem>
              </Form>
            </TabPane>

            <!--使用手机号码登录-->
            <!-- <TabPane :label="$t('mobileLogin')" name="mobile" icon="ios-phone-portrait">
              <Form
                ref="mobileLoginForm"
                :model="form"
                :rules="rules"
                class="form"
                v-if="tabName=='mobile'"
              >
                <FormItem prop="mobile">
                  <Input
                    v-model="form.mobile"
                    prefix="ios-phone-portrait"
                    size="large"
                    clearable
                    placeholder="请输入手机号"
                  />
                </FormItem>
                <FormItem prop="code" :error="errorCode">
                  <Row type="flex" justify="space-between">
                    <Input
                      v-model="form.code"
                      prefix="ios-mail-outline"
                      size="large"
                      clearable
                      placeholder="请输入短信验证码"
                      :maxlength="6"
                      class="input-verify"
                    />
                    <CountDownButton
                      ref="countDown"
                      @on-click="sendSmsCode"
                      :autoCountDown="false"
                      size="large"
                      :loading="sending"
                      :text="getSms"
                    />
                  </Row>
                </FormItem>
              </Form>
            </TabPane>-->
          </Tabs>

          <Row type="flex" justify="space-between">
            <Checkbox v-model="saveLogin" size="large">{{ $t('autoLogin') }}</Checkbox>
            <Dropdown trigger="click" @on-click="handleDropDown">
              <a class="forget-pass">{{ $t('forgetPass') }}</a>
            </Dropdown>
          </Row>
          <Row>
            <Button
              class="login-btn shiny btn"
              type="primary"
              size="large"
              :loading="loading"
              @click="submitLogin"
              long
            >
              <span v-if="!loading">{{ $t('login') }}</span>
              <span v-else>{{ $t('logining') }}</span>
            </Button>
          </Row>

          <!--其它登录方式-->
          <!-- <Row type="flex" justify="space-between" class="other-login">
            <div class="other-way icons">
              {{ $t('otherLogin') }}
              <div class="other-icon" @click="toGithubLogin">
                <icon scale="1.1" name="brands/github"></icon>
              </div>
              <div class="other-icon" @click="toQQLogin">
                <icon name="brands/qq"></icon>
              </div>
              <div class="other-icon" @click="toWeiboLogin">
                <icon scale="1.2" name="brands/weibo"></icon>
              </div>
              <div class="other-icon" @click="toWeixinLogin">
                <icon scale="1.2" name="brands/weixin"></icon>
              </div>
            </div>
            <router-link to="/regist">
              <a class="forget-pass">{{ $t('regist') }}</a>
            </router-link>
          </Row>-->
        </Row>
        <div v-if="socialLogining">
          <RectLoading />
        </div>
        <Footer />
      </Col>
      <LangSwitch />
    </Row>
  </div>
</template>

<script>
import {
  login,
  userInfo,
  githubLogin,
  qqLogin,
  weiboLogin,
  getJWT,
  sendLoginSms,
  smsLogin,
  initCaptcha,
  drawCodeImage
} from "@/api/index";
import { validateMobile } from "@/libs/validate";
import Cookies from "js-cookie";
import Header from "@/views/main-components/header";
import Footer from "@/views/main-components/footer";
import LangSwitch from "@/views/main-components/lang-switch";
import RectLoading from "@/views/my-components/rect-loading";
import CountDownButton from "@/views/my-components/count-down-button";
import util from "@/libs/util.js";
export default {
  components: {
    CountDownButton,
    RectLoading,
    LangSwitch,
    Header,
    Footer
  },
  data() {
    return {
      captchaId: "",
      captchaImg: "",
      loadingCaptcha: true,
      socialLogining: true,
      error: false,
      tabName: "username",
      saveLogin: true,
      getSms: "获取验证码",
      loading: false,
      sending: false,
      errorCode: "",
      form: {
        username: "",
        password: "",
        mobile: "阿里云短信0.045/条 若余额不足联系作者充值",
        code: ""
      },
      rules: {
        username: [
          {
            required: true,
            message: "账号不能为空",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ],
        // imgCode: [
        //   {
        //     required: true,
        //     message: "验证码不能为空",
        //     trigger: "blur"
        //   }
        // ],
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
            trigger: "blur"
          },
          {
            validator: validateMobile,
            trigger: "blur"
          }
        ]
      }
    };
  },
  onLoad(){
    // window.androidScanCallBack = this.scanCallBack;
  },
  methods: {
    getCaptchaImg() {
      this.loadingCaptcha = true;
      initCaptcha().then(res => {
        this.loadingCaptcha = false;
        if (res.success) {
          this.captchaId = res.result;
          this.captchaImg = drawCodeImage + this.captchaId;
        }
      });
    },

    sendSmsCode() {
      this.$refs.mobileLoginForm.validate(valid => {
        if (valid) {
          this.sending = true;
          this.getSms = "发送中";
          sendLoginSms(this.form.mobile).then(res => {
            this.getSms = "获取验证码";
            this.sending = false;
            if (res.success) {
              this.$Message.success("发送短信验证码成功");
              // 开始倒计时
              this.$refs.countDown.startCountDown();
            }
          });
        }
      });
    },

    //登录
    submitLogin() {
 
      if (this.tabName == "username") {
        this.$refs.usernameLoginForm.validate(valid => {
          if (valid) {
            this.loading = true;
            login({
              username: this.form.username,
              password: this.form.password
            }).then(res => {
              console.log(res)
              if (res.success) {
                this.setStore("accessToken", res.result);
                sessionStorage.setItem('token',res.result)
                // 获取用户信息
                userInfo().then(res => {
                  if (res.success) {
                   sessionStorage.setItem('userInfo',res.result.updateBy)
                   sessionStorage.setItem('userId',res.result.id)
                    // 避免超过大小限制
                    delete res.result.permissions;
                    let roles = [];
                    res.result.roles.forEach(e => {
                      roles.push(e.name);
                    });
                    this.setStore("roles", roles);
                    this.setStore("saveLogin", this.saveLogin);
                    if (this.saveLogin) {
                      // 保存7天
                      Cookies.set("userInfo", JSON.stringify(res.result), {
                        expires: 7
                      });
                    } else {
                      Cookies.set("userInfo", JSON.stringify(res.result));
                    }
                    this.setStore("userInfo", res.result);
                    this.$store.commit("setAvatarPath", res.result.avatar);

                    // 加载菜单
                    util.initRouter(this);
                    this.$router.push({
                      name: "home"
                    });
                  } else {
                    this.loading = false;
                  }
                });
              } else {
                this.loading = false;
                this.getCaptchaImg();
              }
            });
          }
        });
      } else if (this.tabName == "mobile") {
        this.$refs.mobileLoginForm.validate(valid => {
          if (valid) {
            if (this.form.code == "") {
              this.errorCode = "验证码不能为空";
              return;
            } else {
              this.errorCode = "";
            }
            this.loading = true;
            this.form.saveLogin = this.saveLogin;
            smsLogin(this.form).then(res => {
              if (res.success) {
                this.setStore("accessToken", res.result);
                // 获取用户信息
                userInfo().then(res => {
                  if (res.success) {
                    // 避免超过大小限制
                    delete res.result.permissions;
                    let roles = [];
                    res.result.roles.forEach(e => {
                      roles.push(e.name);
                    });
                    this.setStore("roles", roles);
                    if (this.saveLogin) {
                      // 保存7天
                      Cookies.set("userInfo", JSON.stringify(res.result), {
                        expires: 7
                      });
                    } else {
                      Cookies.set("userInfo", JSON.stringify(res.result));
                    }
                    this.setStore("userInfo", res.result);
                    this.$store.commit("setAvatarPath", res.result.avatar);
                    // 加载菜单

                    util.initRouter(this);

                    this.$router.push({
                      name: "home_index"
                    });
                  } else {
                    this.loading = false;
                  }
                });
              } else {
                this.loading = false;
              }
            });
          }
        });
      }
    },

    toGithubLogin() {
      this.socialLogining = true;
      githubLogin().then(res => {
        if (res.success) {
          window.location.href = res.result;
        } else {
          this.socialLogining = false;
        }
      });
    },

    toQQLogin() {
      this.socialLogining = true;
      qqLogin().then(res => {
        if (res.success) {
          window.location.href = res.result;
        } else {
          this.socialLogining = false;
        }
      });
    },
    toWeiboLogin() {
      this.socialLogining = true;
      weiboLogin().then(res => {
        if (res.success) {
          window.location.href = res.result;
        } else {
          this.socialLogining = false;
        }
      });
    },
    toWeixinLogin() {
      this.$Message.error("开通微信登录官方收费300/年");
    },
    relatedLogin() {
      let q = this.$route.query;
      let error = q.error;
      if (error !== "" && error !== undefined) {
        //this.$Message.error(error);
      }
      let related = q.related;
      let JWTKey = q.JWTKey;
      if (related && related == "1") {
        if (JWTKey) {
          getJWT({ JWTKey: JWTKey }).then(res => {
            if (res.success) {
              this.socialLogining = true;
              this.setStore("accessToken", res.result);
              // 获取用户信息
              userInfo().then(res => {
                if (res.success) {
                  // 避免超过大小限制
                  delete res.result.permissions;
                  let roles = [];
                  res.result.roles.forEach(e => {
                    roles.push(e.name);
                  });
                  this.setStore("roles", roles);
                  // 保存7天
                  Cookies.set("userInfo", JSON.stringify(res.result), {
                    expires: 7
                  });
                  this.setStore("userInfo", res.result);
                  this.$store.commit("setAvatarPath", res.result.avatar);
                  // 加载菜单
                  util.initRouter(this);
                  this.$router.push({
                    name: "home_index"
                  });
                } else {
                  this.socialLogining = false;
                  this.$Message.error("使用第三方账号登录失败");
                }
              });
            } else {
              this.socialLogining = false;
              this.$Message.error("使用第三方账号登录失败");
            }
          });
        }
      } else {
        this.socialLogining = false;
      }
    },
    handleDropDown(v) {
      if (v == "showAccount") {
        this.showAccount();
      } else if (v == "resetByMobile") {
        this.$router.push({
          name: "reset"
        });
      } else if (v == "resetByEmail") {
        this.$router.push({
          name: "reset",
          query: {
            type: "1"
          }
        });
      }
    }

    // showAccount() {
    //   this.$Notice.info({
    //     title: "体验账号密码",
    //     desc:
    //       "账号1：test 密码：123456 <br>账号2：test2 密码：123456 已开放注册！",
    //     duration: 10
    //   });
    // },
  },

  //页面加载时执行的代码
  mounted() {
    //this.showAccount();
    this.relatedLogin();
    //this.getCaptchaImg();
  }
};
</script>

<style  scoped>
.shiny {
   border: 1px solid;
  background-color: transparent;
  text-transform: uppercase;
  font-size: 14px;
  padding: 10px 20px;
  font-weight: 300;
  color: #4cc9f0;

}
.btn:hover {
  color: white;
  border: 0;
}
.shiny:hover {
  background-color: #4cc9f0;
  -webkit-box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
  -moz-box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
  box-shadow: 10px 10px 99px 6px rgba(76,201,240,1);
}
/* .shiny:hover {
   border-bottom-right-radius: 50px;
   border-top-left-radius: 50px;
   border-bottom-left-radius: 10px;
   border-top-right-radius: 10px;
} */
</style>
<style lang="less">
@import "./login.less";
</style>
