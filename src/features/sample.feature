Feature:Sample Feature

  Scenario: Sample Scenario
    Given I am navigation to my demo application with URL "https://parabank.parasoft.com/parabank/index.htm?ConnType=JDBC" 
    When I login with user as 'john' and password as 'demo'
    Then I should see the expected result