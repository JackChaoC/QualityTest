<template>
    <div id="app">
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: {},
    data() {
        return {};
    },
    methods: {}
};
</script>

<style>
* {
    padding: 0%;
    margin: 0%;
}
html,
body {
    width: 100%;
    height: 100%;
}
#app {
    width: 100%;
    height: 100%;
    background-color: #f1f1f1;
}
</style>
