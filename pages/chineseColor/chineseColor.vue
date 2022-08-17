<template>
  <view>
    <uni-transition ref="trans" mode-class="fade" :duration="0" :show="true">
      <view class="content">
        <view class="card-padding">
          <uni-row>
            <uni-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" v-for="(item, index) in colors" :key="index">
              <ColorPanel :hsb="item.hsb" @clickPanel="onClickPanel"></ColorPanel>
              <view style="padding-bottom: 10px;"></view>
            </uni-col>
          </uni-row>
        </view>
      </view>
    </uni-transition>
  </view>
</template>

<script>
  import {
    chineseColors
  } from "../../common/chineseColors.js"

  export default {
    data() {
      return {
        colors: chineseColors,
      }
    },
    onReady() {
      this.$refs.trans.init({
        duration: 2000,
        timingFunction: 'ease-in-out',
        delay: 500
      })
    },
    methods: {
      onClickPanel(hex) {
        this.$refs.trans.step({
          backgroundColor: "#" + hex
        })
        // 开始执行动画
        this.$refs.trans.run(() => {})
      },
    },
  }
</script>

<style scoped>
  .content {
    width: 100vw;
    height: 100vh;
  }

  .card-padding {
    padding-left: 20px;
    padding-top: 15px;
  }
</style>
