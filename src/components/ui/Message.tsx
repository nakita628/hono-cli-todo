import type { ReactNode } from 'react'
import { css, cx } from 'styled-system/css'

/** ルートの pendingComponent / errorComponent 用の中央寄せメッセージ。 */
export function Message({
  tone = 'muted',
  children,
}: {
  tone?: 'muted' | 'error'
  children: ReactNode
}) {
  return (
    <div
      className={cx(
        css({ mx: 'auto', maxW: 'xl', px: '4', py: '16', textAlign: 'center' }),
        tone === 'error' ? css({ color: 'rose.500' }) : css({ color: 'slate.400' }),
      )}
    >
      {children}
    </div>
  )
}
