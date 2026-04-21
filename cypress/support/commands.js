const API = '**/api/v2'

Cypress.Commands.add('navigateToDashboard', () => {
  cy.contains('a', 'Dashboard').click()
  cy.url().should('include', '/dashboard')
})

Cypress.Commands.add('navigateToJobs', () => {
  cy.navigateToDashboard()
  cy.contains('Job Listings').click()
  cy.url().should('include', '/dashboard/jobs')
})

Cypress.Commands.add('navigateToApplicants', () => {
  cy.navigateToDashboard()
  cy.contains('a', 'Applicants').click()
  cy.url().should('include', '/dashboard/applicants')
})

Cypress.Commands.add('navigateToContractors', () => {
  cy.navigateToDashboard()
  cy.contains('Contractors').click()
  cy.url().should('include', '/dashboard/contractors')
})

Cypress.Commands.add('stubJobs', (jobs = []) => {
  cy.intercept('GET', `${API}/jobs/page/**`, {
    body: { jobs, JobTotal: jobs.length },
  }).as('getJobs')
  cy.intercept('GET', `${API}/meta`, {
    body: { JobTotal: jobs.length },
  }).as('getMeta')
})

Cypress.Commands.add('stubApplicants', (applications = []) => {
  cy.intercept('GET', `${API}/applications`, { body: applications }).as('getApplicants')
})

Cypress.Commands.add('stubContractors', (contractors = []) => {
  cy.intercept('GET', `${API}/contractors`, { body: contractors }).as('getContractors')
})
