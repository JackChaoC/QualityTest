<template>
    <div class="OtherQuestion">
        <div class="question-describe">
            <div class="left">
                <img :src="icon.pen" alt="" />
                <p>问题描述</p>
            </div>
            <p class="right">50/200</p>
        </div>
        <div class="question-content">
            <div class="content">
                <van-field
                    v-model="message"
                    rows="1"
                    autosize
                    type="textarea"
                    placeholder="请填写发现的问题"
                />
            </div>
        </div>
        <!-- pic -->
        <div class="pic" @click="toPhoto">
            <div class="pic-left">
                <img :src="icon.pic" alt="" />
                <p>
                    添加图片<span style="color:#0073c6"
                        >({{ picList.length }})</span
                    >
                </p>
            </div>
            <img :src="icon.arrow" alt="" />
        </div>
        <div class="notice" @click="isPopupShow = !isPopupShow">
            <div class="left">
                <img :src="icon.back" alt="" />
                <p>整改通知<span>通知相关部门整改</span></p>
            </div>
            <img :src="icon.arrow" alt="" />
        </div>
        <div class="notice-content">
            <div class="btn">
                <radio-button :name="1" v-model="isShowLevelTwo" />
                <p>{{ '新建内务通知' }}</p>
            </div>
            <div class="affair-notice">
                <p>处理人：<span>请选择</span></p>
                <img :src="icon.arrow" alt="" />
            </div>
        </div>
        <van-popup v-model="isPopupShow">
            <div>123</div>
        </van-popup>
    </div>
</template>
<script>
/**
 * @name OtherQuestion
 * @description ?hi=4b07a61b13dc6d4774441cfb9ed2b815&statu=5&img=%2FImg%2F4b07a61b13dc6d4774441cfb9ed2b815%2F1_08320f1eb75d401f8d7c92bf3e5f1cf9.png%3B%2FImg%2F4b07a61b13dc6d4774441cfb9ed2b815%2F2_f3d206c3afa6418880153b356ea0d28a.png%3B%2FImg%2F4b07a61b13dc6d4774441cfb9ed2b815%2F3_e41b8e601e5f4693947b2b71dc2bc599.png%3B
 * @hi {String} queryParam1 - 酒店id
 * @statu {Number} queryParam2 - 检查项信息。
 * @img {String} queryParam2 - 图片地址。'/Img/4b07a61b13dc6d4774441cfb9ed2b815/1_08320f1eb75d401f8d7c92bf3e5f1cf9.png;/Img/4b07a61b13dc6d4774441cfb9ed2b815/2_f3d206c3afa6418880153b356ea0d28a.png;/Img/4b07a61b13dc6d4774441cfb9ed2b815/3_e41b8e601e5f4693947b2b71dc2bc599.png;'
'
 */
import Vue from 'vue';
import { Field, Popup } from 'vant';
import RadioButton from '@/pages/testPage/views/SpotCheck/components/RadioButton.vue';
import { mapMutations } from 'vuex';
import { picListParse, picListStringify } from '@/pages/testPage/utils/Tools';
import Utils from '@/utils/utils';

Vue.use(Field);
Vue.use(Popup);
export default {
    components: { RadioButton },
    comments: {
        RadioButton,
        Popup
    },
    data() {
        return {
            query: {
                hi: '',
                statu: Number,
                index: {
                    index: 0,
                    sonIndex: 0
                },
                isFromFather: Boolean
            },
            icon: {
                pen: require('../../assets/icon/pen.png'),
                pic: require('../../assets/icon/pic.png'),
                back: require('../../assets/icon/back.png'),
                arrow: require('../../assets/icon/arrow.png')
            },
            picList: [],
            message: '',
            messageList: [],
            isShowLevelOne: false,
            isShowLevelTwo: 1,
            isPopupShow: false
        };
    },
    methods: {
        ...mapMutations('moduleSpotCheckList', ['setPhoto']),
        isApp() {
            try {
                const vers = window.localStorage.getItem(
                    'LandowNativeAppVersion'
                );
                if (vers && vers.length > 0) {
                    return true;
                }
            } catch (e) {
                console.log(e);
            }
            return false;
        },
        // 当来自非'Photo'路由时用此函数
        getQuery(vm) {
            vm.query.hi = vm.$route.query.hi;
            vm.query.statu = vm.$route.query.statu;
            vm.query.index.index = vm.$route.query.index;
            vm.query.index.sonIndex = vm.$route.query.sonIndex;
            vm.query.isFromFather = vm.$route.query.isFromFather;
            vm.picList = picListParse(vm.$route.query.img); // 转化为数组对象
        },
        // 当来自'Photo'路由时用此函数
        getPhoto(vm) {
            vm.picList = JSON.parse(
                localStorage.getItem(`${this.$route.name}Photos`)
            );
        },
        toPhoto() {
            this.$router.push({
                name: 'Photo',
                query: {
                    hi: this.query.hi,
                    img: picListStringify(this.query.picList)
                }
            });
        },
        backToSpotCheck() {
            console.log('back执行成功');
            this.setPhoto({
                index: this.query.index.index,
                sonIndex: this.query.index.sonIndex,
                statu: this.query.statu,
                isFromFather: this.query.isFromFather,
                picList: this.picList
            });
            this.$router.go(-1);
        }
    },
    beforeRouteEnter(to, from, next) {
        if (from.name !== 'Photo') {
            next(vm => {
                vm.getQuery(vm);
            });
        } else {
            next(vm => {
                vm.getPhoto(vm);
            });
        }
    },
    activated() {
        Utils.loadActionBar('确定', 'backToSpotCheck()');
    },
    deactivated() {
        Utils.removeActionBar();
    },
    mounted() {
        window.backToSpotCheck = this.backToSpotCheck;
    }
};
</script>
<style lang="less" scoped>
.arrow-size {
    width: 20px;
    height: 20px;
}
.OtherQuestion {
    width: 100%;
    .question-describe {
        background-color: #fff;
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        .left {
            display: flex;
            img {
                height: 15px;
                width: 15px;
                margin: 16px 10px 0 15px;
            }
            p {
            }
        }
        .right {
            margin-right: 15px;
        }
    }
    .question-content {
        background-color: #fff;
        .content {
            margin-left: 25px;
            min-height: 250px;
            padding-right: 25px;
            border-top: 1px solid rgb(240, 240, 240);
            .van-field {
                overflow: auto;
            }
        }
    }
    .pic {
        display: flex;
        justify-content: space-between;
        height: 50px;
        background-color: #fff;
        margin-top: 10px;
        .pic-left {
            height: 100%;
            line-height: 50px;
            display: flex;
            justify-content: space-between;
        }
        img {
            .arrow-size;
            margin: 15px 15px;
            margin-right: 5px;
        }
    }
    .notice {
        background-color: #fff;
        margin-top: 10px;
        height: 50px;
        line-height: 50px;
        display: flex;
        justify-content: space-between;
        .left {
            display: flex;
            img {
                .arrow-size;
            }
            p {
                span {
                    font-size: 10px;
                    font-weight: 200;
                    color: #aaaaaa;
                    display: inline-block;
                    margin-left: 10px;
                }
            }
        }
        img {
            width: 20px;
            height: 20px;
            margin: 15px 15px;
            margin-right: 5px;
        }
    }
    .notice-content {
        background-color: #fff;
        line-height: 40px;
        font-size: 14px;
        .btn {
            display: flex;
            height: 40px;
            .radio-button {
                margin: 5px 5px 0 15px;
            }
        }
        .affair-notice {
            display: flex;
            height: 40px;
            justify-content: space-between;
            p {
                margin-left: 40px;
            }
            img {
                width: 20px;
                height: 20px;
                padding: 10px 5px;
            }
        }
    }
}
</style>
