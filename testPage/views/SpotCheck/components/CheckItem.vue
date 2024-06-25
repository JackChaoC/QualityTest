<template>
    <div class="check-item">
        <div class="content" v-for="(item, index) in list" :key="index">
            <!-- 父项 -->
            <div class="father">
                <p class="father-left">{{ item.b }}</p>
                <div class="father-right">
                    <radio-button
                        v-model="item.statu"
                        :name="1"
                        :isAutoComfirm="false"
                        @click.native="fatherHandle(index, 1)"
                    />
                    <p>合格</p>
                    <radio-button
                        v-model="item.statu"
                        :name="2"
                        :isAutoComfirm="false"
                        @click.native="fatherHandle(index, 2)"
                    />
                    <p>不合格</p>
                    <radio-button
                        v-model="item.statu"
                        :name="[3, 4, 5]"
                        :isAutoComfirm="false"
                        @click.native="fatherHandle(index, 3)"
                    />
                    <p>其他</p>
                </div>
            </div>
            <!-- 子项 -->
            <div
                class="son"
                v-for="(sonItem, sonIndex) in item.f"
                :key="sonIndex"
            >
                <div class="son-left">
                    <img :src="icon.cir" alt="" />
                    <div>
                        <p class="p1">{{ sonItem.b }}</p>
                        <p v-show="sonItem.statu >= 3" class="p2">
                            {{
                                sonItem.statu === 3
                                    ? '其他'
                                    : sonItem.statu === 4
                                    ? '勉强可用'
                                    : '可用需维护'
                            }}
                        </p>
                        <p v-show="sonItem.picList.length > 0" class="p3">
                            编辑图片
                        </p>
                    </div>
                </div>
                <div class="son-right">
                    <radio-button
                        v-model="sonItem.statu"
                        :name="1"
                        :isAutoComfirm="false"
                        @click.native="sonHandle(index, sonIndex, 1)"
                    />
                    <radio-button
                        v-model="sonItem.statu"
                        :name="2"
                        :isAutoComfirm="false"
                        @click.native="sonHandle(index, sonIndex, 2)"
                    />
                    <radio-button
                        v-model="sonItem.statu"
                        :name="[3, 4, 5]"
                        :isAutoComfirm="false"
                        @click.native="sonHandle(index, sonIndex, 3)"
                    />
                </div>
            </div>
        </div>
        <van-popup class="popup-alert" v-model="isAlertShow">
            <p class="popup-p">请选择检查地点</p>
        </van-popup>
        <van-popup class="popup-Other" v-model="isOtherShow">
            <div class="content">
                <p>
                    {{
                        this.list.length !== 0
                            ? this.list[this.index.index].f[this.index.sonIndex]
                                  .b
                            : ''
                    }}
                </p>
                <div class="item">
                    <div class="left" @click="popupRadioHandle(4)">
                        <img :src="icon.radio" alt="" />
                        <p>勉强可用</p>
                    </div>
                    <div class="right" @click="toOtherQuestion(4)">
                        <p>更多</p>
                        <img :src="icon.arrow" alt="" />
                    </div>
                </div>
                <hr />
                <div class="item">
                    <div class="left" @click="popupRadioHandle(5)">
                        <img :src="icon.radio" alt="" />
                        <p>可用需维护</p>
                    </div>
                    <div class="right" @click="toOtherQuestion(5)">
                        <p>更多</p>
                        <img :src="icon.arrow" alt="" />
                    </div>
                </div>
                <hr />
                <div class="item">
                    <div class="left" @click="popupRadioHandle(3)">
                        <img :src="icon.radio" alt="" />
                        <p>其他</p>
                    </div>
                    <div class="right" @click="toOtherQuestion(3)">
                        <p>更多</p>
                        <img :src="icon.arrow" alt="" />
                    </div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import Vue from 'vue';
import { Popup } from 'vant';
import { mapMutations } from 'vuex';
import { picListStringify } from '@/pages/testPage/utils/Tools';
import RadioButton from './RadioButton.vue';

Vue.use(Popup);

export default {
    props: ['list'],
    components: {
        RadioButton
    },
    data() {
        return {
            icon: {
                cir: require('../assets/cir.png'),
                radio: require('../assets/radio.png'),
                arrow: require('../assets/arrow.png')
            },
            isAlertShow: false,
            isOtherShow: false,
            isFromFather: true, // 记录是从父项还是子项打开遮罩层
            index: {
                // 记录点击项的下标
                index: 0,
                sonIndex: 0
            }
        };
    },
    methods: {
        ...mapMutations('moduleSpotCheckList', [
            'setLevelOneStatu',
            'setLevelTwoStatu'
        ]),
        showAlert() {
            this.isAlertShow = true;
            setTimeout(() => {
                this.isAlertShow = false;
            }, 1000);
        },
        fatherHandle(index, statu) {
            // 这里的statu只有 1 | 2 | 3
            if (
                localStorage.getItem('location') &&
                localStorage.getItem('location') !== ''
            ) {
                // 如果点击的是第三个按钮 而且 按钮为非选中状态
                if (statu === 3 && this.list[index].statu < 3) {
                    // 打开遮罩层
                    this.isOtherShow = true;
                    this.isFromFather = true;
                    this.index = {
                        index,
                        sonIndex: 0
                    };
                } else {
                    const value = {
                        index,
                        statu
                    };
                    this.setLevelOneStatu(value);
                }
            } else {
                this.showAlert();
            }
        },
        sonHandle(index, sonIndex, statu) {
            if (
                localStorage.getItem('location') &&
                localStorage.getItem('location') !== ''
            ) {
                // 如果点击的是第三个按钮 而且 按钮为非选中状态
                if (statu === 3 && this.list[index].f[sonIndex].statu < 3) {
                    // 打开遮罩层
                    this.isOtherShow = true;
                    this.isFromFather = false;
                    this.index = {
                        index,
                        sonIndex
                    };
                } else {
                    const value = {
                        index,
                        sonIndex,
                        statu
                    };
                    this.setLevelTwoStatu(value);
                }
            } else {
                this.showAlert();
            }
        },
        popupRadioHandle(statu) {
            // 判断是否从父项打开的遮罩层
            if (this.isFromFather) {
                const value = {
                    index: this.index.index,
                    statu
                };
                this.setLevelOneStatu(value);
                this.isOtherShow = false;
                console.log(this.list[this.index.index]);
            } else {
                const value = {
                    index: this.index.index,
                    sonIndex: this.index.sonIndex,
                    statu
                };
                this.setLevelTwoStatu(value);
                this.isOtherShow = false;
                console.log(this.list[this.index.index].f[this.index.sonIndex]);
            }
        },
        toOtherQuestion(statu) {
            this.$router.push({
                name: 'OtherQuestion',
                query: {
                    hi: this.$parent.query.hi,
                    statu,
                    index: this.index.index,
                    sonIndex: this.index.sonIndex,
                    isFromFather: this.isFromFather ? 1 : 0, // 1代表true,0代表false
                    img: picListStringify(
                        this.list[this.index.index].f[this.index.sonIndex].picList
                    )
                }
            });
        }
    },
    activated() {
        // 关闭遮罩层
        this.isOtherShow = false;
    }
};
</script>
<style lang="less">
* {
    padding: 0%;
    margin: 0%;
}
.check-item {
    width: 100%;
    color: #252525;
    .content {
        width: 100%;
        .father {
            height: 40px;
            line-height: 40px;
            display: flex;
            justify-content: space-between;
            .father-left {
                margin-left: 10px;
                color: @blue;
            }
            .father-right {
                position: relative;
                display: flex;
                margin-right: 10px;
                .radio-button {
                    margin: 4px 5px;
                }
            }
        }
        .son {
            min-height: 50px;
            line-height: 50px;
            background-color: #fff;
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
            .son-left {
                display: flex;
                img {
                    width: 20px;
                    height: 20px;
                    margin: 14.5px 2px 0 10px;
                }
                div {
                    margin-top: 9px;
                    p {
                        line-height: 2;
                    }
                    .p2 {
                        color: @blue;
                    }
                    .p3 {
                        color: @blue;
                    }
                }
            }
            .son-right {
                position: relative;
                display: flex;
                margin-right: 15px;
                .radio-button {
                    margin: 5px 16px;
                }
            }
        }
    }
    // 弹出层
    .popup-alert {
        width: 120px;
        padding: 20px;
        border-radius: 5px;
        p {
            width: 100%;
            text-align: center;
        }
    }
    .popup-Other {
        padding: 15px;
        width: 330px;
        border-radius: 5px;
        .content {
            > p {
                font-size: 20px;
                font-weight: 600;
            }
            .item {
                width: 100%;
                height: 50px;
                line-height: 50px;
                display: flex;
                justify-content: space-between;
                .left {
                    display: flex;
                    img {
                        width: 30px;
                        height: 30px;
                        margin-top: 10px;
                    }
                    p {
                    }
                }
                .right {
                    display: flex;
                    color: @blue;
                    img {
                        width: 18px;
                        height: 18px;
                        margin-top: 15px;
                    }
                }
            }
        }
    }
}
</style>
