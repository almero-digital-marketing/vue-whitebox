<template>
    <component v-for="(item, index) in items" :key="item.component + index" :is="components[item.component] || item.component" v-bind="{...item}"></component>
</template>
<script setup>
defineProps({
    items: {
        type: Array,
        required: true,
    },
    components: {
        type: Object,
        default: {}
    }
})
</script>