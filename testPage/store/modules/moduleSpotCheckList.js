// moduleSpotCheckList.js
const state = {
    // stateA 的状态数据
    list: []
};
const mutations = {
    // mutationA 的变更操作
    SETLIST(state, value) {
        state.list = value;
    },
    // 手动选择LevelOne, 同时判断是否联动二级
    setLevelOneStatu(state, { index, statu }) {
        // 如果点击的按钮是第三个,则需要特殊判断,因为当statu>=3,则视第三个按钮为选种状态
        if (statu === 3) {
            // 如果一级已是选中状态,是则联级取消,否则联级选择
            if (state.list[index].statu >= statu) {
                state.list[index].statu = 0;
                state.list[index].f.forEach((sonItem, sonIndex) => {
                    state.list[index].f[sonIndex].statu = 0;
                });
            } else {
                state.list[index].statu = statu;
                state.list[index].f.forEach((sonItem, sonIndex) => {
                    state.list[index].f[sonIndex].statu = statu;
                });
            }
        } else if (state.list[index].statu === statu) { // 如果一级已是选中状态,是则联级取消,否则联级选择
            state.list[index].statu = 0;
            state.list[index].f.forEach((sonItem, sonIndex) => {
                state.list[index].f[sonIndex].statu = 0;
            });
        } else {
            state.list[index].statu = statu;
            state.list[index].f.forEach((sonItem, sonIndex) => {
                state.list[index].f[sonIndex].statu = statu;
            });
        }
    },
    // 手动选择LevelTwo, 同时判断是否联动一级
    setLevelTwoStatu(state, { index, sonIndex, statu }) {
        // 如果点击的按钮是第三个,则需要特殊判断,因为当statu>=3,则视第三个按钮为选种状态
        if (statu === 3) {
            // 如果二级级已是选中状态,是则单独取消,否则单独选择
            if (state.list[index].f[sonIndex].statu >= statu) {
                state.list[index].f[sonIndex].statu = 0;
            } else {
                state.list[index].f[sonIndex].statu = statu;
            }
            // 判断此列是否选择一致,是则联级选择一级,否则联级取消一级
            let flag = state.list[index].f.every(item => {
                return item.statu === statu;
            });
            if (flag) {
                state.list[index].statu = statu;
            } else {
                state.list[index].statu = 0;
            }
        } else if (state.list[index].f[sonIndex].statu === statu) { // 如果二级级已是选中状态,是则单独取消,否则单独选择
            state.list[index].f[sonIndex].statu = 0;
        } else {
            state.list[index].f[sonIndex].statu = statu;
        }
        // 判断此列是否选择一致,是则联级选择一级,否则联级取消一级
        let flag = state.list[index].f.every(item => {
            return item.statu === statu || item.statu >= 3;
        });
        if (flag) {
            state.list[index].statu = statu;
        } else {
            state.list[index].statu = 0;
        }
    },
    // 设置图片
    setPhoto(state, { index, sonIndex, statu, isFromFather, picList }) {
        // isFromFather为1则操作父项,为0则操作子项
        if (isFromFather) {
            // 设置statu
            this.commit('moduleSpotCheckList/setLevelOneStatu', { index, sonIndex, statu });
            // 给每个子项设置图片
            state.list[index].f.forEach((item, insideSonIndex, arr) => {
                state.list[index].f[insideSonIndex].picList = picList;
            });
        } else {
            // 设置statu
            this.commit('moduleSpotCheckList/setLevelTwoStatu', { index, sonIndex, statu });
            // 给单个子项设置图片
            state.list[index].f[sonIndex].picList = picList;
        }
    }
};
const actions = {
    // actionA 的操作
    setList({ commit }, value) {
        // 执行异步操作，然后提交 mutation
        commit('SETLIST', value);
    }
};
const getters = {
};
const moduleSpotCheckList = {
    namespaced: true,
    // 记得开启命名空间
    state,
    mutations,
    actions,
    getters
};

export default moduleSpotCheckList;
