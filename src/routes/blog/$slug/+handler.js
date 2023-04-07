import markdownToHtml from '../../../lib/markdown.server'
import { Storyblok } from '../../../lib/storyblok.server'

export async function GET(context, next) {
  const { slug } = context.params
  context['post'] = null
  try {
    const { data } = await Storyblok.get('cdn/stories/posts/' + slug, {
      resolve_relations: 'author',
    })
    const { story, rels } = data
    story['content']['long_text'] = await markdownToHtml(story['content']['long_text'])
    story['content']['author'] = rels[0]
    context['post'] = story
  } catch (e) {
    console.log(e.message || e.toString())
  }
  return next()
}
