import dotenv from 'dotenv'
import StoryblokClient from 'storyblok-js-client'

dotenv.config()

export const Storyblok = new StoryblokClient({
  accessToken: process.env.STORYBLOK_API_KEY,
})
