
describe('Site Navigation', () => {
  it('can navigate to main sections from homepage', () => {
    cy.visit('/');
    
    // Check main navigation links with updated text
    cy.contains('a', 'Sell Any Product').click();
    cy.url().should('include', '/products');
    
    cy.contains('a', 'Machines and Lockers').click();
    cy.url().should('include', '/machines');
    
    cy.contains('a', 'Business Goals').click();
    cy.url().should('include', '/business-goals');
    
    cy.contains('a', 'Technology').click();
    cy.url().should('include', '/technology');
  });

  it('can access admin dashboard', () => {
    cy.visit('/');
    cy.visit('/admin'); // Direct navigation since we don't have auth setup in the test
    cy.url().should('include', '/admin');
    cy.contains('CMS Admin Dashboard').should('be.visible');
  });
});
