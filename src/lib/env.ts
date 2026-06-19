function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export const env = {
  get NEXT_PUBLIC_SITE_URL() {
    return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  },
  get NEXT_PUBLIC_SUPABASE_URL() {
    return requireEnv('NEXT_PUBLIC_SUPABASE_URL')
  },
  get NEXT_PUBLIC_SUPABASE_ANON_KEY() {
    return requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return requireEnv('SUPABASE_SERVICE_ROLE_KEY')
  },
  get STRIPE_SECRET_KEY() {
    return requireEnv('STRIPE_SECRET_KEY')
  },
  get STRIPE_WEBHOOK_SECRET() {
    return requireEnv('STRIPE_WEBHOOK_SECRET')
  },
}
