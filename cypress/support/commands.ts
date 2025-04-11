
/// <reference types="cypress" />

// Custom command for logging into the admin section
Cypress.Commands.add('adminLogin', () => {
  // This is a placeholder. In a real application, you would implement actual login logic
  cy.log('Admin login simulation');
  // Example: cy.visit('/admin-login').type('#username', 'admin').type('#password', 'password').click('#login-button')
  cy.visit('/admin');
});

// Custom command for creating a test machine
Cypress.Commands.add('createTestMachine', (machineName = 'Test Machine') => {
  cy.visit('/admin/machines');
  cy.contains('a', 'Add New Machine').click();
  cy.get('input[name="title"]').type(machineName);
  cy.get('input[name="slug"]').type(`test-machine-${Date.now()}`);
  cy.get('select[name="type"]').select('vending');
  // Add more fields as needed
  cy.contains('button', 'Save').click();
  cy.contains('Machine saved successfully').should('be.visible');
});

// Declare the Cypress namespace to add custom commands types
declare global {
  namespace Cypress {
    interface Chainable {
      adminLogin(): Chainable<void>;
      createTestMachine(machineName?: string): Chainable<void>;
    }
  }
}
