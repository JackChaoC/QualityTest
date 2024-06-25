<template>
    <div class="spot-check">
        <div class="room-id">
            <van-cell
                :title="query.locNames"
                :icon="homeIcon"
                style="height:50px;font-size:17px;"
            >
                <!-- 使用 right-icon 插槽来自定义右侧图标 -->
            </van-cell>
        </div>
        <div class="time-place">
            <div class="time">
                <p>
                    检查时间：<span @click="earlyShow = !earlyShow">{{
                        caculatedEarlyDate
                    }}</span>
                    -
                    <span @click="lateShow = !lateShow">{{
                        caculatedLateDate
                    }}</span>
                </p>
            </div>
            <!-- 前时间选择器 -->
            <van-dialog
                v-model="earlyShow"
                title="开始时间"
                :showConfirmButton="false"
                closeOnClickOverlay
            >
                <van-datetime-picker
                    v-model="earlyDate"
                    type="datetime"
                    title="选择年月日"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @confirm="earlyDateConfirm"
                    @cancel="cancel"
                />
            </van-dialog>
            <!-- 后时间选择器 -->
            <van-dialog
                v-model="lateShow"
                title="结束时间"
                :showConfirmButton="false"
                closeOnClickOverlay
            >
                <van-datetime-picker
                    v-model="lateDate"
                    type="datetime"
                    title="选择年月日"
                    :min-date="earlyDate"
                    :max-date="maxDate"
                    @confirm="lateDateConfirm"
                    @cancel="cancel"
                />
            </van-dialog>
            <div style="height:3px;"></div>
            <div class="place">
                <router-link
                    :to="{
                        path: '/Location',
                        query: {
                            aHotelId: query.hi
                        }
                    }"
                >
                    <p style="color:black;">
                        <span class="left">检查地点：</span>
                        <span class="right" style="color:#aaaaaa;">{{
                            location
                        }}</span>
                        <img :src="arrowIcon" alt="" />
                    </p>
                </router-link>
            </div>
        </div>
        <!-- list -->
        <check-item :list="list" />
        <!-- note -->
        <div class="note">
            <p><img :src="noteIcon" alt="" />备注</p>
            <textarea
                name=""
                id=""
                cols="30"
                rows="10"
                v-model="note"
            ></textarea>
        </div>
        <!-- pic -->
        <div class="pic" @click="toPhoto">
            <div class="pic-left">
                <img :src="picIcon" alt="" />
                <p>
                    添加图片<span style="color:#0073c6"
                        >({{ picList.length }})</span
                    >
                </p>
            </div>
            <img :src="arrowIcon" alt="" />
        </div>
        <!-- 测试div的scrollY,可以删掉 -->
        <div class="bottom">
            <div class="left">
                <img :src="pointIcon" alt="" />
            </div>
            <div class="right" @click="getForm">
                确定
            </div>
        </div>
        <!-- <div style="height:200px;"></div> -->
    </div>
</template>
<script>
import dayjs from 'dayjs';
import Vue from 'vue';
import { Cell, DatetimePicker, Dialog } from 'vant';
import Api from '@/api';
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import CheckItem from './components/CheckItem.vue';
import { formatLocation } from '../../utils/format';
import { picListStringify } from '../../utils/Tools';

Vue.use(Cell);
Vue.use(DatetimePicker);
Vue.use(Dialog);
export default {
    components: {
        CheckItem
    },
    data() {
        return {
            query: {
                hi: '',
                uid: Number,
                deptId: Number,
                locIds: Number,
                locNames: Number,
                code: Number,
                mode: '',
                projectId: Number,
                targetType: Number
            },
            // 手动排列好的测试List
            testList: [
                {
                    a: 21933,
                    a1: 3096,
                    b: '默认检查项',
                    c: '',
                    d: 0,
                    e: 0,
                    f: [
                        {
                            a: 21934,
                            a1: 3096,
                            b: '工程',
                            c: '',
                            d: 1,
                            e: 21933
                        },
                        {
                            a: 21935,
                            a1: 3096,
                            b: '卫生',
                            c: '',
                            d: 1,
                            e: 21933
                        },
                        {
                            a: 21936,
                            a1: 3096,
                            b: '物品缺漏',
                            c: '',
                            d: 1,
                            e: 21933
                        }
                    ]
                },
                {
                    a: 21961,
                    a1: 3096,
                    b: 'gaaaa',
                    c: '',
                    d: 0,
                    e: 0,
                    f: [
                        {
                            a: 21962,
                            a1: 3096,
                            b: 'aae1',
                            c: 'uoiiiiiiiiiij',
                            d: 1,
                            e: 21961
                        }
                    ]
                }
            ],
            homeIcon: require('../../assets/icon/home.png'),
            arrowIcon: require('../../assets/icon/arrow.png'),
            noteIcon: require('../../assets/icon/note.png'),
            picIcon: require('../../assets/icon/pic.png'),
            pointIcon: require('../../assets/icon/point.png'),
            minDate: new Date(),
            maxDate: Object,
            earlyDate: new Date(),
            lateDate: new Date(),
            caculateEarlyDate: Number,
            caculateLateDate: Number,
            earlyShow: false,
            lateShow: false,
            note: '',
            location: '', // 在localstorage获取的地址
            picList: []
        };
    },
    computed: {
        ...mapState('moduleSpotCheckList', ['list']),
        // 展现给用户看的时间格式
        caculatedEarlyDate() {
            return dayjs(this.earlyDate).format('YYYY/MM/DD HH:mm');
        },
        caculatedLateDate() {
            return dayjs(this.lateDate).format('YYYY/MM/DD HH:mm');
        }
    },
    methods: {
        ...mapActions('moduleSpotCheckList', ['setList']),
        shortenTime(time) {
            let a1;
        },
        // 开始时间确认 value类型:Date()
        earlyDateConfirm(value) {
            console.log(value);
            this.earlyDate = value;
            this.earlyShow = !this.earlyShow;
        },
        // 结束时间确认
        lateDateConfirm(value) {
            console.log(value);
            this.lateDate = value;
            this.lateShow = !this.lateShow;
        },
        // 关闭时间选择器
        cancel() {
            this.earlyShow = false;
            this.lateShow = false;
        },
        // 获取表单时间参数:目标时间对象的时间戳(秒级)-获取当天0点时间戳
        caculateTime(dateObj) {
            return (
                dayjs(dateObj).unix() -
                dayjs()
                    .startOf('day')
                    .unix()
            );
        },
        /**
         *
         * list模块↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
         */
        // 将请求回来的平面化的list转化为有层级的list
        listFilter(arr) {
            let levelOne = arr.filter(value => {
                return value.d == 0;
            });
            levelOne.forEach(item1 => {
                // 给每个一级加一个statu属性
                this.$set(item1, 'statu', 0);
                // 将二级的每一个分组过滤出来
                let levelTwoArr = arr.filter(item2 => {
                    return item1.a == item2.e;
                });
                // 给每个二级设置一个状态、图片列表
                levelTwoArr.forEach(item => {
                    this.$set(item, 'statu', 0);
                    this.$set(item, 'picList', []);
                });
                this.$set(item1, 'f', levelTwoArr);
            });
            return levelOne;
        },
        // 获取list
        getList() {
            return axios({
                method: 'POST',
                url: Api.SpotCheckGetItems,
                data: {
                    aHotelId: this.query.hi,
                    aProjectId: this.query.projectId
                }
            });
        },
        /**
         *
         * list模块↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
         */
        toPhoto() {
            this.$router.push({
                name: 'Photo',
                query: {
                    hi: this.query.hi,
                    img: picListStringify(this.picList)
                }
            });
        },
        // 收集表单数据
        gatherOrder() {
            const order = {
                aHotelId: this.query.hi,
                aDeptId: this.query.deptId,
                aOperatorId: this.query.uid,
                aOrders: [
                    {
                        b: 2,
                        c: this.query.locIds,
                        d: this.list[0].a, // 有差别
                        x: [],
                        a1: this.list[0].a1,
                        c1: 1,
                        d2: formatLocation(localStorage.getItem('location'))
                    },
                    // 批量检查时数组长度大于1
                    {
                        b: 2,
                        c: this.query.locIds,
                        d: this.list[1].a, // 有差别
                        x: [],
                        a1: this.list[0].a1,
                        c1: 1,
                        d2: formatLocation(localStorage.getItem('location'))
                    }
                ],
                aOrderDetail: {
                    k: this.caculateTime(this.earlyDate), // k 检查开始时间
                    l: this.caculateTime(this.lateDate), // l 检查结束时间
                    t: this.note, // t 备注
                    x: []
                }
            };
            return order;
        },
        // @Test 点击查看表单数据
        getForm() {
            console.log(this.list);
            console.log(this.gatherOrder());
        }
    },
    created() {
        // 第二天23:59的时间对象
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 0, 0);
        this.maxDate = tomorrow;
        // 获取url参数
        this.query = {
            ...this.$route.query
        };
        // 获取list
        this.getList().then(res => {
            this.setList(this.listFilter(res.data.aItems));
        });
    },
    activated() {
        // 本地获取区域数据
        if (localStorage.getItem('location')) {
            this.location = localStorage.getItem('location');
            console.log('本地获取区域数据', localStorage.getItem('location'));
        } else {
            this.location = '请选择检查地点';
        }
        // 本地获取图片list
        if (localStorage.getItem(`${this.$route.name}Photos`)) {
            this.picList = JSON.parse(
                localStorage.getItem(`${this.$route.name}Photos`)
            );
            console.log('本地获取图片list', this.picList);
        }
    },
    mounted() {
        setTimeout(() => {
            console.log(this.list, '我是页面SpotCheck');
        }, 200);
    }
};
</script>
<style lang="less">
.spot-check {
    position: absolute;
    top: 0;
    left: 0;
    //设置最外层div的上内边距,配合div.room-id的fiexd效果,和div的height加起来要等于100vh
    margin-top: 6vh;
    height: 94vh;
    width: 100%;
    background-color: #f1f1f1;
    color: #373737;
    overflow: scroll;
    .room-id {
        position: fixed;
        width: 100%;
        top: 0%;
        margin-top: 5px;
        .van-cell {
            font-size: 20px !important;
            img {
                width: 20px;
                height: 20px;
                margin-right: 5px;
            }
        }
    }
    .time-place {
        margin-top: 7px;
        //time&place统一样式
        .timeAndplace {
            background-color: #fff;
            min-height: 50px;
            line-height: 50px;
            p {
                margin: 0 10px;
                span {
                    text-decoration: underline;
                    color: #0073c6;
                }
                img {
                    float: right;
                    width: 20px;
                    height: 20px;
                    position: relative;
                    top: 14px;
                }
            }
        }
        .time {
            .timeAndplace;
        }
        .place {
            .timeAndplace;
            p {
                display: flex;
                .right {
                    display: inline-block;
                    margin-top: 10px;
                    line-height: 30px;
                    width: 80%;
                    text-decoration: none;
                }
                .left {
                    min-width: 80px;
                    text-decoration: none;
                    color: rgb(46, 46, 46);
                }
                img {
                    margin-left: 10%;
                }
            }
        }
    }
    .note {
        margin-top: 10px;
        p {
            height: 40px;
            line-height: 40px;
            margin: 0;
            background-color: #fff;
            img {
                margin-left: 15px;
                margin-right: 5px;
                width: 20px;
                height: 20px;
                position: relative;
                top: 3px;
            }
        }
        textarea {
            width: 80%;
            border: none;
            padding: 0 10%;
            resize: none;
        }
    }
    .pic {
        display: flex;
        justify-content: space-between;
        height: 50px;
        background-color: #fff;
        margin-top: 5px;
        margin-bottom: 60px;
        img {
            width: 20px;
            height: 20px;
            margin: 15px 15px;
            margin-right: 5px;
        }
        .pic-left {
            height: 100%;
            line-height: 50px;
            display: flex;
            justify-content: space-between;
        }
    }
    .bottom {
        //怪异盒模型
        box-sizing: border-box;
        position: fixed;
        bottom: 0;
        padding: 5px;
        width: 100vw;
        height: 50px;
        display: flex;
        justify-content: space-evenly;
        background-color: #f1f1f1;
        .left {
            width: 15%;
            border-radius: 8px;
            background-color: #373737;
            position: relative;
            img {
                width: 30px;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
        .right {
            width: 80%;
            border-radius: 8px;
            background-color: #0073c6;
            text-align: center;
            line-height: 40px;
            color: #fff;
            font-size: 16px;
        }
    }
}
// 图标统一大小
.icon-size {
    width: 20px;
    height: 20px;
}
//单选框图标样式
.img-icon {
    .icon-size;
}
//list-item图标样式
.img-circle {
    .icon-size;
    padding: 17px 0;
}
</style>
