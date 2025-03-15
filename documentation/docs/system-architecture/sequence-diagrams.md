---
sidebar_position: 3
---

# Sequence Diagrams

## Use Case 1: Account Creation
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    User->>+Frontend: User clicks "Sign Up"
    Frontend-->>User: Redirect to Registration page
    loop Until valid email is provided
        User->>Frontend: User enters login information
        Frontend->>+Backend: Send credentials for authentication
        Backend->>+Database: Check Database for email
        alt if Email exists
            Database-->>Backend: Returns existing email
            Backend-->>Frontend: Authentication failure response
            Frontend-->>User: "User already exists error" message
            Frontend-->>User: Prompts User to try again
        else if Email does not exist
            Database-->>Backend: Returns no email
            Backend-->>Frontend: Authentication success response
            Frontend-->>User: "Account successfully created" message
            Frontend-->>User: Redirect to Login Page
        end
    end
    deactivate Database
    deactivate Backend
    deactivate Frontend
```

## Use Case 2: Agent Creation
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant LLM
    participant Database
    User->>+Frontend: User clicks "Create Agent"
    Frontend-->>User: Prompts User for writing style
    opt Writing Style Preferences
    User->>Frontend: User specifies writing style
    end
    Frontend->>+Backend: Agent creation request
    Backend->>+Database: Search for Agent context
    alt if Agent context in Database
        Database-->>Backend: Returns agent context
    else if Agent context is not in Database
        Database-->>Backend: Returns empty cursor
        Backend->>+LLM: Search for Agent context request
        LLM-->>-Backend: Returns Agent context
        Backend->>Database: Add Agent context
        Database-->>-Backend: Returns document with entry ID
    end
    Backend-->>-Frontend: Request successful response
    Frontend-->>User: "Agent successfully created" message
    Frontend-->>-User: Opens agent popup modal
```

## Use Case 3: Agent Deletion
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    User->>+Frontend: User clicks "Agents"
    Frontend-->>User: Opens agents popup modal
    User->>Frontend: User clicks desired Agent
    Frontend-->>User: Opens specific Agent Menu modal
    User->>Frontend: User clicks "Delete Agent"
    Frontend->>+Backend: Agent deletion request
    alt if Deletion was successful
        Backend-->>Frontend: Returns "Agent successfully deleted" response
    else if Deletion was successful
        Backend-->>-Frontend: Returns "Error: Unable to delete agent" error response
    end
    Frontend-->>-User: Shows returned response
```

## Use Case 4: Viewing History
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    User->>+Frontend: User clicks desired story
    Frontend-->>User: Opens story page
    User->>Frontend: User scrolls up to view story history until desired edit is found
    User->>Frontend: User clicks "View" on the desired result to view all the individual Agent contributions
    Frontend-->>-User: Shows all individual Agents and their specific work
```

## Use Case 5: Editing Agent Work
This diagram assumes the sequence of events in [Agent Story Generation](#use-case-7-agent-story-generation) sequence diagram.

This diagram follows the [Viewing History](#use-case-4-viewing-history-sequence-diagram) sequence diagram for finding the desired agent work to edit.
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    User->>+Frontend: User clicks "Edit"
    Frontend-->>User: Opens text box for editing
    User->>Frontend: Edits Agent work with desired changes
    Frontend->>+Backend: Edit request with desired changes
    Backend->>+Database: Get Request for the story
    Database-->>-Backend: Return story JSON
    Backend->>+Database: Add Request for new story (Copied story until change + desired change)
    Database-->>-Backend: Returns document containing status of operation
    Backend-->>-Frontend: Return updated Agent work with desired changes
    Frontend-->>-User: Display updates and remove any history after changes from story chat
```

## User Case 6: Vetoing Agent Votes
This diagram assumes the sequence of events in [Agent Story Generation](#use-case-7-agent-story-generation) sequence diagram.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database
    User->>+Frontend: The user clicks on desired voted upon result
    Frontend-->>User: Opens popup modal containing each agents individual work for chosen result
    User->>Frontend: The user clicks veto on the specifc agent contribution they prefer
    Frontend->>+Backend: Send Update Request with the ID of the desired agent work.
    Backend->>+Database: Update Request (Change ID reference to the desired agent work)
    Database-->>-Backend: Returns document containing entry ID
    Backend-->>-Frontend: Return the new agent work selected via the veto. 
    Frontend-->>-User: Display the new chosen agent work. 
```
## Use Case 7: Agent Story Generation
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant LLM
    participant Database
    User->>+Frontend: User selects "Generate Story"
    Frontend-->>User: Opens up a prompt popup modal
    User->>Frontend: User enters necessary information (number of chapters, story subject/synopsis, any extra criteria)
    Loop For every Agent
    Frontend->>+Backend: Sends generation request allow with inputted information
    Backend->>+LLM: Generate Request with formatted prompt
    LLM-->>-Backend: Returns generated chapter response as a JSON
    Backend->>+Database: Add Request for newly generated story chapter
    Database-->>-Backend: Returns document containing status of operation
    end
    Backend-->>-Frontend: Return all agent chapters
    Frontend-->>-User: Display all agent chapters
```

## Use Case 8: Agent Voting
This diagram assumes the sequence of events in [Agent Story Generation](#use-case-7-agent-story-generation) sequence diagram.
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant LLM
    participant Database
    activate Frontend
    activate Backend
    loop For every Agent
        Backend->>+LLM: Vote Request (Provides every other agents' work)
        LLM-->>-Backend: Returns casted vote
    end
    Backend->>+Database: Update Request (Change reference in story entry to the most-voted agent work)
    Database-->>-Backend: Returns document with the operation status
    Backend-->>-Frontend: Return most-voted agent work
    Frontend-->>-User: Display the most-voted agent work
```

## Use Case 8: Critiquing Stories
This diagram assumes the sequence of events in [Agent Story Generation](#use-case-7-agent-story-generation) sequence diagram.

![Critiquing Stories Sequence Diagram drawio](https://github.com/user-attachments/assets/78bec6d2-943e-4429-b429-d87205cb8348)