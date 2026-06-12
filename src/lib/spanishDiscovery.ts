// ─────────────────────────────────────────────────────────────────────────────
// spanishDiscovery — Spanish public discovery copy, source of truth (Spanish-1)
// ─────────────────────────────────────────────────────────────────────────────
// Neutral U.S. Spanish copy for the public Spanish discovery pages ONLY. This is
// NOT a full platform translation: the assessment engine, paid report, dashboard,
// checkout, scoring, and legal system are not translated here.
//
// Brand names are NEVER translated: SubZeroMetrix™, MetrixScore™, and
// The Modern Trades Mentor LLC stay as-is.
//
// Educational only — no legal, tax, financial, or licensing advice, and no claim
// that the full platform is available in Spanish.
// ─────────────────────────────────────────────────────────────────────────────

export interface SpanishDiscoveryLink {
  label: string
  href: string
}

export interface SpanishDiscoveryFaq {
  question: string
  answer: string
}

export interface SpanishDiscoveryPage {
  slug: string
  title: string
  metaDescription: string
  heading: string
  intro: string
}

export interface SpanishStarterItem {
  label: string
  detail: string
}

export interface SpanishStarterSection {
  id: string
  title: string
  intro: string
  items: SpanishStarterItem[]
}

export interface SpanishRouting {
  audience: string
  recommendedPath: string
  cta: string
  note: string
}

export interface SpanishBusinessStarterCopy {
  scopeNote: string
  disclaimer: string
  sections: SpanishStarterSection[]
  routing: SpanishRouting[]
}

export interface SpanishContractorReadinessCopy {
  scopeNote: string
  disclaimer: string
  faqs: SpanishDiscoveryFaq[]
}

const SCOPE_NOTE_ES =
  'SubZeroMetrix™ funciona mejor actualmente para contratistas, personas de oficios y dueños de negocios de servicios. Estas páginas en español son educativas y pueden estar menos adaptadas a cada industria.'

const DISCLAIMER_ES =
  'Solo con fines educativos. No es asesoría legal, fiscal, financiera ni de licencias. Usa fuentes oficiales estatales, locales y profesionales para confirmar los requisitos de tu negocio y tu ubicación.'

const NOT_FULLY_TRANSLATED_ES =
  'Por ahora, el resto de la plataforma (la evaluación completa, el reporte y el panel) está principalmente en inglés.'

// ── Locale + growth-strategy readiness (discovery layer only) ─────────────────
// Constants/fields that let later phases segment Spanish-language traffic and add
// Spanish sharing/review/partner assets without reworking this layer.
export const SPANISH_LOCALE = 'es-US'
export const SPANISH_OG_LOCALE = 'es_US'

// Suggested future Spanish routes — planned, NOT built in Spanish-1.
export const FUTURE_SPANISH_ROUTES: string[] = [
  '/es/lista-para-iniciar-un-negocio',
  '/es/contratistas',
  '/es/negocios-de-servicios',
]

// Future analytics field names for Spanish-language segmentation (not wired yet).
export const FUTURE_SPANISH_ANALYTICS_FIELDS: string[] = [
  'language',            // 'es'
  'locale',              // 'es-US'
  'spanish_page_viewed',
  'spanish_starter_viewed',
  'spanish_readiness_viewed',
  'routed_to_assessment_from_spanish',
  'spanish_share_created',          // future product-led sharing
  'spanish_review_prompt_answered', // future customer proof
  'spanish_partner_lead',           // future partner / community outreach
]

export type SpanishGrowthSupport = 'built' | 'foundation_ready' | 'future'

export interface SpanishGrowthCoverageItem {
  growthArea: string
  spanishSupport: SpanishGrowthSupport
  note: string
}

// Honest map of how the public Spanish discovery layer supports the Growth Engine.
export function getSpanishGrowthCoverage(): SpanishGrowthCoverageItem[] {
  return [
    { growthArea: 'Organic Discovery Foundation', spanishSupport: 'built', note: 'Spanish pages in the sitemap with metadata + canonical URLs.' },
    { growthArea: 'AI Answer Engine Discovery', spanishSupport: 'built', note: 'Spanish FAQ structured data and a factual Spanish-pages mention in llms.txt.' },
    { growthArea: 'Broad how-to-start-a-business intent', spanishSupport: 'built', note: 'Spanish general business starter page that routes into the assessment.' },
    { growthArea: 'Contractor/trade/service startup intent', spanishSupport: 'built', note: 'Honest routing toward the assessment for supported audiences.' },
    { growthArea: 'Product-led sharing / referral', spanishSupport: 'future', note: 'Spanish share/referral copy planned in a later phase.' },
    { growthArea: 'Customer proof / review', spanishSupport: 'future', note: 'Spanish review/testimonial prompts planned in a later phase.' },
    { growthArea: 'Partner / community outreach', spanishSupport: 'future', note: 'Spanish partner/community pages planned in a later phase.' },
    { growthArea: 'Analytics segmentation', spanishSupport: 'foundation_ready', note: `locale ${SPANISH_LOCALE} and future Spanish analytics fields are defined.` },
  ]
}

export function getSpanishScopeNote(): string {
  return SCOPE_NOTE_ES
}

export function getSpanishDisclaimerNote(): string {
  return DISCLAIMER_ES
}

export function getSpanishNotFullyTranslatedNote(): string {
  return NOT_FULLY_TRANSLATED_ES
}

export function getSpanishDiscoveryPages(): SpanishDiscoveryPage[] {
  return [
    {
      slug: '/es',
      title: 'SubZeroMetrix™ en Español',
      metaDescription:
        'SubZeroMetrix™ ayuda a contratistas, personas de oficios y dueños de negocios de servicios a evaluar la preparación de su negocio y ver sus próximos pasos. Solo con fines educativos.',
      heading: 'SubZeroMetrix™ en Español',
      intro:
        'Una evaluación gratuita de preparación empresarial para contratistas, personas de oficios y dueños de negocios de servicios.',
    },
    {
      slug: '/es/como-empezar-un-negocio',
      title: 'Cómo empezar un negocio',
      metaDescription:
        'Guía educativa para empezar un negocio: configuración, finanzas, precios, clientes, operaciones y un plan de 30 días. SubZeroMetrix™ es más fuerte para contratistas, oficios y negocios de servicios.',
      heading: 'Cómo empezar un negocio',
      intro:
        'Un marco educativo y gratuito para quien investiga cómo empezar un negocio. Úsalo para entender lo básico y luego profundiza donde te sirva.',
    },
    {
      slug: '/es/preparacion-empresarial',
      title: 'Preparación empresarial',
      metaDescription:
        'Qué significa la preparación empresarial para contratistas y negocios de servicios, y cómo un Starter MetrixScore™ gratuito te ayuda a ver tus brechas. Solo educativo.',
      heading: 'Preparación empresarial',
      intro:
        'Qué es la preparación empresarial, qué es el Starter MetrixScore™ y cómo SubZeroMetrix™ te ayuda a ver tus próximos pasos.',
    },
  ]
}

export function getSpanishBusinessStarterCopy(): SpanishBusinessStarterCopy {
  return {
    scopeNote: SCOPE_NOTE_ES,
    disclaimer: DISCLAIMER_ES,
    sections: [
      {
        id: 'configuracion',
        title: 'Conceptos básicos para crear tu negocio',
        intro: 'La estructura y las cuentas que hacen que tu negocio sea real y esté separado de ti.',
        items: [
          { label: 'Elige un nombre y una estructura', detail: 'Escoge un nombre que puedas usar y una estructura (como una LLC) que se ajuste a tu situación. Confirma los detalles con fuentes oficiales.' },
          { label: 'Registra el negocio y obtén un EIN', detail: 'Regístrate en tu estado y obtén un EIN federal para abrir cuentas, contratar y declarar impuestos como negocio.' },
          { label: 'Abre una cuenta bancaria de negocio aparte', detail: 'Mantén el dinero del negocio separado del personal desde el primer día.' },
        ],
      },
      {
        id: 'legal',
        title: 'Requisitos legales, fiscales y de licencias',
        intro: 'Los requisitos varían según el lugar y la industria. Confirma los tuyos con fuentes oficiales; esto no es asesoría.',
        items: [
          { label: 'Confirma los requisitos con fuentes oficiales', detail: 'Usa agencias estatales y locales oficiales para confirmar licencias, registro, impuestos, seguros y permisos según tu negocio y tu ubicación.' },
          { label: 'Busca ayuda profesional cuando importe', detail: 'Un abogado, contador o agente de seguros calificado puede confirmar lo que aplica a tu caso.' },
        ],
      },
      {
        id: 'finanzas',
        title: 'Preparación financiera',
        intro: 'Conoce tus números antes de que empiece a moverse el dinero.',
        items: [
          { label: 'Calcula los costos iniciales y mensuales', detail: 'Haz una lista de lo que cuesta empezar y de lo que cuesta operar cada mes.' },
          { label: 'Aparta dinero para impuestos', detail: 'Guarda un porcentaje fijo de tus ingresos para que los impuestos no te tomen por sorpresa.' },
          { label: 'Lleva una contabilidad sencilla', detail: 'Registra ingresos y gastos desde el inicio para ver tu ganancia real.' },
        ],
      },
      {
        id: 'precios',
        title: 'Precios e ingresos',
        intro: 'Pon precios que cubran los costos reales y una ganancia real, no solo para igualar a la competencia.',
        items: [
          { label: 'Conoce tu costo real', detail: 'Incluye mano de obra, materiales, gastos generales y tu propio tiempo antes de poner un precio.' },
          { label: 'Incluye un margen de ganancia', detail: 'Define el margen que cada venta debe dejar y respétalo.' },
        ],
      },
      {
        id: 'clientes',
        title: 'Conseguir clientes',
        intro: 'Una forma repetible de encontrar y ganar clientes le gana a la suerte.',
        items: [
          { label: 'Elige uno o dos canales de clientes', detail: 'Concéntrate donde tus clientes realmente buscan, por ejemplo listados en línea o referencias.' },
          { label: 'Da seguimiento de forma constante', detail: 'La mayoría de las ventas ocurren después del primer contacto; mantén un hábito de seguimiento.' },
          { label: 'Pide referencias y reseñas', detail: 'Los clientes satisfechos son tu fuente más económica y confiable de nuevos trabajos.' },
        ],
      },
      {
        id: 'operaciones',
        title: 'Operaciones y sistemas',
        intro: 'Sistemas sencillos mantienen la calidad y el flujo de efectivo estables a medida que creces.',
        items: [
          { label: 'Usa un solo sistema de agenda y trabajos', detail: 'Un solo lugar para citas, trabajos e información de clientes evita perder trabajo.' },
          { label: 'Factura y cobra a tiempo', detail: 'Envía facturas rápido y facilita el pago.' },
        ],
      },
      {
        id: 'plan_30_dias',
        title: 'Plan de acción de 30 días',
        intro: 'Un primer mes sencillo para convertir la investigación en acción.',
        items: [
          { label: 'Semana 1 — Base', detail: 'Define tu nombre y estructura, y confirma los requisitos de registro y licencias con fuentes oficiales.' },
          { label: 'Semana 2 — Dinero', detail: 'Abre una cuenta de negocio, lleva una contabilidad sencilla y calcula tus costos iniciales y mensuales.' },
          { label: 'Semana 3 — Oferta y precios', detail: 'Define qué vendes, calcula tu costo real y pon precios con un margen real.' },
          { label: 'Semana 4 — Clientes y sistemas', detail: 'Elige un canal de clientes, crea un hábito de seguimiento y pon un sistema de agenda y facturación.' },
        ],
      },
    ],
    routing: [
      { audience: 'Contratistas y personas de oficios', recommendedPath: '/start', cta: 'Comenzar evaluación', note: 'La evaluación y la hoja de ruta están hechas para tu oficio.' },
      { audience: 'Dueños de negocios de servicios', recommendedPath: '/start', cta: 'Comenzar evaluación', note: 'Los negocios de servicios son un enfoque central de la plataforma.' },
      { audience: 'Otras industrias', recommendedPath: '/start', cta: 'Usar el marco general de preparación', note: 'SubZeroMetrix™ funciona mejor actualmente para contratistas, oficios y negocios de servicios; algunas recomendaciones pueden ser menos adaptadas a cada industria.' },
    ],
  }
}

export function getSpanishContractorReadinessCopy(): SpanishContractorReadinessCopy {
  return {
    scopeNote: SCOPE_NOTE_ES,
    disclaimer: DISCLAIMER_ES,
    faqs: [
      {
        question: '¿Qué es la preparación empresarial?',
        answer:
          'Es qué tan listo está un negocio en las áreas que determinan si sobrevive y crece: base legal y de configuración, finanzas y precios, ventas y marketing, operaciones, experiencia del cliente, personal, y crecimiento y riesgo. No se trata de qué tan bueno eres en el trabajo, sino del negocio detrás del trabajo.',
      },
      {
        question: '¿Qué es la preparación de un negocio de contratista o de servicios?',
        answer:
          'Aplica la misma idea a un oficio o negocio de servicios: ¿están en orden tu entidad, licencias, seguro, banca, precios, generación de clientes y flujo de trabajo para operar con rentabilidad y manejar el crecimiento? Es la diferencia entre estar ocupado y ser una empresa estable y rentable.',
      },
      {
        question: '¿Qué es el Starter MetrixScore™?',
        answer:
          'Es un puntaje gratuito de preparación empresarial (de 0 a 100) que se genera con una evaluación corta. Es un punto de partida que se vuelve más preciso a medida que completas más de tu perfil. No es un puntaje final, comparado ni predictivo.',
      },
      {
        question: '¿Qué debo revisar antes de empezar un negocio de contratista o de servicios?',
        answer:
          'Áreas comunes: entidad y registro del negocio, licencias y seguros requeridos, una cuenta bancaria de negocio aparte, precios reales que cubran costos y ganancia, una forma de conseguir y dar seguimiento a clientes, y un flujo básico de trabajo. Confirma siempre los requisitos de licencias, registro, seguros, impuestos y permisos con fuentes oficiales estatales y locales.',
      },
      {
        question: '¿Cómo ayuda SubZeroMetrix™?',
        answer:
          'Ayuda a contratistas, personas de oficios y dueños de negocios de servicios a evaluar su preparación, ver sus fortalezas y áreas de riesgo, seguir una hoja de ruta práctica, registrar acciones y sus propios indicadores, y volver a evaluar con el tiempo.',
      },
      {
        question: '¿Qué no hace SubZeroMetrix™?',
        answer:
          'Es solo educativo. No ofrece asesoría legal, fiscal, financiera, de licencias ni de cumplimiento, y no garantiza éxito, posiciones de búsqueda, clientes ni ningún resultado en particular. Para industrias amplias fuera de los oficios ofrece un marco general de preparación, pero las recomendaciones pueden ser menos adaptadas a cada industria.',
      },
    ],
  }
}
