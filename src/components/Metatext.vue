<template>
	<div class="metatext" v-html="metatext"></div>
</template>
<script setup>

import { computed } from 'vue'

const props = defineProps({
	source: {
		type: String,
		default: ''
	},
})
const metatext = computed(() => {
	if (typeof props.source != 'string') {
		let err = new Error('Argument is not a string');
		err.origin = 'metatext';
		throw err;
	}
	return props.source
		.replaceAll('<','<<')
		.replaceAll('>','>>')
		.replaceAll('<<','<s>')
		.replaceAll('>>','</s>')
		.replaceAll('{','<u>')
		.replaceAll('}','</u>')
		.replaceAll('(','<b>')
		.replaceAll(')','</b>')
		.replaceAll('[','<i>')
		.replaceAll(']','</i>')
		.replaceAll('|','<br>')
		.replaceAll('_','<hr>')
		.replaceAll('~','&nbsp;');
})

</script>