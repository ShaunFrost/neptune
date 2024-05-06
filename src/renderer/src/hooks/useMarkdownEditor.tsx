import { useAppContext } from '@renderer/store/AppContext'
import { AUTOSAVE_THROTTLE_TIME } from '@shared/constants'
import { throttle } from 'lodash'

export const useMarkDownEditor = () => {
  const { markdownContent, updateProjectMarkdown, selectedProjectId } = useAppContext()

  const autoSave = throttle(
    async (content: string) => {
      if (!selectedProjectId) return
      await updateProjectMarkdown(content)
    },
    AUTOSAVE_THROTTLE_TIME,
    {
      leading: false,
      trailing: true
    }
  )

  return {
    markdownContent,
    autoSave
  }
}
