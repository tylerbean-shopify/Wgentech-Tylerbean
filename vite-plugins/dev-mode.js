import fs from 'fs'
import path from 'path'

const ROOT_PATH = './'
const SNIPPET_DIR = 'snippets'
const TAG_SNIPPET_NAME = '_tag'
const CLIENT_SNIPPET_NAME = '_client'

const TAG_SNIPPET_PATH = path.join(ROOT_PATH, SNIPPET_DIR, TAG_SNIPPET_NAME + '.liquid')
const CLIENT_SNIPPET_PATH = path.join(ROOT_PATH, SNIPPET_DIR, CLIENT_SNIPPET_NAME + '.liquid')

const SNIPPET_DISCLAIMER = '{% comment %}\nIMPORTANT: Please do not modify or remove this file. It is automatically generated to facilitate asset loading for the theme.\n{% endcomment %}'

const getDevScriptTag = () =>
  `<script type="module" src="http://127.0.0.1:5173/frontend/{{ _tag }}" crossorigin="anonymous"></script>`

const getDevStyleTag = () => `<link rel="stylesheet" href="http://127.0.0.1:5173/frontend/{{ _tag }}">`

const getBuiltScriptTag = () => '<script type="module" src="{{ file_name | asset_url }}" crossorigin="anonymous"></script>'

const getBuiltStyleTag = () => '{{ file_name | asset_url | stylesheet_tag }}'

const getTagSnippet = (isDev = false) => {
  const checkExtension =
    '{%- liquid\n' +
    '  assign file_name = _tag | split: "/" | last\n' +
    '  assign extension = _tag | split: "." | last\n' +
    '%}'

  return `${SNIPPET_DISCLAIMER}\n${checkExtension}\n{%- if extension == 'js' -%}\n  ` +
    (isDev ? getDevScriptTag() : getBuiltScriptTag()) + '\n' +
    `{%- elsif extension == 'css' -%}\n  ` +
    (isDev ? getDevStyleTag() : getBuiltStyleTag()) + '\n' +
    `{%- endif -%}`
}

const getViteClientSnippet = (isDev = false) => {
  return SNIPPET_DIR + '\n' +
    isDev ? '<script type="module" src="http://127.0.0.1:5173/@vite/client" crossorigin="anonymous"></script>' : ''
}

export default function devMode () {
  return {
    name: 'dev-mode',
    enforce: 'post',
    configureServer () {
      fs.writeFileSync(TAG_SNIPPET_PATH, getTagSnippet(true), 'utf8')
      fs.writeFileSync(CLIENT_SNIPPET_PATH, getViteClientSnippet(true), 'utf8')
    },
    closeBundle () {
      fs.writeFileSync(TAG_SNIPPET_PATH, getTagSnippet(), 'utf8')
      fs.writeFileSync(CLIENT_SNIPPET_PATH, getViteClientSnippet(), 'utf8')
    }
  }
}
