describe('NYC Job App', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the home page', () => {
    cy.contains('Dashboard')
  })
  it('should load the home page', () => {
    cy.contains('About')
  })

  it('should navigate to dashboard', () => {
    cy.contains('Dashboard').click()
    cy.url().should('include', '/dashboard')
  })
})
