import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { css } from 'styled-system/css'

import { SubmitButton } from '@/components/ui/SubmitButton'
import { getTodosKey, usePostTodos } from '@/hooks'

export function CreateTodoForm() {
  const queryClient = useQueryClient()
  const create = usePostTodos({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getTodosKey() }),
    },
  })

  const action = async (formData: FormData) => {
    const title = formData.get('title')
    if (typeof title !== 'string') {
      return
    }
    try {
      await create.mutateAsync({ json: { title } })
    } catch {
      toast.error('追加に失敗しました')
    }
  }

  return (
    <form action={action} className={css({ display: 'flex', gap: '2' })}>
      <input
        name="title"
        type="text"
        placeholder="なにをする？"
        required
        pattern=".*\S.*"
        maxLength={200}
        autoComplete="off"
        className={css({
          minW: '0',
          flex: '1',
          rounded: 'xl',
          borderWidth: '1px',
          borderColor: 'slate.200',
          bg: 'slate.50',
          px: '4',
          py: '2.5',
          color: 'slate.900',
          outline: 'none',
          transition: 'colors',
          _placeholder: { color: 'slate.400' },
          _focus: {
            borderColor: 'indigo.400',
            bg: 'white',
            boxShadow: '0 0 0 2px {colors.indigo.100}',
          },
        })}
      />
      <SubmitButton pendingText="追加中…">追加</SubmitButton>
    </form>
  )
}
