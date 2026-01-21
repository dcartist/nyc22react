describe('NYC Job App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

//it should load jobs

    it('should navigate to jobs', () => {
    cy.contains('Dashboard').click()
    cy.url().should('include', '/dashboard')
    cy.contains('Job Listings').click()
    cy.url().should('include', '/dashboard/jobs')
    cy.contains('Refresh Jobs')
    cy.contains('Add New Job') 
    
  })



})