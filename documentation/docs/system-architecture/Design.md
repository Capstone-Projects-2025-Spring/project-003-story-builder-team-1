---
sidebar_position: 1
---
## Frontend Class Diagram
```mermaid
classDiagram
    class App {
        -user_session: User
        +render()
        +set_user_session(user: User) void
    }

    class Login_Page {
        -username: string
        -password: string
        +handle_login() void
        +validate_input() boolean
        +display_error_message() void
        +redirect_to_home_page() void
    }

    class Home_Page {
        -user_stories: Story[]
        +show_story_list() void
        +create_new_story() void
        +open_agent_creation_modal() void
        +open_agent_selection_modal() void
    }

    class Agent_Creation {
        -agent_name: string
        +create_agent() void
        +confirm_agent_creation() void
        +show_success_message() void
    }

    class Agent_Selection {
        -available_agents: Agent[]
        -selected_agents: Agent[]
        +display_available_agents() void
        +select_agent() void
        +remove_agent() void
        +display_selected_agents() void
    }

    class Story_Writing {
        -current_chapter: int
        -story_prompt: string
        -agent_versions: string[]
        -critique: string
        +display_story() void
        +collect_votes() void
        +show_agent_chapters() void
        +display_voting_results() void
        +submit_critique() void
        +select_chapter_to_critique() void
        +display_revised_chapter() void
    }

    class Story {
        -story_title: string
        -chapters: Chapter[]
    }

    class Chapter {
        -chapter_number: int
        -chapter_title: string
        -chapter_content: string
    }

    class User {
        -username: string
        -auth_token: string
    }

    class Agent {
        -agent_name: string
    }

    App --> User : uses
    App --> Login_Page : renders
    App --> Home_Page : renders
    Login_Page --> Home_Page : navigates to
    Home_Page --> Story : uses
    Story --> Chapter : uses
    Home_Page --> Agent_Creation : contains
    Home_Page --> Agent_Selection : contains
    Agent_Selection --> Agent : uses
    Home_Page --> Story_Writing : contains
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
![Critiquing Stories Sequence Diagram drawio](https://github.com/user-attachments/assets/f7a3d559-95c9-45b5-a69c-094d10144f6d)


### AI Agent Ecosystem
Please refer to the Initial Writing Process sequence diagram as this is a continuation.

![AI Agent Backend Sequence Diagram drawio](https://github.com/user-attachments/assets/c4f0fe27-5232-4b37-9503-4697e3c2ff80)
