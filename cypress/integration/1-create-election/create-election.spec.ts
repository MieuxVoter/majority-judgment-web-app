/// <reference types="cypress" />

describe("signup flow", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("/");
  });

  it("allows to fill an election form", () => {
    cy.get('[data-test="question-input"]').type(
      "Pour faire gagner l’écologie et la justice sociale à l’élection présidentielle, j’estime que chacune de ces personnalités serait…"
    );
    cy.screenshot();

    cy.get('[data-test="question-input"]').type("{enter}");

    cy.url().should("include", "/new?title=");
    cy.screenshot();
  });
});
