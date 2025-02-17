---
sidebar_position: 1
---
## Frontend Class Diagram
```mermaid
classDiagram
    class App {
        -currentPage: string
        -userSession: User
        +render()
        +navigateTo(page: string) void
        +setUserSession(user: User) void
    }

    class LoginPage {
        -username: string
        -password: string
        +handleLogin() void
        +validateInput() boolean
        +displayErrorMessage() void
        +redirectToHomePage()void
    }

    class HomePage {
        -userStories: Story[]
        +showStoryList() void
        +createNewStory() void
        +navigateToAgentCreationPage() void
    }

    class AgentCreationPage {
        -agentName: string
        +createAgent() void
        +validateAgentDetails() boolean
        +confirmAgentCreation() void
        +showSuccessMessage() void
        +redirectToHomePage() void
    }

    class AgentSelectionPage {
        -availableAgents: Agent[]
        -selectedAgents: Agent[]
        +displayAvailableAgents() void
        +selectAgent() void
        +removeAgent() void
        +displaySelectedAgents() void
        +navigateToStoryWritingPage() void
        +redirectToHomePage() void
    }

    class StoryWritingPage {
        -currentChapter: int
        -storyPrompt: string
        -agentVersions: string[]
        -critique: string
        +displayStory() void
        +collectVotes() void
        +showAgentChapters() void
        +displayVotingResults() void
        +submitCritique() void
        +selectChapterToCritique() void
        +displayRevisedChapter() void
    }

    class Story {
        -storyTitle: string
        -chapters: Chapter[]
    }

    class Chapter {
        -chapterNumber: int
        -chapterTitle: string
        -chapterContent: string
    }

    class User {
        -username: string
        -authToken: string
    }

    class Agent {
        -agentName: string
    }

    App --> User : uses
    App --> LoginPage
    LoginPage --> HomePage : navigates to
    HomePage --> Story : uses
    Story --> Chapter : uses
    HomePage --> AgentCreationPage : navigates to
    HomePage --> AgentSelectionPage : navigates to
    AgentSelectionPage --> Agent : uses
    AgentSelectionPage --> StoryWritingPage : navigates to
    AgentCreationPage --> HomePage : navigates to
    AgentSelectionPage --> HomePage : navigates to
    StoryWritingPage --> HomePage : navigates to
```

## Agent Drafting Process State Diagram
 ```mermaid
stateDiagram-v2
    [*] --> Story_Drafting: Agents Receives User Story Prompt

   Story_Drafting: Story Drafting
   state Story_Drafting {
      state is_finished <<choice>>
      [*] --> is_finished

      is_finished --> Chapter_Drafting: If There are still Chapters to be Written

      Chapter_Drafting: Chapter Drafting
      state Chapter_Drafting{
         state is_satisfied <<choice>>
         [*] --> is_satisfied
         
         is_satisfied --> Draft: If the User is Not Yet Satisfied with Draft Quality or Drafts Have Not Yet Been Generated
         Draft: Agents Write Drafts

         Draft --> Vote: User May Participate in the Draft Writing Process
         Vote: Agents Vote on which story they believe to be the best

         Vote --> Critique: User May Veto the Vote with Their Own Preference
         Critique: Agents give critiques of Winning Draft

         Critique --> Critique_Vote: User May Add Critiques of Their Own
         Critique_Vote: Agents Vote on which Critiques to Focus

         Critique_Vote --> is_satisfied: User May Select Critiques that the Agents did not Select

         is_satisfied --> [*]: If the Chapter Draft is to the User's Satisfaction
      }

      Chapter_Drafting --> is_finished

      is_finished --> [*]: If All Chapters Requested are Completed
         
   }

   Story_Drafting --> [*]: Story is Saved

```
## Sequence Diagrams

### Account Creation
![Account Creation Sequence Diagram drawio](https://github.com/user-attachments/assets/a3726231-ee86-45f3-a440-ff35f56d238e)

### Account Deletion
Please refer to the Account Creation Diagram before looking at the Account Deletion.

![Account Deletion Sequence Diagram drawio](https://github.com/user-attachments/assets/7baae06e-798d-4996-b338-453ffe22a7e1)

### Agent Creation
![Agent Creation Sequence Diagram drawio](https://github.com/user-attachments/assets/8089b7f3-8ea1-4931-b2a4-8f71baebd486)

### Selecting Writing Mode (Manual: user involvement, Automatic: no user involvement)
![Manual vs Automatic Sequence Diagram drawio](https://github.com/user-attachments/assets/43c4f354-2a91-4150-ba62-5b6dbf15bc64)

### Selecting Involvement Options
Please refer to the Selecting Writing Mode sequence diagram as this is a continuation.

![Involvement Options Sequence Diagram drawio](https://github.com/user-attachments/assets/bf2543e1-3738-4a96-b3f6-413b2aa71735)

### Initial Writing Process
![Initial Writing Sequence Diagram drawio](https://github.com/user-attachments/assets/cd6b3dad-c2c2-4e6b-b6ca-acf07bb46919)

### Editing Agent Work
Please refer to the Initial Writing Process sequence diagram as this is a continuation.

![Editing Agent Work Sequence Diagram drawio](https://github.com/user-attachments/assets/905326e6-947b-49ac-8291-d5352aa3f13b)

### Viewing and Editing Chat History
![Viewing and Editing Chat History Sequence Diagram drawio](https://github.com/user-attachments/assets/c527ef8e-dbd2-4897-8225-efc3a2095549)

### Voting for Stories
Please refer to the Initial Writing Process sequence diagram as this is a continuation.

![Voting for Stories Sequence Diagram drawio](https://github.com/user-attachments/assets/7c5665b3-85f3-4865-aeb7-3ccc3773c275)

### Vetoing Stories
Please refer to the Initial Writing Process sequence diagram as this is a continuation.

![Vetoing Stories Sequence Diagram drawio](https://github.com/user-attachments/assets/59c247df-944b-42f7-8c63-15e8cbeaf4e9)

### Critiquing Stories
Please refer to the Initial Writing Process sequence diagram as this is a continuation.

![Critiquing Stories Sequence Diagram drawio](https://github.com/user-attachments/assets/1ff25e8e-60a7-4f6e-8470-8c6ba5545ebc)

### AI Agent Ecosystem
Please refer to the Initial Writing Process sequence diagram as this is a continuation.

![AI Agent Backend Sequence Diagram drawio](https://github.com/user-attachments/assets/c4f0fe27-5232-4b37-9503-4697e3c2ff80)
