import { css } from 'styled-system/css'

/** ページ全体の幅と余白。 */
export const page = css({ mx: 'auto', maxW: 'xl', px: '4', py: '12' })

/** 白いカード。 */
export const card = css({
  bg: 'white',
  rounded: '2xl',
  p: { base: '6', sm: '8' },
  shadow: 'sm',
  borderWidth: '1px',
  borderColor: 'slate.900/5',
})

/** 「← 一覧に戻る」リンク。 */
export const backLink = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '1',
  fontSize: 'sm',
  fontWeight: 'medium',
  color: 'slate.500',
  transition: 'colors',
  _hover: { color: 'indigo.600' },
})
