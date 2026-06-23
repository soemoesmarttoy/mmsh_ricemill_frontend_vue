<template>
    <div v-on:click="countClicks">
        <h2>{{ foodName }}</h2>
        <img src="/img_quality.svg" v-show="isFav">
        <p>{{ foodDesc }}</p>
        <p id="red">You have clicked me {{ clicks }} times.</p>
        <button v-on:click="toggleFav">Fav</button>

    </div>

</template>
<script>
export default {
    // props: [
    //     'foodName',
    //     'foodDesc',
    //     'isFav'
    // ],
    props: {
        foodName: {
            type: String,
            required: true
        },
        foodDesc: {
            type: String,
            required: false,
            default: 'This is the default',
            validator: function (value) {
                if (20 < value.length && value.length < 50) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        isFav: {
            type: Boolean,
            default: false,
            required: false,
        }
    },
    data() {
        return {

            foodIsFav: this.isFav,
            name: 'Apples',
            message: 'I like apples',
            clicks: 0
        }
    },
    emits: ['toggle-fav'],
    methods: {

        countClicks() {
            this.clicks++;
        },
        toggleFav() {
            this.$emit('toggle-fav', this.foodName);
        },
    }
};
</script>
<style>
#red {
    font-weight: bold;
    color: rgb(144, 12, 12);
}

img {
    height: 1.5em;
    float: right;
}
</style>