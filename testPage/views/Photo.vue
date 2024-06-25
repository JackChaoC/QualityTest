<template>
    <div class="Photo">
        <div class="item-content">
            <add-photo
                v-for="(item, index) in picList"
                :pic="item"
                :key="index"
                @deletePhoto="isDeletePhoto(index)"
            />
            <add-photo v-show="isShowAddPhoto" @click.native="addPhoto" />
        </div>
        <input
            type="file"
            ref="fileInput"
            accept="image/*"
            capture
            multiple
            style="display: none"
            @change="webHandlePhotos"
        />
    </div>
</template>
<script>
/**
 * 图片本地存储key:${this.fromName}Photos
 * @name OtherQuestion
 * @description ?hi=4b07a61b13dc6d4774441cfb9ed2b815&img=%2FImg%2F4b07a61b13dc6d4774441cfb9ed2b815%2F1_08320f1eb75d401f8d7c92bf3e5f1cf9.png%3B%2FImg%2F4b07a61b13dc6d4774441cfb9ed2b815%2F2_f3d206c3afa6418880153b356ea0d28a.png%3B%2FImg%2F4b07a61b13dc6d4774441cfb9ed2b815%2F3_e41b8e601e5f4693947b2b71dc2bc599.png%3B
 * @hi {String} queryParam1 - 酒店id
 * @img {String} queryParam2 - 图片地址。'/Img/4b07a61b13dc6d4774441cfb9ed2b815/1_08320f1eb75d401f8d7c92bf3e5f1cf9.png;/Img/4b07a61b13dc6d4774441cfb9ed2b815/2_f3d206c3afa6418880153b356ea0d28a.png;/Img/4b07a61b13dc6d4774441cfb9ed2b815/3_e41b8e601e5f4693947b2b71dc2bc599.png;'
'
 */
import Vue from 'vue';
import axios from 'axios';
import Api from '@/api';
import { Dialog, Button, Toast } from 'vant';
import { picListParse } from '@/pages/testPage/utils/Tools';
import Utils from '@/utils/utils';
import AddPhoto from '../components/AddPhoto.vue';

Vue.use(Dialog);
Vue.use(Button);
Vue.use(Toast);

export default {
    props: {
        // 是否展示web的"完成"按钮,web环境下为true,app环境下为false
        isShowWebBtn: {
            default: false
        }
    },
    components: {
        AddPhoto
    },
    data() {
        return {
            query: {
                hi: '',
                picList: [] // 无域名前缀的图片地址
            },
            picList: [], // 包含域名前缀的图片地址(完整图片地址)
            isShowAddPhoto: true,
            maxCount: 20, // 图片最大数量,修改这里即可
            fromName: ''
        };
    },
    computed: {
        // 还能选择多少张照片
        selectLength() {
            return this.maxCount - this.picList.length;
        }
    },
    watch: {
        picList(newValue, oldValue) {
            this.isShowAddPhoto = newValue.length !== this.maxCount;
        }
    },
    methods: {
        getQuery() {
            this.query.hi = this.$route.query.hi;
            this.query.picList = picListParse(this.$route.query.img);
        },
        // 格式化query拿到的图片list
        formatList() {
            if (this.query.picList.length > 0) {
                this.picList = this.query.picList.map(
                    // 给每个照片地址转码然后加上地址前缀
                    item =>
                        `${Api.InnerTestGetPhoto}${decodeURIComponent(item)}`
                );
            } else {
                // this.picList会有缓存,必须重新清空
                this.picList = [];
            }
        },
        // 点击添加按钮添加图片,需要绑定到window下给原生调用
        addPhoto() {
            // 判断是否为app,是则app选择照片,否则web选择
            if (Utils.isApp()) {
                /**
                 * 旧版调用原生选择图片
                 * 新的页面请使用`Tools.selectPhoto`
                 */
                // options,修改这里即可
                const json = {
                    multiple: true,
                    maxCount: this.maxCount,
                    selectedCount: this.picList.length,
                    sourceType: ['album', 'camera'],
                    callback: 'handlerPhotoSelectedResult'
                };
                Utils.selectPhoto(json);
            } else {
                this.$refs.fileInput.click();
            }
        },

        // web选择&处理照片
        webHandlePhotos(e) {
            // 已选择文件的数量
            const fileListLength = e.target.files.length;
            // 已选择文件数量 必须 小于或等于 还能选择的图片数量
            if (fileListLength <= this.selectLength) {
                const base64Arr = [];
                const pathArr = [];
                e.target.files.forEach((item, index, arr) => {
                    const file = e.target.files[index];
                    const fileReader = new FileReader();
                    fileReader.onload = () => {
                        // 注意! FileReader.onload是异步函数
                        base64Arr.push(fileReader.result);
                        pathArr.push(e.target.files[index].name);
                        // 判断是否为执行到最后一个元素,是则上传图片
                        if (index === fileListLength - 1) {
                            console.log('开始上传图片');
                            this.handlerPhotoSelectedResult(base64Arr, pathArr);
                            console.log(e.target.files);
                            this.$refs.fileInput.value = '';
                        }
                    };
                    fileReader.readAsDataURL(file);
                });
            } else {
                Toast.fail(`还能选择${this.selectLength}张照片`);
            }
        },
        // callback,照片选择完毕的回调,需要绑定到window下给原生调用
        handlerPhotoSelectedResult(base64Arr, pathArr) {
            // step1.上传图片,同时获取路径地址
            axios({
                method: 'POST',
                url:
                    process.env.NODE_ENV === 'production'
                        ? Api.SavePhotos
                        : '/innerTest9151/Tool/SavePhotos',
                data: {
                    hi: this.query.hi,
                    base64: base64Arr,
                    name: pathArr
                }
            }).then(
                res => {
                    console.log(res.data);
                    if (res.data.iResult === 0) {
                        // step2.给本地list添加元素;
                        console.log('添加图片成功');
                        pathArr.forEach(item => {
                            this.query.picList.push(res.data[item]);
                            this.picList.push(
                                `${Api.InnerTestGetPhoto}${res.data[item]}`
                            );
                        });
                    }
                },
                err => {
                    console.log('添加图片失败(请求错误)', err);
                }
            );
        },
        // 是否删除图片,这里是弹出框
        isDeletePhoto(index) {
            console.log(index);
            console.log(this.query.picList);
            // 弹出框确认是否删除
            Dialog.confirm({
                message: '确定要删除这组照片?',
                closeOnClickOverlay: true,
                confirmButtonText: '确定',
                confirmButtonColor: '#0073c6'
            })
                .then(() => {
                    this.deletePhoto(index);
                })
                .catch(() => {
                    // on cancel
                });
        },
        // 删除指定照片
        deletePhoto(index) {
            // step1.发送请求删除图片
            axios({
                method: 'POST',
                url:
                    process.env.NODE_ENV === 'production'
                        ? Api.DeletePhoto
                        : '/innerTest9151/Tool/DeletePhoto',
                data: {
                    hi: this.query.hi,
                    path: this.query.picList[index]
                }
            }).then(
                res => {
                    if (res.data.Result === 0) {
                        // step2.删除本地list中的元素;
                        this.query.picList.splice(index, 1);
                        this.picList.splice(index, 1);
                    }
                },
                err => {
                    console.log(err);
                }
            );
            console.log('confirmDelete');
        },
        // 保存退出(保存图片list到localStorage
        saveAndOut() {
            localStorage.setItem(
                `${this.fromName}Photos`,
                JSON.stringify(this.query.picList)
            );
            this.$router.go(-1);
        }
    },
    activated() {
        // 获取query数据
        this.getQuery();
        console.log(this.picList);
        // 格式化图片列表
        this.formatList();
        // 添加按钮
        Utils.loadActionBar('完成', 'saveAndOut()');
    },
    deactivated() {
        // 销毁按钮节点
        Utils.removeActionBar();
    },
    mounted() {
        window.saveAndOut = this.saveAndOut;
        window.handlerPhotoSelectedResult = this.handlerPhotoSelectedResult;
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.fromName = from.name;
        });
    }
};
</script>
<style lang="less" scoped>
.Photo {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0%;
    top: 0%;
    overflow: scroll;
    .item-content {
        display: flex;
        justify-content: left;
        flex-wrap: wrap;
        .item {
            max-width: 150px;
            max-height: 150px;
            width: 30vw;
            height: 30vw;
            margin: 1.66vw;
        }
    }
}
</style>
