describe('Smoke test', () => {
  it('Visits to the root page redirect to landing page if not authenticated', () => {
    cy.visit('/')
    cy.url().should('include', '/landing')
    cy.get('app-root .mat-toolbar span').contains('DiversIT')
  })
})
