// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

describe('Create scenario', () => {
  it('can create scenario master', () => {
    //login
    cy.visit('/');
    cy.get('[data-cy=sign-in-with-microsoft-button]')
      .click();
    cy.get('[data-cy=loading-component]').should('be.visible');
    cy.url().should('include', '/scenario');

    cy.wait(7000);
    cy.waitForReact(1000, '#root');
    cy.react('CreateScenarioButton')
      .click();
    cy.react('CreateScenarioButton').react('CreateScenarioDialog').react('Checkbox', { props: { id: 'isScenarioMaster' } })
      .click();
  });

  it ('can select another scenario after creation', () => {

  });

  it ('can create scenario child', () => {
    
  });
});