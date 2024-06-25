<template>
    <div>
        <check-item :list="list" />
    </div>
</template>
<script>
import Api from '@/api';
import axios from 'axios';
import { mapState, mapActions } from 'vuex';
import CheckItem from './components/CheckItem.vue';

export default {
    components: {
        CheckItem
    },
    data() {
        return {
            query: {
                id: undefined,
                projectId: undefined
            }
        };
    },
    computed: {
        ...mapState('moduleSpotCheckList', ['list'])
    },
    methods: {
        ...mapActions('moduleSpotCheckList', ['setList']),
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
                // 给每个二级设置一个状态
                levelTwoArr.forEach(item => {
                    this.$set(item, 'statu', 0);
                });
                this.$set(item1, 'f', levelTwoArr);
            });
            return levelOne;
        },
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
    },
    created() {
        this.query = {
            ...this.$route.query
        };
        this.getList().then(res => {
            this.setList(this.listFilter(res.data.aItems));
        });
    }
};
</script>
<style lang=""></style>
