export interface EmailProvider {
  subscribe(email: string, listId: string, metadata?: Record<string, string>): Promise<{ success: boolean; error?: string }>
}

export function getEmailProvider(): EmailProvider | null {
  const provider = process.env.EMAIL_PROVIDER

  if (!provider) return null

  return {
    async subscribe(_email: string, _listId: string, _metadata?: Record<string, string>) {
      return { success: false, error: 'Email provider not yet configured' }
    },
  }
}
