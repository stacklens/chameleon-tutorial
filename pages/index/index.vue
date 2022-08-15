<template>
  <view>
    <view class="padding-10">
      <sectionTitle num="01" title="当前色彩"></sectionTitle>
      <view class="container">
        <!-- 展示当前颜色的画布 -->
        <view class="container canvas" :style="canvasStyle" @click="onClickCanvas">
          <view :style="canvasHexStyle">{{canvasHex}}</view>
        </view>
        <!-- 色盘组件 -->
        <button @click="openPicker" type="default" size="mini">打开色盘</button>
        <t-color-picker ref="colorPicker" :color="canvasColor" @confirm="confirmPicker"></t-color-picker>
      </view>
      <!-- Hex色码输入框 -->
      <view class="form padding-10">
        <text class="padding-r-10 input-title">Hex色码</text>
        <uni-easyinput v-model="hexValue" :trim="true" :maxlength="7" placeholder="#ffc107" class="padding-r-10">
        </uni-easyinput>
        <button @click="hexSubmit" size="mini" type="primary">确认</button>
      </view>
    </view>

    <!-- rgb色码输入框 -->
    <uni-card :is-shadow="false">
      <template v-slot:title>
        <view class="card-title input-title">RGB色码</view>
      </template>
      <uni-row class="form">
        <uni-col :span="2">
          <text class="">R</text>
        </uni-col>
        <uni-col :span="22">
          <slider :value="canvasColor.r" min="0" max="255" data-type="r" @changing="sliderChanging"
            activeColor="#ff8183" backgroundColor="#ffb5b6" block-color="#e92528" block-size="20" :show-value="true" />
        </uni-col>
      </uni-row>

      <uni-row class="form">
        <uni-col :span="2">
          <text class="">G</text>
        </uni-col>
        <uni-col :span="22">
          <slider :value="canvasColor.g" min="0" max="255" data-type="g" @changing="sliderChanging"
            activeColor="#55d54e" backgroundColor="#a6f4a5" block-color="#3b8b1e" block-size="20" :show-value="true" />
        </uni-col>
      </uni-row>

      <uni-row class="form">
        <uni-col :span="2">
          <text class="">B</text>
        </uni-col>
        <uni-col :span="22">
          <slider :value="canvasColor.b" min="0" max="255" data-type="b" @changing="sliderChanging"
            activeColor="#8a96ff" backgroundColor="#7980ff" block-color="#3651e8" block-size="20" :show-value="true" />
        </uni-col>
      </uni-row>
    </uni-card>

    <!-- 相似色 -->
    <view class="padding-10">
      <sectionTitle num="02" title="相似色彩"></sectionTitle>
    </view>
    <SimilarColors :rgb="canvasColor"></SimilarColors>

  </view>

</template>

<script>
  export default {
    data() {
      return {
        // 当前选择的 rgb 颜色
        canvasColor: {
          r: 255,
          g: 193,
          b: 7,
          a: 1
        },
        // hex输入框数据
        hexValue: ""
      };
    },
    mounted() {
      this.hexValue = "#" + this.rgbToHex(this.canvasColor)
    },
    methods: {
      sliderChanging(e) {
        this.canvasColor[e.target.dataset.type] = e.detail.value
        this.hexValue = "#" + this.rgbToHex(this.canvasColor)
      },
      // 提交hex码
      hexSubmit() {
        // 预处理hex码
        let hexStr = this.hexValue.trim().replace("#", "").toLowerCase()
        // 将3位hex转化为6位hex
        if (hexStr.length === 3) {
          hexStr = hexStr.split("").reduce((total, current) => total + current.repeat(2), "")
        }

        // 验证hex长度是否合法
        if (hexStr.length !== 6) {
          return uni.showToast({
            title: "Hex色码必须为3位或6位",
            icon: "none",
          });
        }

        // 验证hex内容是否合法
        const alphabet = "0123456789abcdef"
        for (let elem of hexStr) {
          if (!alphabet.includes(elem)) {
            return uni.showToast({
              title: "请输入正确的Hex色码",
              icon: "none",
            });
          }
        }

        const rgb = this.hexToRgb(hexStr)
        // 更新canvas颜色
        this.canvasColor = rgb
        // 更新色盘颜色
        this.$refs.colorPicker.rgba = rgb
      },

      hexToRgb(hex) {
        // 将hex切割为rgb数组
        const hexArr = hex.match(/[\s\S]{1,2}/g) || []
        // 转换为10进制数组
        const rgbArr = hexArr.map(hex => parseInt(hex, 16))
        return {
          r: rgbArr[0],
          g: rgbArr[1],
          b: rgbArr[2],
          a: 1
        }
      },

      // 打开色盘
      openPicker(item) {
        this.$refs.colorPicker.open();
      },
      // 色盘点击确定
      confirmPicker(e) {
        this.canvasColor = e.rgba
        this.hexValue = e.hex
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
          data: this.canvasHex,
        });
      }
    },
    computed: {
      // 设置 canvas 的颜色
      canvasStyle() {
        return {
          backgroundColor: '#' + this.rgbToHex(this.canvasColor)
        }
      },
      // 设置 canvas 的文本颜色
      canvasHexStyle() {
        for (let key in this.canvasColor) {
          if (this.canvasColor[key] >= 130) {
            return {
              color: "black"
            }
          }
        }
        return {
          color: "white"
        }
      },
      // 设置 canvas 的 hex 文本
      canvasHex() {
        return "#" + this.rgbToHex(this.canvasColor)
      },
    },
  };
</script>

<style>
  .card-title {
    padding-top: 5px;
  }

  .form {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .padding-r-10 {
    padding-right: 10px;
  }

  .input-title {
    font-size: 14px;
    color: gray;
    font-weight: 700;
  }

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .padding-10 {
    padding: 10px;
  }

  .canvas {
    height: 80px;
    width: 100%;
    margin-bottom: 10px;
    border-radius: 10px;
    border-color: #484848;
    border-style: dashed;
  }
</style>
