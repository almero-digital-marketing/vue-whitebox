<template>
    <a ref="component" 
        :href="'tel:' + phone" 
        target="_blank" 
        class="phone" 
        :data-whitebox-voip-format="format" 
        :data-whitebox-voip-tag="tag" 
        :data-whitebox-voip-replace="voipReplace">
        <slot></slot>
    </a>
</template>
<script setup>
import { onMounted, ref, computed } from 'vue'

const props = defineProps({
    phone: {
        type: String,
        default: ''
    },
    format: {
        type: String,
        default: 'national'
    },
    tag: {
        type: String,
        default: ''
    },
    replace: {
        type: String,
        default: ''
    },
    replaceExpression: {
        type: String,
        default: ''
    }
})

const voipReplace = computed(() => {
    return props.replaceExpression || props.replace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
})

const component = ref(null)

onMounted(() => {
    window.whitebox.init('voip', voip => {
        voip?.service.call(component.value)
    })
})

</script>