const SAMPLE_JOBS = [
  { job_number: 'J001', borough: 'MANHATTAN', job_type: 'NB', job_status_desc: 'In Progress' },
  { job_number: 'J002', borough: 'BROOKLYN', job_type: 'A1', job_status_desc: 'Completed' },
  { job_number: 'J003', borough: 'QUEENS',   job_type: 'DM', job_status_desc: 'Pending' },
]

describe('Jobs', () => {
  beforeEach(() => {
    cy.stubJobs(SAMPLE_JOBS)
    cy.visit('/')
    cy.navigateToJobs()
  })

  it('shows the Refresh Jobs button', () => {
    cy.contains('button', 'Refresh Jobs').should('be.visible')
  })

  it('shows the Add New Job button linking to /dashboard/jobs/add', () => {
    cy.contains('a', 'Add New Job')
      .should('be.visible')
      .and('have.attr', 'href', '/dashboard/jobs/add')
  })

  it('shows the job search input and Search button', () => {
    cy.get('input[placeholder*="Search jobs"]').should('be.visible')
    cy.contains('button', 'Search').should('be.visible')
  })

  it('loads jobs from the API on mount', () => {
    cy.wait('@getJobs')
    cy.wait('@getMeta')
  })

  it('navigates to Add New Job page', () => {
    cy.contains('a', 'Add New Job').click()
    cy.url().should('include', '/dashboard/jobs/add')
  })

  it('search submit sends a request with the search term', () => {
    cy.intercept('GET', '**/api/v2/jobs/search/**').as('searchJobs')
    cy.get('input[placeholder*="Search jobs"]').type('BROOKLYN')
    cy.contains('button', 'Search').click()
    cy.wait('@searchJobs').its('request.url').should('include', 'BROOKLYN')
  })

  it('shows Clear button after a search is applied', () => {
    cy.intercept('GET', '**/api/v2/jobs/search/**', {
      body: { jobs: [SAMPLE_JOBS[1]], JobTotal: 1 },
    }).as('searchJobs')
    cy.get('input[placeholder*="Search jobs"]').type('BROOKLYN')
    cy.contains('button', 'Search').click()
    cy.wait('@searchJobs')
    cy.contains('button', 'Clear').should('be.visible')
  })

  it('Clear button resets search and re-fetches jobs', () => {
    cy.intercept('GET', '**/api/v2/jobs/search/**', {
      body: { jobs: [SAMPLE_JOBS[1]], JobTotal: 1 },
    }).as('searchJobs')
    cy.get('input[placeholder*="Search jobs"]').type('BROOKLYN')
    cy.contains('button', 'Search').click()
    cy.wait('@searchJobs')

    cy.stubJobs(SAMPLE_JOBS)
    cy.contains('button', 'Clear').click()
    cy.contains('button', 'Clear').should('not.exist')
    cy.get('input[placeholder*="Search jobs"]').should('have.value', '')
  })
})
