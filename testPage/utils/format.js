// 副楼;02层;1202(fl;02c;1202) => 副楼;02层;1202
const formatLocation = function (str) {
    return str.split('(')[0];
};

export { formatLocation };