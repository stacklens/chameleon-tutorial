<template>
  <view class="content">
    <uni-row>
      <uni-col :xs="8" :sm="6" :md="4" :lg="3" :xl="2" v-for="(item, index) in similarColors" :key="index">
        <ColorPanel :hsb="item" class="col-padding"></ColorPanel>
      </uni-col>
    </uni-row>
  </view>
</template>

<script>
  export default {
    name: "SimilarColors",
    props: {
      rgb: {
        type: Object,
      },
    },
    computed: {
      hsb() {
        const rgb = this.rgb
        let hsb = {
          h: 0,
          s: 0,
          b: 0
        };
        let min = Math.min(rgb.r, rgb.g, rgb.b);
        let max = Math.max(rgb.r, rgb.g, rgb.b);
        let delta = max - min;
        hsb.b = max;
        hsb.s = max != 0 ? 255 * delta / max : 0;
        if (hsb.s != 0) {
          if (rgb.r == max) hsb.h = (rgb.g - rgb.b) / delta;
          else if (rgb.g == max) hsb.h = 2 + (rgb.b - rgb.r) / delta;
          else hsb.h = 4 + (rgb.r - rgb.g) / delta;
        } else hsb.h = -1;
        hsb.h *= 60;
        if (hsb.h < 0) hsb.h = 0;
        hsb.s *= 100 / 255;
        hsb.b *= 100 / 255;
        return hsb;
      },
      similarColors() {
        const {
          h,
          s,
          b
        } = this.hsb

        // 饱和度阶梯
        const Sstep = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10]
        // 相似色彩数组
        let colors = []
        for (let item of Sstep) {
          colors.push({
            h: h,
            s: item,
            b: b
          })
        }
        // 明度阶梯
        const Bstep = [100, 90, 80, 70, 60, 50, 40, 30]
        for (let item of Bstep) {
          colors.push({
            h: h,
            s: s,
            b: item
          })
        }

        return colors
      },
    },
  }
</script>

<style>
  .content {
    padding-left: 20px;
  }

  .col-padding {
    padding-bottom: 10px;
  }
</style>
