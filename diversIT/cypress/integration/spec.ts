describe('Smoke test', () => {
  it('Visits to the root page redirect to landing page if not authenticated', () => {
    cy.visit('/');
    cy.url().should('include', '/landing');
    cy.get('app-navbar a').contains('DiversIT');

    const snackbar = cy.get('simple-snack-bar');
    snackbar.should('be.visible');
    snackbar.should('have.text', 'Sie sind nicht eingeloggt! ');
  });
})
