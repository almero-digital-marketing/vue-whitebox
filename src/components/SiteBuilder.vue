<template>
    <component v-for="item in items" :key="item.title" :is="components[item.component]" v-bind="{...item}"></component>
</template>
<script setup>
defineProps(['items', 'components'])
</script>