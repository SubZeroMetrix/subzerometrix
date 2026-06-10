export type FinancialStage = 'startup' | 'growing' | 'scaling'

export interface FinancialPathStage {
  stage: FinancialStage
  stageLabel: string
  steps: string[]
}

export interface FinancialPath {
  id: string
  title: string
  shortTitle: string
  icon: string
  phaseRelevance: string[]
  whyItMatters: string
  firstAction: string
  stages: FinancialPathStage[]
  whatToMeasure: string[]
  whatToAvoid: string[]
  vendorCategoryIds: string[]
  upgradePreview: string
}

export const FINANCIAL_PATHS: FinancialPath[] = [
  {
    id: "business-banking",
    title: "Business Banking",
    shortTitle: "Banking",
    icon: "🏦",
    phaseRelevance: ["foundation-setup", "banking-finance"],
    whyItMatters: "Separate banking keeps business money clean and improves lending readiness.",
    firstAction: "Open a dedicated business checking account and move all business income there.",
    stages: [
      { stage: "startup", stageLabel: "Startup", steps: ["Open business checking.", "Open tax reserve savings.", "Stop mixing personal and business money."] },
      { stage: "growing", stageLabel: "Growing", steps: ["Separate operating, tax, and payroll accounts.", "Review cash weekly.", "Protect two to four weeks of overhead."] },
      { stage: "scaling", stageLabel: "Scaling", steps: ["Use separate operating, payroll, tax, and reserve accounts.", "Keep 30 to 60 days of overhead in reserve.", "Review reconciliations monthly."] },
    ],
    whatToMeasure: ["Cash balance.", "Tax reserve percentage.", "Days Sales Outstanding."],
    whatToAvoid: ["Mixing personal and business money.", "Skipping tax reserve transfers.", "Waiting until a cash emergency to talk to a bank."],
    vendorCategoryIds: ["banking"],
    upgradePreview: "Banking checklist, account structure guide, tax reserve worksheet, and weekly cash review template.",
  },
  {
    id: "bookkeeping-accounting",
    title: "Bookkeeping and Accounting",
    shortTitle: "Bookkeeping",
    icon: "📊",
    phaseRelevance: ["banking-finance", "pricing-profit-margin"],
    whyItMatters: "Busy contractors can still lose money if they do not track job cost, margin, overhead, and profit.",
    firstAction: "Connect your business bank account to accounting software and categorize this month of transactions.",
    stages: [
      { stage: "startup", stageLabel: "Startup", steps: ["Use QuickBooks, Xero, Wave, or similar accounting software.", "Categorize income, materials, labor, truck, insurance, and overhead.", "Reconcile accounts monthly."] },
      { stage: "growing", stageLabel: "Growing", steps: ["Track estimated versus actual cost per job.", "Separate material, labor, subcontractor, and overhead costs.", "Review a profit and loss statement every month."] },
      { stage: "scaling", stageLabel: "Scaling", steps: ["Use accrual accounting when the company becomes more complex.", "Track service, install, maintenance, residential, and commercial performance separately.", "Hold a monthly financial review with the owner and bookkeeper or controller."] },
    ],
    whatToMeasure: ["Gross margin by job type.", "Overhead as a percentage of revenue.", "Average days to invoice.", "Net profit after owner pay."],
    whatToAvoid: ["Waiting until tax season to clean up books.", "Combining labor and materials into one cost bucket.", "Ignoring job profitability.", "Doing owner bookkeeping too long after the company grows."],
    vendorCategoryIds: ["accounting"],
    upgradePreview: "Contractor chart of accounts, job costing worksheet, monthly profit and loss review guide, and CPA interview checklist.",
  },
  {
    id: "business-insurance",
    title: "Business Insurance",
    shortTitle: "Insurance",
    icon: "🛡️",
    phaseRelevance: ["foundation-setup", "scaling-hiring-leadership"],
    whyItMatters: "Insurance protects the company, the owner, employees, vehicles, tools, and job-site risk before one claim damages the business.",
    firstAction: "Get general liability coverage first, then confirm commercial auto, tools coverage, and workers compensation needs.",
    stages: [
      { stage: "startup", stageLabel: "Startup", steps: ["Get general liability coverage.", "Confirm commercial auto requirements.", "Protect tools and equipment.", "Keep certificates of insurance ready."] },
      { stage: "growing", stageLabel: "Growing", steps: ["Add workers compensation before hiring.", "Increase auto and liability limits as job size grows.", "Review certificates for commercial work.", "Review coverage every year."] },
      { stage: "scaling", stageLabel: "Scaling", steps: ["Review umbrella coverage.", "Create a safety program.", "Track claims and incidents.", "Have an agent review commercial contract requirements."] },
    ],
    whatToMeasure: ["Coverage status by policy.", "Annual insurance cost as percentage of revenue.", "Workers compensation claims.", "Certificate requests and contract requirements."],
    whatToAvoid: ["Using personal auto for business risk.", "Hiring without workers compensation guidance.", "Taking commercial work without reviewing insurance requirements.", "Underinsuring tools and equipment."],
    vendorCategoryIds: ["insurance"],
    upgradePreview: "Insurance checklist, certificate of insurance guide, workers compensation readiness checklist, and commercial contract coverage review.",
  },
  {
    id: "business-credit",
    title: "Business Credit and Expense Control",
    shortTitle: "Business Credit",
    icon: "💳",
    phaseRelevance: ["foundation-setup", "banking-finance"],
    whyItMatters: "Business credit separates company spending, builds credit history, improves expense tracking, and creates cleaner records for bookkeeping.",
    firstAction: "Use one business-only credit card for business expenses and pay it in full every month.",
    stages: [
      { stage: "startup", stageLabel: "Startup", steps: ["Use one business-only credit card.", "Pay the full balance every month.", "Connect the card to accounting software.", "Keep receipts for every purchase."] },
      { stage: "growing", stageLabel: "Growing", steps: ["Issue employee cards with limits.", "Require receipt capture.", "Tag expenses by job or category.", "Review card spending monthly."] },
      { stage: "scaling", stageLabel: "Scaling", steps: ["Use card controls and approval rules.", "Set role-based spending limits.", "Audit subscriptions and recurring charges.", "Review spend trends with bookkeeping reports."] },
    ],
    whatToMeasure: ["Monthly card spend by category.", "Card balance paid in full.", "Missing receipt count.", "Employee card exceptions."],
    whatToAvoid: ["Using credit cards to cover bad pricing.", "Carrying high-interest balances.", "Mixing personal and business purchases.", "Giving employee cards without limits."],
    vendorCategoryIds: ["banking"],
    upgradePreview: "Business credit card comparison, employee card policy, receipt workflow, spend review checklist, and business credit readiness guide.",
  },
  {
    id: "business-lending",
    title: "Business Lending and Working Capital",
    shortTitle: "Business Lending",
    icon: "🏛️",
    phaseRelevance: ["banking-finance", "pricing-profit-margin", "scaling-hiring-leadership"],
    whyItMatters: "Debt can help a profitable contractor grow, but it can also hide poor pricing, slow collections, and weak cash flow.",
    firstAction: "Fix pricing, deposits, collections, and gross margin before borrowing money.",
    stages: [
      { stage: "startup", stageLabel: "Startup", steps: ["Build clean books and business banking history.", "Pay business credit on time.", "Avoid high-cost cash advances.", "Track cash flow before borrowing."] },
      { stage: "growing", stageLabel: "Growing", steps: ["Apply for a line of credit before an emergency.", "Use equipment financing only when ROI is clear.", "Improve collections before using debt.", "Know your monthly debt payments."] },
      { stage: "scaling", stageLabel: "Scaling", steps: ["Build a relationship with a commercial banker.", "Prepare financial statements before applying.", "Plan working capital needs by season.", "Review debt service coverage before expanding."] },
    ],
    whatToMeasure: ["Gross margin before borrowing.", "Days Sales Outstanding.", "Monthly debt service.", "Cash reserve after loan payments."],
    whatToAvoid: ["Borrowing to cover unprofitable work.", "Using merchant cash advances without understanding cost.", "Taking debt before fixing collections.", "Personally guaranteeing debt without knowing the risk."],
    vendorCategoryIds: ["lending"],
    upgradePreview: "Lending readiness checklist, working capital planner, debt service calculator, MCA red flag guide, and bank application checklist.",
  },
  {
    id: "homeowner-financing",
    title: "Homeowner Financing",
    shortTitle: "Customer Financing",
    icon: "🏠",
    phaseRelevance: ["pricing-profit-margin", "sales-process-call-handling"],
    whyItMatters: "Financing helps homeowners approve larger repairs, replacements, and upgrades without forcing the contractor to discount the job.",
    firstAction: "Choose one financing provider and train the team to introduce monthly payment options before the price shock happens.",
    stages: [
      { stage: "startup", stageLabel: "Startup", steps: ["Apply with one homeowner financing provider.", "Offer financing on larger repairs and replacements.", "Use monthly payment language.", "Understand dealer fees before quoting."] },
      { stage: "growing", stageLabel: "Growing", steps: ["Train every tech and estimator to mention financing early.", "Show financing options inside good-better-best proposals.", "Track offer rate and approval rate.", "Build dealer fees into pricing."] },
      { stage: "scaling", stageLabel: "Scaling", steps: ["Use financing as a standard sales process.", "Track financed close rate by technician.", "Compare providers by approval rate and cost.", "Review financing performance monthly."] },
    ],
    whatToMeasure: ["Financing offer rate.", "Approval rate.", "Financed close rate.", "Average ticket on financed jobs."],
    whatToAvoid: ["Offering financing only after price hesitation.", "Ignoring dealer fees.", "Using financing to hide bad pricing.", "Failing to train field staff on the conversation."],
    vendorCategoryIds: ["financing"],
    upgradePreview: "Financing sales script, monthly payment cheat sheet, dealer fee calculator, provider comparison, and financed close rate tracker.",
  },
  {
    id: "payroll-hr",
    title: "Payroll and HR Basics",
    shortTitle: "Payroll / HR",
    icon: "👥",
    phaseRelevance: ["banking-finance", "scaling-hiring-leadership"],
    whyItMatters: "Payroll mistakes, worker misclassification, weak onboarding, and missing HR basics can create legal, tax, and team problems as the company grows.",
    firstAction: "Set up payroll correctly before hiring and confirm whether each worker should be W-2 or 1099.",
    stages: [
      { stage: "startup", stageLabel: "Startup", steps: ["Understand W-2 vs 1099 rules.", "Get an EIN before payroll.", "Use payroll software before the first hire.", "Confirm workers compensation requirements."] },
      { stage: "growing", stageLabel: "Growing", steps: ["Use a payroll system instead of manual payroll.", "Add time tracking.", "Create a basic onboarding checklist.", "Document pay, role, schedule, and expectations."] },
      { stage: "scaling", stageLabel: "Scaling", steps: ["Create an employee handbook.", "Document performance reviews.", "Track labor burden and turnover.", "Add benefits and HR support as headcount grows."] },
    ],
    whatToMeasure: ["Labor cost as percentage of revenue.", "Labor burden per billable hour.", "Payroll accuracy.", "Employee turnover."],
    whatToAvoid: ["Misclassifying employees as 1099.", "Running payroll manually too long.", "Hiring without workers compensation guidance.", "Skipping written onboarding and performance documentation."],
    vendorCategoryIds: ["payroll"],
    upgradePreview: "W-2 vs 1099 checklist, new hire onboarding checklist, employee handbook template, payroll setup guide, and labor burden calculator.",
  },
]

export function getFinancialPathById(id: string): FinancialPath | undefined {
  return FINANCIAL_PATHS.find(p => p.id === id)
}

export function getFinancialPathsForPhase(phaseId: string): FinancialPath[] {
  return FINANCIAL_PATHS.filter(p => p.phaseRelevance.includes(phaseId))
}
