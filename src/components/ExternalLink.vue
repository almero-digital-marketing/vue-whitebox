<template>
    <a class="extenal-link" :href="href" :title="title" :target="target" click="trackLink">
        <slot></slot>
    </a>
</template>
<script setup>
defineProps({
    href: {
        type: String,
        default: ''
    },
    title: {
        type: String,
        default: ''
    },
    target: {
        type: String,
        default: '_blank'
    }
})

function trackLink(e) {
    const href = e.target.getAttribute('href')
    const { hostname } = new URL(href)
    window.whitebox.init('analytics', analytics => {
        analytics?.service.context('external', {
            hostname,
            href
        })
    })
}
</script>