const SAMPLE_CONTRACTORS = [
  {
    first_name: 'Alice',
    last_name: 'Builder',
    business_name: 'ABC Construction',
    business_phone_number: '212-555-0100',
    license_number: 'GC-123',
    license_type: 'General Contractor',
  },
  {
    first_name: 'Bob',
    last_name: 'Mason',
    business_name: 'Mason Works LLC',
    business_phone_number: '718-555-0200',
    license_number: 'SC-456',
    license_type: 'Subcontractor',
  },
]

describe('Contractors', () => {
  beforeEach(() => {
    cy.stubContractors(SAMPLE_CONTRACTORS)
    cy.visit('/')
    cy.navigateToContractors()
  })

  it('shows the Refresh Contractors button', () => {
    cy.contains('button', 'Refresh Contractors').should('be.visible')
  })

  it('shows the Create New Contractor button linking to /dashboard/contractors/add', () => {
    cy.contains('a', 'Create New Contractor')
      .should('be.visible')
      .and('have.attr', 'href', '/dashboard/contractors/add')
  })

  it('shows the contractor search input and Search button', () => {
    cy.get('input[placeholder*="Search contractors"]').should('be.visible')
    cy.contains('button', 'Search').should('be.visible')
  })

  it('loads contractors from the API on mount', () => {
    cy.wait('@getContractors')
  })

  it('navigates to Create New Contractor page', () => {
    cy.contains('a', 'Create New Contractor').click()
    cy.url().should('include', '/dashboard/contractors/add')
  })

  it('Refresh Contractors button re-fetches data', () => {
    cy.wait('@getContractors')
    cy.stubContractors(SAMPLE_CONTRACTORS)
    cy.contains('button', 'Refresh Contractors').click()
    cy.wait('@getContractors')
  })

  it('shows Clear button after search is applied and clears on click', () => {
    cy.wait('@getContractors')
    cy.get('input[placeholder*="Search contractors"]').type('Alice')
    cy.contains('button', 'Search').click()
    cy.contains('button', 'Clear').should('be.visible')

    cy.contains('button', 'Clear').click()
    cy.contains('button', 'Clear').should('not.exist')
    cy.get('input[placeholder*="Search contractors"]').should('have.value', '')
  })
})
