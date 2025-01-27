---
sidebar_position: 4
---

# Features and Requirements

## Functional Requirements
- The User will be required to make an account to use Story Builder
  - User accounts will be authenticated upon login
    
- Users will be able to create Agents, which will create story drafts in a specific writing style
  - Users will be able to give details for a story proposal and ask Agents to generate a story draft based on these details
    
- Agents will vote amongst themselves to decide which draft is the "best"
  - The User will be able to override the vote

- Agents will generate a list of critiques of the draft that was chosen to move forward
  - Agents will vote on which critiques to focus on
  - The User will be able to override the list of critiques to focus on
  - The User will be able to suggest their own critiques

- Agent progress will be saved incrementally as a linked list to allow the user to revert to a previous point or quickly train another agent

- User account data, Agent Progress, and writing drafts will all be stored in a database

## Nonfunctional Requirements
