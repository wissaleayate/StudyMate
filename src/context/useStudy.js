import { useContext } from 'react'
import { StudyContext } from './StudyContextInstance'

export function useStudy() {
  const ctx = useContext(StudyContext)
  if (!ctx) {
    throw new Error('useStudy must be used within a StudyProvider')
  }
  return ctx
}
