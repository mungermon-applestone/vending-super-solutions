
describe('Admin Machines Page', () => {
  beforeEach(() => {
    // Simulate login before each test
    cy.adminLogin();
    cy.visit('/admin/machines');
  });

  it('displays the machines management page title', () => {
    cy.contains('h1', 'Machines Management').should('be.visible');
  });

  it('navigates to add new machine page when the button is clicked', () => {
    cy.contains('a', 'Add New Machine').click();
    cy.url().should('include', '/admin/machines/new');
  });

  it('displays machine list when machines are available', () => {
    // This test assumes there are machines in the database
    // In a real test, you might need to seed test data or mock API responses
    cy.get('table')
      .should('exist')
      .and('be.visible');
  });

  it('shows refresh functionality', () => {
    cy.contains('button', 'Refresh').click();
    // Would normally check for loading state or refreshed content
    cy.contains('Refreshing machines data').should('exist');
  });
});
