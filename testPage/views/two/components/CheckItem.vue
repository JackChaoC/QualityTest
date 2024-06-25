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
                    <p>{{ sonItem.b }}</p>
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
    </div>
</template>
<script>
import { mapMutations } from 'vuex';
import RadioButton from './RadioButton.vue';

export default {
    props: ['list'],
    components: {
        RadioButton
    },
    data() {
        return {
            icon: {
                cir: require('../assets/cir.png')
            },
            data: {}
        };
    },
    methods: {
        ...mapMutations('moduleSpotCheckList', [
            'setLevelOneStatu',
            'setLevelTwoStatu'
        ]),
        fatherHandle(index, statu) {
            const value = {
                index,
                statu
            };
            this.setLevelOneStatu(value);
        },
        sonHandle(index, sonIndex, statu) {
            const value = {
                index,
                sonIndex,
                statu
            };
            this.setLevelTwoStatu(value);
        },
        testThiridButton(index, sonIndex) {
            const value = {
                index,
                sonIndex,
                statu: 4
            };
            this.setLevelTwoStatu(value);
        }
    },
    mounted() {
        setTimeout(() => {
            console.log(this.list);
        }, 1000);
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
            height: 50px;
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
}
</style>
