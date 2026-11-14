import { createFileRoute } from '@tanstack/react-router'

import { Message } from '@/components/ui/Message'
import { TodoApp } from '@/features/todos/components/TodoApp'
import { getTodosQueryOptions } from '@/hooks'

export const Route = createFileRoute('/')({
  loader: ({ context }) => context.queryClient.ensureQueryData(getTodosQueryOptions()),
  pendingComponent: () => <Message>読み込み中…</Message>,
  errorComponent: () => <Message tone="error">読み込みに失敗しました</Message>,
  component: TodoApp,
})
