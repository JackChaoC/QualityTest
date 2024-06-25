/* 参数一 msg:item名字 参数二 isHaveChild:是否显示小箭头,默认不展示 参数三
searchMsg:过滤搜索后的内容 */
<template>
    <div class="LocationItem">
        <p v-if="msg">{{ msg | filter }}</p>
        <p v-if="searchMsg">{{ searchMsg }}</p>
        <img v-show="isHaveChild" :src="arrowIcon" alt="" />
    </div>
</template>
<script>
import { filterLoactionData } from '../utils/filters';

export default {
    props: ['msg', 'isHaveChild', 'searchMsg'],
    data() {
        return {
            arrowIcon: require('../assets/icon/arrow.png')
        };
    },
    filters: {
        filter(value) {
            if (!value) return this.searchMsg;
            return filterLoactionData(value);
        }
    }
};
</script>
<style lang="less">
.LocationItem {
    width: 100%;
    height: 40px;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgb(241, 241, 241);
    p {
        margin-left: 20px;
    }
    img {
        width: 20px;
        height: 20px;
        margin: 10px;
        margin-right: 15px;
    }
}
</style>
