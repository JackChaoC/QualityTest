<template>
    <div class="radio-button" @click="changeStatu">
        <img :src="isActive ? icon.chooseActive : icon.choose" alt="" />
    </div>
</template>
<script>
export default {
    props: {
        name: { // 对应原始单选框的name属性
            required: true // 表示该prop是必需的，父组件必须传递该prop
        },
        isAutoComfirm: { // true:点击单选框自动改变状态,false:点击单选框后不做任何操作
            type: Boolean,
            required: false,
            default: true
        },
        value: { // 接收v-model
            required: true,
            default: 0
        }
    },
    data() {
        return {
            icon: {
                choose: require('../assets/choose.png'),
                chooseActive: require('../assets/chooseActive.png')
            }
        };
    },
    computed: {
        isActive() {
            if (Array.isArray(this.name)) {
                return this.name.includes(this.value);
            } else {
                return this.name === this.value;
            }
        }
    },
    methods: {
        changeStatu() {
            // "isAutoComfirm"is "true" do 1.未选中=>选中 2.选中=>未选中 ; "isAutoComfirm"is "false" do nothing
            if (this.isAutoComfirm) {
                if (this.value !== this.name) {
                    this.$emit('input', this.name);
                } else {
                    this.$emit('input', 0);
                }
            }
        }
    },
    
};
</script>
<style lang="less">
.radio-button {
    width: 20px;
    height: 20px;
    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
}
</style>
