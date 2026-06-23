<template>
    <div class="pinkBall"></div>
    <li v-bind="$attrs" style="margin: 5px 0;">{{ itemName }}</li>
    <div class="pinkBall"></div>

</template>
<script>
export default {
    props: ['itemName']
}
</script>