import { css } from 'styled-system/css'

import { CreateTodoForm } from '@/features/todos/components/CreateTodoForm'
import { TodoItem } from '@/features/todos/components/TodoItem'
import { card, page } from '@/features/todos/styles'
import { useSuspenseTodos } from '@/hooks'

export function TodoApp() {
  const { data: todos } = useSuspenseTodos()
  const remaining = todos.filter((todo) => !todo.completed).length
  const done = todos.length - remaining

  return (
    <main className={page}>
      <header className={css({ mb: '8' })}>
        <h1
          className={css({
            fontSize: '3xl',
            fontWeight: 'bold',
            letterSpacing: 'tight',
            color: 'slate.900',
          })}
        >
          Todo
        </h1>
        <p className={css({ mt: '1', fontSize: 'sm', color: 'slate.500' })}>
          ひとつずつ、片付けていく。
        </p>
      </header>

      <div className={card}>
        <CreateTodoForm />

        {todos.length === 0 ? (
          <div className={css({ py: '14', textAlign: 'center' })}>
            <p className={css({ fontSize: '4xl' })} aria-hidden="true">
              ✨
            </p>
            <p className={css({ mt: '3', fontWeight: 'medium', color: 'slate.500' })}>
              まだ Todo がありません
            </p>
            <p className={css({ mt: '1', fontSize: 'sm', color: 'slate.400' })}>
              上のフォームから最初の 1 件を追加してください
            </p>
          </div>
        ) : (
          <>
            <ul
              className={css({
                mt: '6',
                '& > li + li': { borderTopWidth: '1px', borderColor: 'slate.100' },
              })}
            >
              {todos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </ul>

            <footer
              className={css({
                mt: '6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '4',
                fontSize: 'sm',
                color: 'slate.500',
              })}
            >
              <span>
                残り {remaining} 件 / 全 {todos.length} 件
              </span>
              <div
                className={css({
                  h: '1.5',
                  w: '32',
                  overflow: 'hidden',
                  rounded: 'full',
                  bg: 'slate.100',
                })}
                aria-hidden="true"
              >
                <div
                  className={css({
                    h: 'full',
                    rounded: 'full',
                    bg: 'indigo.500',
                    transition: 'all',
                    transitionDuration: '300ms',
                  })}
                  style={{ width: `${(done / todos.length) * 100}%` }}
                />
              </div>
            </footer>
          </>
        )}
      </div>
    </main>
  )
}
