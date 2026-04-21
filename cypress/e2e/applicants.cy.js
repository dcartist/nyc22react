const SAMPLE_APPLICANTS = [
  {
    applicant_firstName: 'Jane',
    applicant_lastName: 'Doe',
    applicant_license: 'LIC-001',
    applicant_title: 'Engineer',
    applicant_email: 'jane@example.com',
  },
  {
    applicant_firstName: 'John',
    applicant_lastName: 'Smith',
    applicant_license: 'LIC-002',
    applicant_title: 'Architect',
    applicant_email: 'john@example.com',
  },
]

describe('Applicants', () => {
  beforeEach(() => {
    cy.stubApplicants(SAMPLE_APPLICANTS)
    cy.visit('/')
    cy.navigateToApplicants()
  })

  it('shows the Refresh Applicants button', () => {
    cy.contains('button', 'Refresh Applicants').should('be.visible')
  })

  it('shows the Create New Application button linking to /dashboard/applicants/new', () => {
    cy.contains('a', 'Create New Application')
      .should('be.visible')
      .and('have.attr', 'href', '/dashboard/applicants/new')
  })

  it('shows the applicant search input and Search button', () => {
    cy.get('input[placeholder*="Search applicants"]').should('be.visible')
    cy.contains('button', 'Search').should('be.visible')
  })

  it('loads applicants from the API on mount', () => {
    cy.wait('@getApplicants')
  })

  it('navigates to Create New Application page', () => {
    cy.contains('a', 'Create New Application').click()
    cy.url().should('include', '/dashboard/applicants/new')
  })

  it('Refresh Applicants button re-fetches data', () => {
    cy.wait('@getApplicants')
    cy.stubApplicants(SAMPLE_APPLICANTS)
    cy.contains('button', 'Refresh Applicants').click()
    cy.wait('@getApplicants')
  })

  it('shows Clear button after search is applied and clears on click', () => {
    cy.wait('@getApplicants')
    cy.get('input[placeholder*="Search applicants"]').type('Jane')
    cy.contains('button', 'Search').click()
    cy.contains('button', 'Clear').should('be.visible')

    cy.contains('button', 'Clear').click()
    cy.contains('button', 'Clear').should('not.exist')
    cy.get('input[placeholder*="Search applicants"]').should('have.value', '')
  })
})
