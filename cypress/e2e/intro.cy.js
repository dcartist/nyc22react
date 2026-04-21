describe('Navigation', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the home page', () => {
    cy.url().should('eq', Cypress.config('baseUrl') + '/')
  })

  it('shows top nav links — Home, About, Dashboard', () => {
    cy.contains('a', 'Home').should('be.visible')
    cy.contains('a', 'About').should('be.visible')
    cy.contains('a', 'Dashboard').should('be.visible')
  })

  it('navigates to the About page', () => {
    cy.contains('a', 'About').click()
    cy.url().should('include', '/about')
  })

  it('navigates to the Dashboard', () => {
    cy.contains('a', 'Dashboard').click()
    cy.url().should('include', '/dashboard')
  })

  it('dashboard sidebar shows Applicants, Job Listings, Contractors links', () => {
    cy.contains('a', 'Dashboard').click()
    cy.contains('Applicants').should('be.visible')
    cy.contains('Job Listings').should('be.visible')
    cy.contains('Contractors').should('be.visible')
  })

  it('dashboard redirects to /applicants by default', () => {
    cy.visit('/dashboard')
    cy.url().should('include', '/dashboard/applicants')
  })
})
