export interface ResearchTemplate {
  type: string
  requiredFields: string[]
  description: string
}

export const researchTemplates: ResearchTemplate[] = [
  {
    type: 'product-test',
    description: 'Hands-on evaluation of a specific product feature or workflow.',
    requiredFields: ['product_name', 'test_objective', 'methodology', 'date_range', 'tester', 'findings', 'limitations', 'conflict_disclosure', 'update_date'],
  },
  {
    type: 'pricing-snapshot',
    description: 'Point-in-time pricing data captured from vendor sources.',
    requiredFields: ['product_name', 'source_url', 'capture_date', 'plans', 'free_tier', 'limitations', 'update_date'],
  },
  {
    type: 'performance-measurement',
    description: 'Measured performance metrics for a product or feature.',
    requiredFields: ['product_name', 'metric_name', 'methodology', 'data_source', 'sample_size', 'date_range', 'results', 'limitations', 'conflict_disclosure', 'update_date'],
  },
  {
    type: 'comparison-methodology',
    description: 'Documented methodology for a product comparison.',
    requiredFields: ['products_compared', 'criteria', 'data_sources', 'scoring_method', 'limitations', 'conflict_disclosure', 'date_range', 'update_date'],
  },
  {
    type: 'case-study',
    description: 'Documented case study of real usage with permission.',
    requiredFields: ['subject', 'context', 'methodology', 'results', 'limitations', 'data_source', 'sample_size', 'conflict_disclosure', 'consent_obtained', 'update_date'],
  },
  {
    type: 'affiliate-performance-report',
    description: 'Aggregated affiliate click and conversion data report.',
    requiredFields: ['date_range', 'data_source', 'metrics', 'methodology', 'limitations', 'conflict_disclosure', 'update_date'],
  },
]
