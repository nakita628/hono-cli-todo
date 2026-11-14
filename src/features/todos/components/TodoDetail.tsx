import { useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'
import toast from 'react-hot-toast'
import { css, cx } from 'styled-system/css'

import { Button } from '@/components/ui/Button'
import { backLink, card, page } from '@/features/todos/styles'
import {
  getTodosKey,
  useDeleteTodosTodoId,
  usePatchTodosTodoId,
  useSuspenseTodosTodoId,
} from '@/hooks'

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('ja-JP', { dateStyle: 'medium', timeStyle: 'short' })

const term = css({ color: 'slate.400' })
const value = css({ mt: '1', fontWeight: 'medium', color: 'slate.700' })

export function TodoDetail({ todoId }: { todoId: string }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const invalidate = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getTodosKey() }),
  }
  const { data: todo } = useSuspenseTodosTodoId({ param: { todoId } })
  const patch = usePatchTodosTodoId({ mutation: invalidate })
  const del = useDeleteTodosTodoId({ mutation: invalidate })

  const toggle = () =>
    patch.mutate(
      { param: { todoId: todo.id }, json: { completed: !todo.completed } },
      { onError: () => toast.error('更新に失敗しました') },
    )

  const remove = () =>
    del.mutate(
      { param: { todoId: todo.id } },
      {
        onSuccess: () => void navigate({ to: '/' }),
        onError: () => toast.error('削除に失敗しました'),
      },
    )

  return (
    <main className={page}>
      <Link to="/" className={backLink}>
        ← 一覧に戻る
      </Link>

      <article className={cx(card, css({ mt: '4' }))}>
        <div
          className={css({
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '4',
          })}
        >
          <h1
            className={cx(
              css({
                fontSize: '2xl',
                fontWeight: 'bold',
                letterSpacing: 'tight',
                overflowWrap: 'break-word',
                minW: '0',
              }),
              todo.completed
                ? css({ color: 'slate.400', textDecoration: 'line-through' })
                : css({ color: 'slate.900' }),
            )}
          >
            {todo.title}
          </h1>
          <span
            className={cx(
              css({
                mt: '1',
                display: 'inline-flex',
                flexShrink: '0',
                alignItems: 'center',
                rounded: 'full',
                px: '2.5',
                py: '0.5',
                fontSize: 'xs',
                fontWeight: 'medium',
                borderWidth: '1px',
              }),
              todo.completed
                ? css({ bg: 'emerald.50', color: 'emerald.600', borderColor: 'emerald.500/20' })
                : css({ bg: 'amber.50', color: 'amber.600', borderColor: 'amber.500/20' }),
            )}
          >
            {todo.completed ? '完了' : '未完了'}
          </span>
        </div>

        <dl
          className={css({
            mt: '8',
            display: 'grid',
            gridTemplateColumns: { base: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
            gap: '4',
            fontSize: 'sm',
          })}
        >
          <div>
            <dt className={term}>作成日時</dt>
            <dd className={value}>{formatDateTime(todo.createdAt)}</dd>
          </div>
          <div>
            <dt className={term}>更新日時</dt>
            <dd className={value}>{formatDateTime(todo.updatedAt)}</dd>
          </div>
          <div className={css({ gridColumn: { sm: 'span 2' } })}>
            <dt className={term}>ID</dt>
            <dd
              className={css({ mt: '1', fontFamily: 'mono', fontSize: 'xs', color: 'slate.500' })}
            >
              {todo.id}
            </dd>
          </div>
        </dl>

        <div
          className={css({
            mt: '8',
            display: 'flex',
            alignItems: 'center',
            gap: '2',
            borderTopWidth: '1px',
            borderColor: 'slate.100',
            pt: '6',
          })}
        >
          <Button onClick={toggle} disabled={patch.isPending}>
            {todo.completed ? '未完了にする' : '完了にする'}
          </Button>
          <Button variant="danger" onClick={remove} disabled={del.isPending}>
            削除
          </Button>
        </div>
      </article>
    </main>
  )
}
