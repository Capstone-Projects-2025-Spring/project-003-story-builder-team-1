---
sidebar_position: 4
---

# Features and Requirements

## Functional Requirements

- Users will be required to make an account to use Story Builder
  - User accounts will be authenticated upon login
    
- Users will be able to create Agents, which will create story drafts in a specific writing style
  - Agents will be created using data from DeepSeek in conjunction with user input pertaining to how the Agent should write stylistically
  - Users will be able to give details for a story proposal and ask Agents to generate a story draft based on these details
  - Users will also be able to delete Agents at any point
    
- Agents will vote amongst themselves to decide which draft is the "best"
  - The user will be able to override the vote

- Agents will generate a list of critiques of the draft that was chosen to move forward
  - Agents will vote on which critiques to focus on
  - The user will be able to override the list of critiques to focus on
  - The user will be able to suggest their own critiques

- Agent writing progress will be saved incrementally as a linked list
  - Users will be able to revert to a previous progress point or quickly train another agent with existing data

- Users will be able to directly edit drafts

- User account data, Agent writing progress, and writing drafts will all be stored in a database
  - Users can decide which writing drafts to save, and which to discard  

## Nonfunctional Requirements

- The interface will be simple to use, and will be relatively minimalistic to avoid confusion
- The application will function as a web application, allowing for the user to utilize the application in most web browsers
- An Agent can take on a "persona" such as William Shakespeare, Dr. Seuss, J. R. R. Tolkien, etc, which will impact the Agent's writing style
- User can give both story details and response feedback by writing text, attaching documents, or giving voice messages
- Agents will be able to ask questions to better understand user input, and the user can also ask questions to the Agents
- The user will be able to track the amount of occurences of characters or specified keywords within an Agent's draft
