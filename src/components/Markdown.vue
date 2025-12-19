<template>
	<div class="markdown" v-html="markdown" @click="routeLinks" ref="component"></div>
</template>
<script setup>
import MarkdownIt from 'markdown-it'
import { computed, onUpdated, ref, inject, onMounted, nextTick } from 'vue'
import { useWhiteboxDocuments, useWhiteboxRoutes } from 'mikser-whitebox-sdk'
import { useRouter } from 'vue-router'

const props = defineProps({
	source: {
		type: String,
		default: ''
	},
	lang: {
		type: String,
		default: ''
	},
	options: {
		type: Object,
		default: {}
	},
	plugins: {
		type: Array,
		default: []
	}
})

const config = inject('markdown', {
	options: {},
	plugins: []
})

const documents = useWhiteboxDocuments()
const routes = useWhiteboxRoutes()
const component = ref(null)
const router = useRouter()

const markdown =  computed(() => {
	let markdown = new MarkdownIt({
		html: true,
		breaks: true, 
		...config.options,
		...props.options
	})
	const plugins = [
		...props.plugins, 
		...config.plugins
	]
	plugins.forEach(({ plugin, options }) => {
		markdown.use(plugin, options)
	})
	
	markdown.renderer.rules.link_open = (tokens, idx, options, env, self) => {
		const token = tokens[idx]
		const hrefIndex = token.attrIndex('href')
		if (hrefIndex >= 0) {
			const link = token.attrs[hrefIndex]
			const href = link[1]
			const isExternal = /^https?:/.test(href)
			const isPhone = /^tel:/.test(href)
			if (isExternal || isPhone) {
				const targetIndex = token.attrIndex('target')
				if (targetIndex < 0) {
					tokens[idx].attrPush(['target', '_blank'])
				} else {
					tokens[idx].attrs[targetIndex][1] = '_blank'
				}
				tokens[idx].attrPush(['rel', 'noopener'])
				
				if (isPhone) {
					const [phone, tag] = href.split('@')
					tokens[idx].attrs[hrefIndex][1] = phone
					tokens[idx].attrPush(['data-whitebox-voip-tag', tag])
					let format = phone.replace('tel:', '')
					if (format.indexOf('00') == 0 || format.indexOf('+') == 0) {
						tokens[idx].attrPush(['data-whitebox-voip-format', 'international'])
					} else {
						tokens[idx].attrPush(['data-whitebox-voip-format', 'national'])
					}
				}
			} else {
				let reverse = routes.reverseRoutes[href]
				if (reverse) {
					let lang = props.lang || documents.document.meta.lang
					let route = reverse.find((documentRoute) => documentRoute.document.meta.lang == lang)
					if (route) {
						tokens[idx].attrs[hrefIndex][1] = encodeURI(route.refId)
					}
				}
			}
			return self.renderToken(tokens, idx, options)
		}
	}

	try {
		return markdown.render(props.source || '')
	} catch(err) {
		console.error(err)
	}
	return ''
})

function routeLinks(e) {
	if (e.target.tagName == 'A') {
		let href = decodeURI(e.target.getAttribute('href'))
		if (/_blank/i.test(e.target.getAttribute('target'))) {
			const isPhone = /^tel:/.test(href)
			if (!isPhone) {
				let { hostname } = new URL(href)
				window.whitebox.init('analytics', analytics => {
					analytics?.service.context('external', {
						hostname,
						href
					})
				})
			}
		} else {
			if (href[0] != '#') {
				let route = routes.documentRoutes[href]
				if (route) {
					e.preventDefault()
					router.push(encodeURI(href))
				}
			}
		}
	}
}

function refreshVoip() {
	for(let link of component.value.querySelectorAll("a")) {
		let href = decodeURI(link.getAttribute('href'))
		const isPhone = /^tel:/.test(href)
		if (isPhone) {
			window.whitebox.init('voip', voip => {
				voip?.service.call(link)
			})
		}
	}
}

onUpdated(refreshVoip)
onMounted(() => nextTick(refreshVoip))
</script>