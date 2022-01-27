describe('Smoke test', () => {
  it('redirects to landing page on unauthenticated access to root page', () => {
    cy.visit('/');
    cy.url().should('include', '/landing');
    cy.get('app-navbar a').contains('DiversIT');

    const snackbar = cy.get('simple-snack-bar');
    snackbar.should('be.visible');
    snackbar.should('have.text', 'Sie sind nicht eingeloggt! ');
  });

  it('redirects to landing page on unauthenticated access to app page', () => {
    cy.visit('/app');
    cy.url().should('include', '/landing');
    cy.get('app-navbar a').contains('DiversIT');

    const snackbar = cy.get('simple-snack-bar');
    snackbar.should('be.visible');
    snackbar.should('have.text', 'Sie sind nicht eingeloggt! ');
  });

  it('redirects to landing page on unauthenticated access to chat page', () => {
    cy.visit('/chat');
    cy.url().should('include', '/landing');
    cy.get('app-navbar a').contains('DiversIT');

    const snackbar = cy.get('simple-snack-bar');
    snackbar.should('be.visible');
    snackbar.should('have.text', 'Sie sind nicht eingeloggt! ');
  });

  it('redirects to landing page on unauthenticated access to a profile page', () => {
    cy.visit('/profile/zLccCJEzSGap7BlhefDT0xTyi9I3');
    cy.url().should('include', '/landing');
    cy.get('app-navbar a').contains('DiversIT');

    const snackbar = cy.get('simple-snack-bar');
    snackbar.should('be.visible');
    snackbar.should('have.text', 'Sie sind nicht eingeloggt! ');
  });
})
