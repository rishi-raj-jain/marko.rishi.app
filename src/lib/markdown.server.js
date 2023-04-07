import slugger from 'slugger'
import { load } from 'cheerio'
import prism from 'remark-prism'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'

const addCopyToCode = (text) => {
  const $ = load(`<html><head></head><body>${text}</body></html>`)
  $('.remark-highlight').each((_, i) => {
    $(i).attr('id', `code-block-${_}`)
    $(i).addClass('relative')
    $(i).prepend(`
      <div onclick="window.copyTextToClipboard('#code-block-${_}')" class="group hide-if-no-javascript cursor-pointer absolute top-3 right-1 flex flex-row gap-x-2 items-center rounded border border-gray-600 py-1 hover:border-gray-400">
        <span id="code-block-${_}-text" class="ml-2 text-gray-500 group-hover:text-gray-300">Copy</span>
        <svg id="code-block-${_}-icon" class="fill-gray-500 group-hover:fill-gray-300" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg>
      <div>
    `)
  })
  return $('body').html()
}

const assignIDs = (text) => {
  const $ = load(`<html><head></head><body>${text}</body></html>`)
  $('h1,h2').each((_, i) => {
    $(i).attr('id', slugger($(i).text()))
  })
  return $('body').html()
}

const highlightHref = (text) => {
  const $ = load(`<html><head></head><body>${text}</body></html>`)
  $('a').each((_, i) => {
    $(i).addClass('text-blue-600')
  })
  return $('body').html()
}

export default async function markdownToHtml(markdown, highlightHrefs = false) {
  let result = await unified().use(remarkParse).use(prism).use(remarkRehype).use(rehypeStringify).process(markdown)
  result = assignIDs(addCopyToCode(result.toString()))
  if (highlightHrefs) {
    result = highlightHref(result)
  }
  return result
}
