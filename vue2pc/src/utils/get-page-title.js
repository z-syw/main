import defaultSettings from '@/settings'

const title = defaultSettings.title || '人力资源管理系统'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${title} - ${pageTitle}`
  }
  return `${title}`
}
