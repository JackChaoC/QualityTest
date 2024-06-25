// store.js
import Vue from 'vue';
import Vuex from 'vuex';
import moduleSpotCheckList from './modules/moduleSpotCheckList';

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        moduleSpotCheckList
    }
});

export default store;
