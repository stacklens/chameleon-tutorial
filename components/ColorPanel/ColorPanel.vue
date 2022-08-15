<template>
  <view>
    <view class="panel container" :style="panelColor">
      <view :style="canvasHexStyle" @click="onClickCanvas">
        <view class="">
          #{{hex}}
        </view>
        <view class="rgb-text">
          {{rgb.r}},{{rgb.g}},{{rgb.b}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name: "ColorPanel",
    props: {
      hsb: {
        type: Object,
      },
    },
    methods: {
      /**
       * hsb 转 rgb
       * @param {Object} 颜色模式  H(hues)表示色相，S(saturation)表示饱和度，B（brightness）表示亮度
       */
      HSBToRGB(hsb) {
        let rgb = {};
        let h = Math.round(hsb.h);
        let s = Math.round((hsb.s * 255) / 100);
        let v = Math.round((hsb.b * 255) / 100);
        if (s == 0) {
          rgb.r = rgb.g = rgb.b = v;
        } else {
          let t1 = v;
          let t2 = ((255 - s) * v) / 255;
          let t3 = ((t1 - t2) * (h % 60)) / 60;
          if (h == 360) h = 0;
          if (h < 60) {
            rgb.r = t1;
            rgb.b = t2;
            rgb.g = t2 + t3;
          } else if (h < 120) {
            rgb.g = t1;
            rgb.b = t2;
            rgb.r = t1 - t3;
          } else if (h < 180) {
            rgb.g = t1;
            rgb.r = t2;
            rgb.b = t2 + t3;
          } else if (h < 240) {
            rgb.b = t1;
            rgb.r = t2;
            rgb.g = t1 - t3;
          } else if (h < 300) {
            rgb.b = t1;
            rgb.g = t2;
            rgb.r = t2 + t3;
          } else if (h < 360) {
            rgb.r = t1;
            rgb.g = t2;
            rgb.b = t1 - t3;
          } else {
            rgb.r = 0;
            rgb.g = 0;
            rgb.b = 0;
          }
        }
        return {
          r: Math.round(rgb.r),
          g: Math.round(rgb.g),
          b: Math.round(rgb.b)
        };
      },
      // 将 rgb 转换为 hex
      rgbToHex(rgb) {
        let hex = [rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)];
        hex.map(function(str, i) {
          if (str.length == 1) {
            hex[i] = '0' + str;
          }
        });
        return hex.join('');
      },
      // 将 hex 复制到设备剪贴板
      onClickCanvas() {
        uni.setClipboardData({
          data: "#" + this.hex,
        });
        this.$emit("clickPanel", this.hex)
      },
    },
    computed: {
      rgb() {
        return this.HSBToRGB(this.hsb)
      },
      hex() {
        return this.rgbToHex(this.rgb)
      },
      panelColor() {
        return {
          backgroundColor: "#" + this.hex
        }
      },
      // 设置 canvas 的文本颜色
      canvasHexStyle() {
        for (let key in this.rgb) {
          if (this.rgb[key] >= 130) {
            return {
              color: "black"
            }
          }
        }
        return {
          color: "white"
        }
      },
    },
  }
</script>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .rgb-text {
    font-size: 10px;
  }

  .panel {
    height: 60px;
    width: 100px;
    border-radius: 10px;
    border-color: #484848;
    border-style: dashed;
  }
</style>
