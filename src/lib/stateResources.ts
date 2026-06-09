// ─────────────────────────────────────────────────────────────────────────────
// Official state government resource links for 6 target states
// All links are official government sources — no affiliate relationships
// ─────────────────────────────────────────────────────────────────────────────

export interface StateResource {
  formationUrl:   string
  licensingUrl:   string
  taxUrl:         string
  insuranceUrl:   string
  sbdcUrl:        string
  formationLabel: string
  licensingLabel: string
}

export const STATE_RESOURCES: Record<string, StateResource> = {
  'Texas': {
    formationUrl:   'https://www.sos.state.tx.us/corp/businessstructure.shtml',
    licensingUrl:   'https://www.tdlr.texas.gov/',
    taxUrl:         'https://comptroller.texas.gov/taxes/sales/',
    insuranceUrl:   'https://www.tdi.texas.gov/',
    sbdcUrl:        'https://www.txsbdc.org/',
    formationLabel: 'TX Secretary of State — Business filing',
    licensingLabel: 'TDLR — Trades licensing (HVAC, electrical, plumbing)',
  },
  'Florida': {
    formationUrl:   'https://dos.fl.gov/sunbiz/start-business/',
    licensingUrl:   'https://www.myfloridalicense.com/intentions2.asp?chBoard=true&boardid=42',
    taxUrl:         'https://floridarevenue.com/taxes/taxesfees/pages/sales_tax.aspx',
    insuranceUrl:   'https://www.myfloridacfo.com/',
    sbdcUrl:        'https://floridasbdc.org/',
    formationLabel: 'FL Division of Corporations (Sunbiz)',
    licensingLabel: 'DBPR — Contractor licensing in FL',
  },
  'Colorado': {
    formationUrl:   'https://www.sos.state.co.us/pubs/business/businessHome.html',
    licensingUrl:   'https://dora.colorado.gov/professions-occupations',
    taxUrl:         'https://tax.colorado.gov/businesses',
    insuranceUrl:   'https://doi.colorado.gov/',
    sbdcUrl:        'https://coloradosbdc.org/',
    formationLabel: 'CO Secretary of State — Business filing',
    licensingLabel: 'DORA — Trades and contractor licensing',
  },
  'Arizona': {
    formationUrl:   'https://azcc.gov/corporations/forms-fees',
    licensingUrl:   'https://roc.az.gov/',
    taxUrl:         'https://azdor.gov/businesses-az/register-your-business',
    insuranceUrl:   'https://insurance.az.gov/',
    sbdcUrl:        'https://azsbdc.net/',
    formationLabel: 'AZ Corporation Commission — Business filing',
    licensingLabel: 'AZ Registrar of Contractors (ROC)',
  },
  'North Carolina': {
    formationUrl:   'https://www.sosnc.gov/online_services/business_registration',
    licensingUrl:   'https://www.nclbgc.org/',
    taxUrl:         'https://www.ncdor.gov/taxes-forms/sales-and-use-tax',
    insuranceUrl:   'https://www.ncdoi.gov/',
    sbdcUrl:        'https://businesslinkNC.com/',
    formationLabel: 'NC Secretary of State — Business registration',
    licensingLabel: 'NC Licensing Board for General Contractors',
  },
  'Ohio': {
    formationUrl:   'https://www.ohiosos.gov/businesses/information-for-businesses/',
    licensingUrl:   'https://com.ohio.gov/divisions-and-programs/industrial-compliance/boards-and-commissions/ohio-construction-industry-licensing-board',
    taxUrl:         'https://tax.ohio.gov/business/ohio-business-taxes/sales-and-use/registration',
    insuranceUrl:   'https://insurance.ohio.gov/',
    sbdcUrl:        'https://www.ohiosbdc.ohio.gov/',
    formationLabel: 'OH Secretary of State — Business filing',
    licensingLabel: 'OH Construction Industry Licensing Board',
  },
}
