<template>
  <view>
    <view>
      <uni-transition ref="trans" mode-class="fade" :duration="0" :show="true">
        <view class="content">
          <uni-row>
            <uni-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" v-for="(item, index) in colors" :key="index">
              <ColorPanel :hsb="item.hsb" class="col-padding" @clickPanel="onClickPanel"></ColorPanel>
            </uni-col>
          </uni-row>
        </view>
      </uni-transition>
    </view>
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

<style>
  .content {
    padding: 10px;
    width: 100vw;
    height: 100vh;
  }

  .col-padding {
    padding-bottom: 10px;
  }
</style>
