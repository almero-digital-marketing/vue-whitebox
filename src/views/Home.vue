<template>
    <div class="home">
        <h2>HOME</h2>
        <textarea v-model="source"></textarea>
        <markdown :source="source"></markdown>
        {{ $document.meta }}
        <p>Projects: <strong>{{ $collections.items.loaded }}</strong> Count: <strong>{{ $collections.items.length }}</strong></p>
    </div>
</template>
<script setup>
import { ref } from 'vue'
import Markdown from '../components/Markdown.vue'

const source = ref('При изпращане на запитването ви възника грешла. Можете да се свържете с нас на телефон ![Телефон](/img/phone.svg) [0879243684](tel:0879243684@sofia)')
</script>