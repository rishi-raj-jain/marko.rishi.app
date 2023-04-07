import { Storyblok } from '../../lib/storyblok.server'

export async function GET(context, next) {
  context['allPosts'] = []
  context['tagline'] = null
  context['recommendedPosts'] = null
  try {
    const { data } = await Storyblok.get('cdn/stories/taglines/blogs')
    context['tagline'] = Storyblok.richTextResolver.render(data.story.content.Text)
  } catch (e) {
    console.log(e.message || e.toString())
  }
  try {
    let Posts = []
    const getPosts = async (page, client) => {
      const res = await client.get('cdn/stories', {
        page: page,
        per_page: 100,
        starts_with: 'posts/',
      })
      Posts = [...Posts, ...res.data.stories]
      let total = res.total
      let lastPage = Math.ceil(total / res.perPage)
      if (page <= lastPage) {
        page++
        await getPosts(page, client)
      }
    }
    await getPosts(1, Storyblok)
    context['allPosts'] = Posts
  } catch (e) {
    console.log(e.message || e.toString())
  }
  try {
    const { data } = await Storyblok.get('cdn/stories', { page: 1, per_page: 100, starts_with: 'recommended/' })
    context['recommendedPosts'] = data.stories
  } catch (e) {
    console.log(e.message || e.toString())
  }
  return next()
}
