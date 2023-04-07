import { Storyblok } from '../lib/storyblok.server'

export async function GET(context, next) {
  try {
    const { data } = await Storyblok.get('cdn/stories/taglines/home')
    context['tagline'] = Storyblok.richTextResolver.render(data.story.content.Text)
  } catch (e) {
    console.log(e.message || e.toString())
    context['tagline'] = null
  }
  return next()
}
