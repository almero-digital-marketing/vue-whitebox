<template>
  <div>
    <h1>WhiteBox</h1> 
    <nav><router-link to="/">Home</router-link></nav>
    <nav><router-link :to="$href('/web/projects').link">Projects</router-link></nav>
    <router-view v-slot="{ Component }">
        <component :is="Component" />
    </router-view>
  </div>
</template>
<script setup>
import { provide } from 'vue'
import classy from 'markdown-it-classy'

provide('markdown', {
  plugins: [{
    plugin: classy,
    options: {}
  }]
})
</script>