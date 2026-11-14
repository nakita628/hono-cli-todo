import { createFileRoute, Link } from '@tanstack/react-router'
import { css } from 'styled-system/css'

import { Message } from '@/components/ui/Message'
import { TodoDetail } from '@/features/todos/components/TodoDetail'
import { getTodosTodoIdQueryOptions } from '@/hooks'

export const Route = createFileRoute('/todos/$todoId')({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      getTodosTodoIdQueryOptions({ param: { todoId: params.todoId } }),
    ),
  pendingComponent: () => <Message>読み込み中…</Message>,
  errorComponent: () => (
    <Message>
      <p className={css({ fontSize: 'lg', fontWeight: 'semibold', color: 'slate.700' })}>
        Todo が見つかりません
      </p>
      <p className={css({ mt: '2', fontSize: 'sm' })}>
        削除されたか、URL が間違っている可能性があります
      </p>
      <Link
        to="/"
        className={css({
          mt: '6',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '1',
          fontSize: 'sm',
          fontWeight: 'medium',
          color: 'indigo.600',
          _hover: { color: 'indigo.500' },
        })}
      >
        ← 一覧に戻る
      </Link>
    </Message>
  ),
  component: RouteComponent,
})

function RouteComponent() {
  const { todoId } = Route.useParams()
  return <TodoDetail todoId={todoId} />
}
