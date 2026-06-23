<template>
  <slot v-for="x in foods" :key="x.name" :foodName="x.desc" :foodUrl="x.url"></slot>
</template>
<script lang="ts">
export default {
  data() {
    return {
      foods: [
        { name: 'Apple', desc: 'Apples are a type of fruit that grow on trees.', url: 'img_apple.svg' },
        { name: 'Pizza', desc: 'Pizza has a bread base with tomato sauce, cheese, and toppings on top.', url: 'img_pizza.svg' },
        { name: 'Rice', desc: 'Rice is a type of grain that people like to eat.', url: 'img_rice.svg' },
        { name: 'Fish', desc: 'Fish is an animal that lives in water.', url: 'img_fish.svg' },
        { name: 'Cake', desc: 'Cake is something sweet that tastes good but is not considered healthy.', url: 'img_cake.svg' }
      ]
    }
  }
}
</script>
<style scoped>
div {
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin: 10px;
}
</style>
