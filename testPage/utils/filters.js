function filterLoactionData(str) {
    const match = str.match(/(.*?)(?=\\)/); // 正则表达式匹配结果
    return match?.[1] ?? ""; // 返回匹配的内容或空字符串
}
export { filterLoactionData };