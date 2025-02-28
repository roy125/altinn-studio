/* eslint-disable cypress/no-unnecessary-waiting */
/// <reference types="cypress" />
/// <reference types="../../support" />

import { designer } from '../../pageobjects/designer';

context(
  'Bruksmønster',
  {
    retries: {
      runMode: 2,
    },
  },
  () => {
    before(() => {
      cy.studiologin(Cypress.env('useCaseUser'), Cypress.env('useCaseUserPwd'));
      cy.getrepo(Cypress.env('deployApp'), Cypress.env('accessToken')).then((response) => {
        if (response.status === 404) {
          const [_, appName] = Cypress.env('deployApp').split('/');
          cy.createapp('Testdepartementet', appName);
        }
      });
    });
    beforeEach(() => {
      cy.studiologin(Cypress.env('useCaseUser'), Cypress.env('useCaseUserPwd'));
      cy.intercept('GET', '**/datamodels/all-json').as('getDatamodels');
      cy.visit('/');
      cy.searchAndOpenApp(Cypress.env('deployApp'));
      cy.wait('@getDatamodels');
      cy.get(designer.layOutContainer).should('be.visible');
    });

    it('Navigation', () => {
      cy.get(designer.aboutApp.repoName)
        .invoke('val')
        .should('contain', Cypress.env('deployApp').split('/')[1]);
      cy.get(designer.appMenu.edit).should('be.visible').click();
      cy.get(designer.formComponents.shortAnswer)
        .parentsUntil(designer.draggable)
        .should('be.visible');
      cy.get(designer.appMenu.texts).should('be.visible').click();
      cy.get(designer.texts.new).should('be.visible');
    });

    it('Gitea connection - Pull changes', () => {
      cy.deleteLocalChanges(Cypress.env('deployApp'));
      cy.wait(5000);
      cy.intercept(/(P|p)ull/).as('pullChanges');
      cy.get(designer.syncApp.pull).should('be.visible').click();
      cy.wait('@pullChanges');
      cy.get('h3').contains('Appen din er oppdatert til siste versjon').should('be.visible');
    });

    it('App builds and deploys', () => {
      cy.intercept('**/deployments*').as('deploys');
      cy.get(designer.appMenu.deploy).should('be.visible').click();
      // TODO: Add below line again after preview is enabled in prod/dev (app-development/layout/AppBar/AppBar.tsx:65)
      // cy.get(designer.appMenu.preview).should('be.visible').click();
      cy.wait('@deploys').its('response.statusCode').should('eq', 200);
      const checkDeployOf = Cypress.env('environment') === 'prod' ? 'prod' : 'at22';
      cy.get(designer.deployHistory[checkDeployOf]).then((table) => {
        cy.get(table).isVisible();
        cy.get(table).find('tbody > tr').should('have.length.gte', 1);
      });
    });
  }
);
