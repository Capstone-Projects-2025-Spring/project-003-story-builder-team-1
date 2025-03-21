---
sidebar_position: 3
---
# Acceptance Tests

| Test ID | Actions/Steps | Notes/Expected Results
| -------- | ------- | -------
| 1 | **User Login**: Go to the Home Page for Story Builder | User will have to login when using Story Builder, and will be prompted to create an account if they do not already have one
| 2 | **Saving Account Data**: User account data will be stored in the database | User account data will be retrieved during login authentication
| 3 | **Create Agents**: User goes to the creation menu for Agents, and specifies a writing style for the Agent | A functional Agent will be available to be used in future drafting processes
| 4 | **Agent Writing**: When prompted, Agents will write a chapter draft | The resultant chapter draft should be coherent, grammatically correct, and be a reasonable response to the given prompt
| 5 | **Agent Draft Voting**: Agents will vote on which of the current drafts is best | A single draft must be chosen as the winning draft
| 6 | **Agent Critiquing**: Agents will critique the winning draft with possible areas of improvement | Each Agent must have a list of critiques for the winning draft
| 7 | **Agent Critique Voting**: Agents will vote on which critiques are best to focus on | The most voted critiques will be displayed, and considered by the Agents in the next iteration of chapter drafting
| 8 | **User Writing**: User participates in chapter drafting | User changes are reflected in the specific draft they wrote or editted
| 9 | **User Vetoing**: User can veto draft voting and critique voting | User veto will be reflected in final voting results
| 10 | **Agent-User Clarification**: Users and Agents can ask each other clarifying questions| Users and Agents can provide visible responses to the given questions
| 11 | **Saving Agent Writing Process**: Individual Agent drafting process data will be stored in the database | Agent draft data will be available to retrieve from the Database


