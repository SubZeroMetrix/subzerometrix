import Image from 'next/image'
import Link from 'next/link'

export function FounderSection() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">
      <div className="shrink-0">
        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-brand-electric to-brand-cyan p-[2px]">
          <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
            <Image
              src="/brand/subzero-metrix-logo.png"
              alt="SubZero Metrix"
              width={64}
              height={64}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>

      <div className="text-center md:text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-electric mb-2">
          Founder &amp; Editor-in-Chief
        </p>
        <h3 className="text-2xl font-bold text-gray-900 mb-3">Richard Fritzke</h3>
        <p className="text-gray-600 leading-relaxed mb-4">
          24+ years of experience in HVAC/R, facilities engineering, and operations
          leadership. Led field-service teams of 20+ technicians and supported 40+
          commercial locations. Founder of The Modern Trades Mentor and creator of
          Metrix Score&trade;. Now applying applied-AI methods and operational
          discipline to independent software intelligence at SubZero Metrix.
        </p>
        <p className="text-xs text-gray-400 mb-4 italic">
          Content and views expressed are educational and informational. They do not
          represent an endorsement or official position of any government agency,
          Department of Defense organization, customer, or employer.
        </p>
        <Link
          href="/about/richard-fritzke"
          className="text-sm font-semibold text-brand-electric hover:text-blue-700 transition-colors"
        >
          Full profile &rarr;
        </Link>
      </div>
    </div>
  )
}
