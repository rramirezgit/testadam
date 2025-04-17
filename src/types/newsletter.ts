export interface NewsletterHeader {
  title: string
  subtitle?: string
  logo?: string
  bannerImage?: string
  backgroundColor: string
  textColor: string
  alignment: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface NewsletterFooter {
  companyName: string
  address?: string
  contactEmail?: string
  socialLinks?: SocialLink[]
  unsubscribeLink?: string
  backgroundColor: string
  textColor: string
}

export interface NewsletterNote {
  noteId: string
  order: number
  noteData: any // SavedNote
}

export interface Newsletter {
  id: string
  title: string
  description?: string
  notes: NewsletterNote[]
  dateCreated: string
  dateModified: string
  header?: NewsletterHeader
  footer?: NewsletterFooter
  content?: any
  design?: any
  generatedHtml?: string
}
