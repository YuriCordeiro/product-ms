Feature: Product Management

  Scenario: Create a new product
    Given I have a product
    When I create the product
    Then I should receive the created product

  Scenario: Get all products
    Given there are products in the system
    When I get all products
    Then I should receive a list of products