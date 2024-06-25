<template>
    <div style="background-color: #e64d4d;">
        i am view one
    </div>
</template>
<script>
import axios from 'axios';

export default {
    mounted() {
        axios({
            method: 'POST',
            url:
                'http://innertest.landow.cn:9109/HouseKeepingService/SpotCheck/GetItems',
            data: {
                aHotelId: '4b07a61b13dc6d4774441cfb9ed2b815',
                aProjectId: 3096
            }
        }).then(res => {
            console.log(res.data);
        });
    }
};
</script>
<style lang=""></style>
