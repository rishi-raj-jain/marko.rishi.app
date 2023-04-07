import { Storyblok } from '../../lib/storyblok.server'

export async function GET(context, next) {
  context['tagline'] = null
  context['timeline'] = []
  try {
    const { data } = await Storyblok.get('cdn/stories/taglines/about')
    context['tagline'] = Storyblok.richTextResolver.render(data.story.content.Text)
  } catch (e) {
    console.log(e.message || e.toString())
  }
  try {
    const Timeline = {}
    const getStories = async (page, client) => {
      const res = await client.get('cdn/stories', {
        page: page,
        per_page: 100,
        starts_with: 'timeline/',
      })
      let stories = res.data.stories
      stories.forEach((story) => {
        const renderedText = client.richTextResolver.render(story.content.Description)
        if (Timeline.hasOwnProperty(story.content.Year)) {
          Timeline[story.content.Year].push({ ...story, renderedText })
        } else {
          Timeline[story.content.Year] = [{ ...story, renderedText }]
        }
      })
      let total = res.total
      let lastPage = Math.ceil(total / res.perPage)
      if (page <= lastPage) {
        page++
        await getStories(page, client)
      }
    }
    await getStories(1, Storyblok)
    context['timeline'] = Timeline
  } catch (e) {
    console.log(e.message || e.toString())
  }
  return next()
}
