import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Stack, Text, Link } from '@fluentui/react';
import memoize from 'promise-memoize'

const renderers = {
  heading: (props: { level: 1 | 2 | 3; children: any }) => {
    const { level, children } = props

    const size = {
      1: 'mega',
      2: 'xxLarge',
      3: 'xLarge'
    }

    const variant: any = size[level]
    const headerType: any = `h${level}`

    return <Text as={headerType} variant={variant}>{children[0].props.value}</Text>
  },
  text: Text,
  link: Link
}

const getMarkdown = memoize(async (url: string) => {
  const req = await fetch(url)
  const markdown = await req.text()

  return markdown
})

export const createMarkdownPage = async (filename: string) => {
  const markdown = await getMarkdown(filename)
  return {
    default: () => (
      <Stack
        verticalFill
        styles={{
          root: {
            maxWidth: 960,
            height: 'auto'
          }
        }}>
        <ReactMarkdown renderers={renderers} source={markdown} />
      </Stack>
    )
  }
}