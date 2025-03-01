---
sidebar_position: 2
---
# Integration Tests

## Component Connection Logistics

#### There are four major components, three of which (Backend, Frontend, LLM) connect to create an input-output pipeline. The pipleine would be as follows:
1. Frontend receives user input
1. User input is sent to the Backend
1. Backend Receives input, and sends the input to the LLM
1. Depending on the user input, the LLM would generate the chapter draft, critique, or edits
1. The generated data from the LLM would then be sent to the Backend, and then the Frontend

#### The fourth major component, the Database, will also interact with the Backend, Frontend, and LLM, as follows:
- The Database interacts with the Frontend when user story prompts are sent to the Backend, and then stored in the Database
- Any edits to agent-generated drafts would then be sent to the Backend to be updated in the Database
- Each step of agent-generated drafts would be send to the Backend to be stored in the Database
- When the story is completed, each of the individual steps of the chapter drafting process will be deleted in the Database, and the final chapter data for each chapter will be merged into a single entry in the Database

## Testing Logistics

- Testing connection from the Frontend to the Backend would involve sending data from the user interface, and ensuring the data is successfully received in the Backend.
- Testing connection from the Backend to the Frontend would involve sending a message that is visible on the Frontend.
- Testing connection from the Backend to the LLM would involve sending some prompt to the LLM, and ensuring a response is successfully received in the Backend.
- Testing connection from the LLM to the Backend would involve ensuring that the LLM response prompt to the Backend is coherent and grammatically correct.
- Testing connection between the Backend and Database involves three distinct tests:
  - Testing adding a new entry into the Database would involve sending sample data to the Database, and ensuring the data is successfully received and an entry is created in the Database.
  - Testing editing an entry in the Database would involve checking to see if a specific entry currently exists in the Database, sending new data to replace the specified entry, and ensuring that the data entry is successfully updated in the Database.
  - Testing deleting an entry in the Database would involve checking to see if a specific entry currently exiss in the Database, sending a request to delete the specified entry, and ensuring that the proper status response is returned from the Database.
  - Note: All tests involving the Database require retreiving the test entry from the Database to ensure that the test value matches the expected value.
- Testing the entire input-output pipeline involves sending a sample prompt with specified requirements and receiving a generated LLM response that meets the requirements
