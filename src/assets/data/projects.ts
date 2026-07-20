import type { Project } from '@/types'

export const projects: { [k: string]: Project[] } = {
  websites: [
    {
      title: 'tonyventrella.com',
      description: 'A marketing site and blog with built in text editor for admins.',
      technologies: ['NextJS', 'Tailwind', 'Postgres'],
      projectUrl: 'https://tonyventrella.com',
      gitUrl: 'https://github.com/Jerud-Moyer/tony-ventrella-web/',
      imgFileName: 'tony_website.png',
    },
    {
      title: 'eskart.net',
      description:
        'A portfolio site with a custom admin-interface allowing the artist to upload and manage their own content.',
      technologies: ['Vue', 'Quasar', 'Express', 'Cloudinary'],
      projectUrl: 'https://eskart.net/#/',
      gitUrl: 'https://github.com/Eileen-Kane-website',
      imgFileName: 'eskart.png',
    },
    {
      title: 'Amphead',
      description: 'A website for a cool local business.',
      technologies: ['React', 'Express'],
      projectUrl: 'https://amphead.org',
      gitUrl: 'https://github.com/Amphead-Lanham',
      imgFileName: 'amphead.png',
    },
  ],
  fun: [
    {
      title: 'Nura',
      description: 'An AI Genie.',
      technologies: ['NextJS', 'Tailwind', 'OpenAI API'],
      projectUrl: 'https://nuraai.net',
      gitUrl: 'https://github.com/Jerud-Moyer/nura-ai/',
      imgFileName: 'nura.png',
    },
    {
      title: 'Dolor Meus',
      description: 'A lorem-ipsum generator with a fun twist.',
      technologies: ['Flask', 'OpenAI API'],
      projectUrl: 'https://dolor-me.us',
      gitUrl: 'https://github.com/Jerud-Moyer/dolor-meus/',
      imgFileName: 'dolor_meus.png',
    },
    {
      title: 'nerdMeme',
      description: 'A random* meme generator',
      technologies: ['NextJS', 'Tailwind', 'Express'],
      projectUrl: 'https://nerdmeme.fun',
      gitUrl: 'https://github.com/Jerud-Moyer/nerdmeme-web/',
      imgFileName: 'nerdmeme.png',
    },
  ],
}
