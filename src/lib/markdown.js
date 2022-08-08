import MarkdownIt from 'markdown-it'

function markdown(source, options = {}, plugins = []) {
    let markdown = new MarkdownIt({
        html: true,
        breaks: true, 
        ...options
    })
    plugins.forEach(({ plugin, options }) => {
        markdown.use(plugin, options)
    })
    try {
        return markdown.render(source || '')
    } catch(err) {
        console.error(err)
    }
    return ''
}
export { markdown }
