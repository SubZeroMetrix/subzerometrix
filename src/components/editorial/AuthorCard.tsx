import Link from 'next/link'

interface AuthorCardProps {
  name: string
  role: string
  bio: string
  profileUrl: string
}

export function AuthorCard({ name, role, bio, profileUrl }: AuthorCardProps) {
  return (
    <div className="card flex items-start gap-4 my-8">
      <div className="w-12 h-12 rounded-full bg-brand-blue flex items-center justify-center text-brand-cyan font-bold text-lg shrink-0">
        {name.charAt(0)}
      </div>
      <div>
        <Link href={profileUrl} className="text-white font-semibold hover:text-brand-cyan transition-colors">
          {name}
        </Link>
        <p className="text-xs text-brand-cyan mt-0.5">{role}</p>
        <p className="text-sm text-gray-400 mt-1">{bio}</p>
      </div>
    </div>
  )
}
