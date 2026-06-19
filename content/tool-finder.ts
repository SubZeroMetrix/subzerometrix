export interface ToolFinderQuestionDef {
  key: string
  question: string
  options: { label: string; value: string }[]
}

export const toolFinderQuestions: ToolFinderQuestionDef[] = [
  {
    key: 'goal',
    question: 'What are you trying to build?',
    options: [
      { label: 'An online business from scratch', value: 'start-business' },
      { label: 'A website or blog', value: 'website' },
      { label: 'An email list or newsletter', value: 'email-newsletter' },
      { label: 'An online store', value: 'ecommerce' },
      { label: 'A B2B outreach system', value: 'outreach' },
    ],
  },
  {
    key: 'stage',
    question: 'What stage are you in?',
    options: [
      { label: 'Just starting — no audience yet', value: 'starting' },
      { label: 'Early stage — small audience, exploring tools', value: 'early' },
      { label: 'Growing — ready to invest in better tools', value: 'growing' },
      { label: 'Established — optimizing and scaling', value: 'established' },
    ],
  },
  {
    key: 'priority',
    question: 'What do you need first?',
    options: [
      { label: 'A website or landing page', value: 'website' },
      { label: 'Email marketing and list building', value: 'email' },
      { label: 'Selling products or services', value: 'selling' },
      { label: 'Marketing automation', value: 'automation' },
      { label: 'SEO and content strategy', value: 'seo' },
      { label: 'Cold outreach and lead generation', value: 'outreach' },
    ],
  },
  {
    key: 'budget',
    question: 'What is your monthly software budget?',
    options: [
      { label: 'Free only', value: 'free' },
      { label: 'Under $30/month', value: 'low' },
      { label: '$30–$100/month', value: 'mid' },
      { label: 'Over $100/month', value: 'high' },
    ],
  },
  {
    key: 'technical',
    question: 'How technical are you?',
    options: [
      { label: 'Not technical — I need simple tools', value: 'beginner' },
      { label: 'Somewhat technical — comfortable learning', value: 'intermediate' },
      { label: 'Very technical — I can handle complex setups', value: 'advanced' },
    ],
  },
]

export interface ToolFinderResult {
  primarySlug: string
  secondarySlug: string | null
  reasoning: string
  caveat: string
  bestUseCase: string
  complexity: string
  pricingNote: string
}

export function computeRecommendation(answers: Record<string, string>): ToolFinderResult {
  const { goal, stage, priority, budget, technical } = answers

  if (goal === 'start-business' && (budget === 'free' || budget === 'low')) {
    return {
      primarySlug: 'systeme-io',
      secondarySlug: 'mailerlite',
      reasoning: 'Systeme.io offers an all-in-one free plan that covers funnels, email, and selling — ideal for starting without juggling multiple tools.',
      caveat: 'Design customization is limited compared to specialist tools. You may outgrow it as your needs become more complex.',
      bestUseCase: 'Starting an online business on a tight budget',
      complexity: 'Low — most features work out of the box',
      pricingNote: 'Free plan available with generous limits.',
    }
  }

  if (priority === 'email' && budget === 'free') {
    return {
      primarySlug: 'mailerlite',
      secondarySlug: 'kit',
      reasoning: 'MailerLite has one of the best free email marketing plans with automation, landing pages, and a clean interface.',
      caveat: 'Free plan limits you to 1,000 subscribers. Advanced segmentation requires a paid plan.',
      bestUseCase: 'Building an email list from scratch',
      complexity: 'Low — designed for beginners',
      pricingNote: 'Free up to 1,000 subscribers.',
    }
  }

  if (goal === 'email-newsletter' || priority === 'email') {
    if (stage === 'established' || technical === 'advanced') {
      return {
        primarySlug: 'activecampaign',
        secondarySlug: 'getresponse',
        reasoning: 'ActiveCampaign provides the deepest automation and CRM features for growing businesses with established audiences.',
        caveat: 'Steeper learning curve and higher price point. Overkill if you are just starting out.',
        bestUseCase: 'Advanced email automation with CRM for established businesses',
        complexity: 'High — powerful but complex',
        pricingNote: 'Starts at $29/month. No free plan.',
      }
    }

    if (goal === 'email-newsletter') {
      return {
        primarySlug: 'beehiiv',
        secondarySlug: 'kit',
        reasoning: 'beehiiv is purpose-built for newsletters with growth tools, referral programs, and built-in ad monetization.',
        caveat: 'Focused on newsletters — not suitable if you need full marketing automation or e-commerce.',
        bestUseCase: 'Publishing and monetizing a newsletter',
        complexity: 'Low — streamlined for newsletter operators',
        pricingNote: 'Free plan available. Paid plans start at $49/month.',
      }
    }

    return {
      primarySlug: 'mailerlite',
      secondarySlug: 'getresponse',
      reasoning: 'MailerLite balances ease of use with solid automation features, making it a strong starting point for email marketing.',
      caveat: 'For advanced automation or webinar needs, GetResponse may be a better fit.',
      bestUseCase: 'Email marketing with automation for small businesses',
      complexity: 'Low to moderate',
      pricingNote: 'Free up to 1,000 subscribers. Paid from $10/month.',
    }
  }

  if (goal === 'ecommerce' || priority === 'selling') {
    return {
      primarySlug: 'shopify',
      secondarySlug: 'systeme-io',
      reasoning: 'Shopify is the industry standard for e-commerce with built-in payments, inventory management, and multichannel selling.',
      caveat: 'Monthly costs can add up with apps. If selling digital products only, Systeme.io may be simpler and cheaper.',
      bestUseCase: 'Selling physical or digital products through a dedicated store',
      complexity: 'Moderate — setup is guided but customization takes time',
      pricingNote: 'Starts at $39/month. 3-day free trial.',
    }
  }

  if (priority === 'seo') {
    return {
      primarySlug: 'semrush',
      secondarySlug: null,
      reasoning: 'Semrush is the most comprehensive SEO toolkit for keyword research, competitor analysis, and site auditing.',
      caveat: 'Premium pricing may not be justified for beginners. Free alternatives exist for basic keyword research.',
      bestUseCase: 'Serious SEO strategy for growing organic traffic',
      complexity: 'High — extensive feature set requires learning',
      pricingNote: 'Starts at $139.95/month. 7-day free trial.',
    }
  }

  if (goal === 'outreach' || priority === 'outreach') {
    return {
      primarySlug: 'instantly',
      secondarySlug: null,
      reasoning: 'Instantly is built specifically for B2B cold email outreach with unlimited email accounts and built-in warmup.',
      caveat: 'Only useful for cold outreach. Not suitable for newsletters, marketing automation, or e-commerce.',
      bestUseCase: 'B2B cold email prospecting and lead generation',
      complexity: 'Moderate — requires domain setup and warmup strategy',
      pricingNote: 'Starts at $37/month.',
    }
  }

  if (goal === 'website') {
    if (budget === 'high' || stage === 'established') {
      return {
        primarySlug: 'kinsta',
        secondarySlug: 'shopify',
        reasoning: 'Kinsta provides premium managed WordPress hosting with Google Cloud infrastructure and expert support.',
        caveat: 'Higher price point than shared hosting. Only for WordPress sites.',
        bestUseCase: 'High-performance WordPress website',
        complexity: 'Moderate — WordPress knowledge helpful',
        pricingNote: 'Starts at $35/month.',
      }
    }

    return {
      primarySlug: 'systeme-io',
      secondarySlug: 'mailerlite',
      reasoning: 'Systeme.io includes a website and funnel builder in its free plan, ideal for getting started without a separate hosting provider.',
      caveat: 'Limited design flexibility compared to WordPress or dedicated website builders.',
      bestUseCase: 'Simple website with built-in marketing tools',
      complexity: 'Low — no coding required',
      pricingNote: 'Free plan available.',
    }
  }

  return {
    primarySlug: 'systeme-io',
    secondarySlug: 'mailerlite',
    reasoning: 'Systeme.io is a strong default for entrepreneurs exploring their first online tools — it covers funnels, email, and selling in one platform.',
    caveat: 'May not be the best fit for specialized needs. Consider specialist tools as your requirements become clearer.',
    bestUseCase: 'Getting started with online business tools',
    complexity: 'Low — beginner-friendly all-in-one platform',
    pricingNote: 'Free plan available.',
  }
}
