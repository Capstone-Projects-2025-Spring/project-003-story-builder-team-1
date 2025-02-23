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
### AI Agent Ecosystem
Please refer to the [Initial Writing Story](./sequence-diagrams.md#initial-writing-story-process-sequence-diagram) Process sequenced diagram as this is a continuation.

![AI Agent Backend Sequence Diagram drawio](https://github.com/user-attachments/assets/c4f0fe27-5232-4b37-9503-4697e3c2ff80)
