import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { InferResponseType } from 'hono/client'
import toast from 'react-hot-toast'
import { css, cx } from 'styled-system/css'

import { Button } from '@/components/ui/Button'
import { getTodosKey, useDeleteTodosTodoId, usePatchTodosTodoId } from '@/hooks'
import type { client } from '@/lib'

type Todo = InferResponseType<typeof client.todos.$get, 200>[number]

export function TodoItem({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient()
  const invalidate = {
    onSuccess: () => queryClient.invalidateQueries({ queryKey: getTodosKey() }),
  }
  const patch = usePatchTodosTodoId({ mutation: invalidate })
  const del = useDeleteTodosTodoId({ mutation: invalidate })

  const toggle = () =>
    patch.mutate(
      { param: { todoId: todo.id }, json: { completed: !todo.completed } },
      { onError: () => toast.error('更新に失敗しました') },
    )

  const remove = () =>
    del.mutate({ param: { todoId: todo.id } }, { onError: () => toast.error('削除に失敗しました') })

  return (
    <li className={css({ display: 'flex', alignItems: 'center', gap: '3', py: '3' })}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={toggle}
        disabled={patch.isPending}
        aria-label={`「${todo.title}」を${todo.completed ? '未完了' : '完了'}にする`}
        className={css({
          boxSize: '5',
          flexShrink: '0',
          cursor: 'pointer',
          accentColor: 'indigo.600',
        })}
      />
      <Link
        to="/todos/$todoId"
        params={{ todoId: todo.id }}
        className={cx(
          css({
            minW: '0',
            flex: '1',
            truncate: true,
            transition: 'colors',
            _hover: { color: 'indigo.600' },
          }),
          todo.completed
            ? css({ color: 'slate.400', textDecoration: 'line-through' })
            : css({ color: 'slate.800' }),
        )}
      >
        {todo.title}
      </Link>
      <Button variant="danger" size="sm" onClick={remove} disabled={del.isPending}>
        削除
      </Button>
    </li>
  )
}
