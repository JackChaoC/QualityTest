<template>
    <div>
        <!-- 参数1 pic: 照片url,有则显示,无则显示加号 -->
        <!-- 自定义事件1 @deletePhoto: 点击右上角交叉触发点击事件 -->
        <div class="item">
            <img
                :src="pic ? pic : addIcon"
                :class="pic ? 'img-big' : 'img-icon'"
                alt=""
            />
            <div v-show="pic" class="x-icon-content" @click="deletePhoto">
                <img :src="xIcon" alt="" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['pic'],
    data() {
        return {
            addIcon: require('../assets/icon/add.png'),
            xIcon: require('../assets/icon/x.png'),
            testPic: require('../assets/icon/testPic.png')
        };
    },
    methods: {
        deletePhoto() {
            this.$emit('deletePhoto');
        }
    }
};
</script>
<style lang="less" scoped>
.item {
    background-color: #fff;
    width: 30vw;
    height: 30vw;
    margin: 1.66vw;
    position: relative;
}
.img-icon {
    width: 15vw;
    height: 15vw;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%;-50%);
}
.img-big {
    object-fit: fill;
    width: 100%;
    height: 100%;
}
.x-icon-content {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    height: 20px;
    width: 20px;
    margin: 3px;
    background-color: #0073c6;
    img {
        object-fit: contain;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        height: 70%;
    }
}
</style>
