const uid = () => {
  const ts = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
  const rand = () => Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, '0')
  return (ts + rand() + rand()).slice(0, 24)
}

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

describe('Add contractor with random name', () => {
  let firstName
  let lastName

  before(() => {
    firstName = `Test${uid()}`
    lastName = `Ctr${uid()}`
  })

  beforeEach(() => {
    cy.intercept('GET', '**/api/v2/contractors/newNumber', {
      body: { new_contractor_number: 'C-TEST-001' },
    }).as('getContractorNumber')
    cy.intercept('GET', '**/api/v2/contractors/license/types', {
      body: ['General Contractor', 'Subcontractor', 'Electrician'],
    }).as('getLicenseTypes')
    cy.intercept('GET', '**/api/v2/contractors/license/status', {
      body: ['Active', 'Inactive', 'Suspended'],
    }).as('getLicenseStatuses')

    cy.visit('/dashboard/contractors/add')
    cy.wait(['@getContractorNumber', '@getLicenseTypes', '@getLicenseStatuses'])
  })

  it('fills the form with a random name, submits, and finds the name in the list', () => {
    cy.intercept('POST', '**/api/v2/contractors/add', {
      statusCode: 201,
      body: { first_name: firstName, last_name: lastName, license_type: 'General Contractor', license_number: 'C-TEST-001' },
    }).as('addContractor')

    cy.intercept('GET', '**/api/v2/contractors', {
      body: [{ first_name: firstName, last_name: lastName, license_type: 'General Contractor', license_number: 'C-TEST-001' }],
    }).as('getContractors')

    cy.get('input[name="first_name"]').type(firstName)
    cy.get('input[name="last_name"]').type(lastName)
    cy.get('select[name="license_type"]').select('General Contractor')

    cy.contains('button', 'Create Contractor').click()
    cy.wait('@addContractor')

    cy.contains('Contractor created successfully!').should('be.visible')

    cy.wait('@getContractors', { timeout: 5000 })
    cy.url().should('include', '/dashboard/contractors')
    cy.contains(firstName).should('be.visible')
    cy.contains(lastName).should('be.visible')
  })
})
