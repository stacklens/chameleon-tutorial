<template>
  <view class="content">
    <view class="title"><text class="number">{{num}}</text><text>{{title}}</text></view>
    <view class="underline"></view>
  </view>
</template>

<script>
  export default {
    name: "sectionTitle",
    props: {
      num: {
        type: String,
      },
      title: {
        type: String,
      },
    },
  }
</script>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
  }

  .title {
    color: #c5c5c5;
    font-size: 16px;
    font-style: italic;
    font-weight: 600;
    padding-bottom: 5px;
  }

  .underline {
    width: 40px;
    height: 4px;
    background-color: #ebebeb;
    margin-bottom: 20px;
  }

  .number {
    font-size: 30px;
  }
</style>
