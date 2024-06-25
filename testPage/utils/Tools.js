const picListStringify = (picList) => {
    if (picList && picList.length !== 0) {
        return `${picList.join(';')};`;
    }
    return '';
};
const picListParse = (str) => {
    if (str !== '') {
        let arr = str.split(';');
        arr.pop();// 去掉空数组
        return arr;
    }
    return [];
};
export { picListStringify, picListParse };