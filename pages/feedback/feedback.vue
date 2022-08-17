<template>
  <view>

    <view class="container">
      <view class="text content-center">
        <text>想要新功能？</text>
      </view>
      <view class="text content-center">
        <text>任何意见或建议都非常感谢。</text>
      </view>
      <view class="text content-center">
        <text>你可以提交下面的表格来告诉我。</text>
      </view>

      <view class="padding-t-12">
        <uni-easyinput type="textarea" autoHeight v-model="feedbackText" placeholder="对开发者的话..."></uni-easyinput>
      </view>

      <view class="content-center padding-t-12">
        <button @click="submit" type="primary" size="mini">
          提交留言
        </button>
      </view>


    </view>

    <!-- 提示消息 -->
    <uni-popup ref="popup" type="message">
      <uni-popup-message :type="msgType" :message="msgContent"></uni-popup-message>
    </uni-popup>
  </view>

</template>

<script>
  export default {
    data() {
      return {
        feedbackText: "",
        msgType: "",
        msgContent: "",
      }
    },
    computed: {
      mailContent: function() {
        return this.feedbackText.trim().slice(0, 2000)
      },
    },
    methods: {

      submit() {
        if (this.mailContent === "") {
          return uni.showToast({
            title: "请输入想说的话哟",
            icon: "none",
          })
        }
        this.sendMail()
      },
      sendMail() {
        uniCloud.callFunction({
            name: 'sendMail',
            data: {
              content: this.feedbackText,
            }
          })
          .then(res => {
            if (res.success === true) {
              this.msgType = "success"
              this.msgContent = "邮件发送成功"
              this.feedbackText = ""
            } else {
              this.msgType = "error"
              this.msgContent = "邮件发送失败，晚点再尝试下吧~"
            }
            return this.$refs.popup.open()
          });
      },
    }
  }
</script>

<style scoped>
  .container {
    padding: 20px;
  }

  .content-center {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .text {
    font-size: 14px;
    color: #434343;
    font-weight: 500;
  }

  .padding-t-12 {
    padding-top: 12px;
  }
</style>
