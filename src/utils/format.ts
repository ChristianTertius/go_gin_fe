import { formatDistanceToNow, parseISO } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export const timeAgo = (dateString?: string) => {
  if (!dateString) return 'Baru saja'
  try {
    return formatDistanceToNow(parseISO(dateString), { addSuffix: true, locale: localeId })
  } catch (error) {
    return 'Baru saja'
  }
}
