---
sidebar_position: 1
---

# Class Diagrams

## Frontend Class Diagram
```mermaid
  classDiagram
    class App {
        +render()
    }

    class AGENT_BOX {
        +handle_continue() void
    }

    class AGENT_SELECTION {
        +handle_confirm() void
        +handle_agent_change() void
        +handle_add_agent() void
        +handle_remove_agent() void
        +get_options() void
    }

    class AGENT_THOUGHTS {

    }

    class BEST_RESPONSE {
        +handle_continue() void
    }

    class CHAPTER_LIST {
        +handle_chapter_click() void
        +handle_view_entire_story() void
    }

    class CHAPTER_VIEW {

    }

    class CREATE_ACCOUNT {
        +handle_create_account() void
        +handle_login
    }

    class LOGIN {
        +handle_login() void
        +handle_create_account() void
    }

    class HOME {

    }

    class MAIN_LAYOUT {
        +handle_logo_click() void
    }

    class PROTECTED_ROUTE {

    }

    class STORY_AGENTS_VIEW {

    }

    class STORY_LIST {
        +handle_delete_click() void
        +handle_delete_confirm() void
        +toggle_expand() void
    }

    class STORY_PROMPT_BOX {
        +handle_submit() void
    }

    class STORY_VIEW {

    }

    
    App *-- CREATE_ACCOUNT
    App *-- LOGIN
    App *-- PROTECTED_ROUTE
    PROTECTED_ROUTE *-- MAIN_LAYOUT
    MAIN_LAYOUT *-- HOME
    MAIN_LAYOUT *-- AGENT_SELECTION
    MAIN_LAYOUT *-- STORY_PROMPT_BOX
    MAIN_LAYOUT *-- STORY_AGENTS_VIEW
    MAIN_LAYOUT *-- STORY_LIST
    MAIN_LAYOUT *-- BEST_RESPONSE
    MAIN_LAYOUT *-- CHAPTER_LIST
    STORY_AGENTS_VIEW *-- AGENT_BOX
    STORY_AGENTS_VIEW *-- AGENT_THOUGHTS
    MAIN_LAYOUT *-- CHAPTER_VIEW
    MAIN_LAYOUT *-- STORY_VIEW
```

## `App`
### Purpose
Describes the root component of the application.

### Data Fields
_None_

### Methods
#### `render()`
- **Purpose**: Render the main application layout.
- **Pre-conditions**: Application initialized.
- **Post-conditions**: Application UI is returned/displayed.
- **Parameters**: None  
- **Return Value**: `JSX.Element`  
- **Exceptions Thrown**: None

---

## `AGENT_BOX`
### Purpose
Manages the display for individual agent responses.

### Data Fields
_None_

### Methods
#### `handle_continue(): void`
- **Purpose**: Proceed to the next chapter generation with this specificied agent response.
- **Pre-conditions**: Agents must be done streaming previous response.
- **Post-conditions**: Streaming for next chapter apparent.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

---

## `AGENT_SELECTION`
### Purpose
Manages agent-related actions: selecting, adding, removing agents.

### Data Fields
_None_

### Methods
#### `handle_confirm(): void`
- **Purpose**: Confirm selected agents.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

#### `handle_agent_change(): void`
- **Purpose**: Change selected agent.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

#### `handle_add_agent(): void`
- **Purpose**: Add a new agent.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

#### `handle_remove_agent(): void`
- **Purpose**: Remove an existing agent slot.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

#### `get_options(): void`
- **Purpose**: Fetch available agent options.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

---

## `AGENT_THOUGHTS`
### Purpose
Displays or handles agent-generated thoughts about their response.

### Data Fields / Methods
_None currently defined_

---

## `BEST_RESPONSE`
### Purpose
Displays highest voted response and nothing else.

### Methods
#### `handle_continue(): void`
- **Purpose**: Generate next chapter with this response.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

---

## `CHAPTER_LIST`
### Purpose
Displays list of chapters and allows navigation.

### Methods
#### `handle_chapter_click(): void`
- **Purpose**: Navigate to clicked chapter.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

#### `handle_view_entire_story(): void`
- **Purpose**: Navigate to entire story view.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

---

## `CHAPTER_VIEW`
### Purpose
Displays selected chapter.

---

## `CREATE_ACCOUNT`
### Purpose
Handles user registration.

### Methods
#### `handle_create_account(): void`
- **Purpose**: Submit and create a new account.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

#### `handle_login`
- **Purpose**: Redirect to login.
- **Exceptions Thrown**: None

---

## `LOGIN`
### Purpose
Handles login logic.

### Methods
#### `handle_login(): void`
- **Purpose**: Log in a user.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: On invalid credentials.

#### `handle_create_account(): void`
- **Purpose**: Redirect to account creation.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

---

## `HOME`
### Purpose
Base screen for no story selected.

---

## `MAIN_LAYOUT`
### Purpose
Contains shared structure like navbar, sidebars, and routing.

### Methods
#### `handle_logo_click(): void`
- **Purpose**: Navigate home when logo is clicked.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

---

## `PROTECTED_ROUTE`
### Purpose
Wraps routes that require authentication.

---

## `STORY_AGENTS_VIEW`
### Purpose
Displays selected agents and their responses and thoughts.

---

## `STORY_LIST`
### Purpose
Displays stories with delete and expand functionality.

### Methods
#### `handle_delete_click(): void`
- **Purpose**: Opt to delete story chosen.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

#### `handle_delete_confirm(): void`
- **Purpose**: Confirm deletion of story.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: On backend failure or access issues.

#### `toggle_expand(): void`
- **Purpose**: Expand dropdown of story.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: None

---

## `STORY_PROMPT_BOX`
### Purpose
Handles user input for story prompts.

### Methods
#### `handle_submit(): void`
- **Purpose**: Submit the entered prompt.
- **Parameters**: None  
- **Return Value**: `void`  
- **Exceptions Thrown**: On empty or invalid prompt

---

## `STORY_VIEW`
### Purpose
Displays a story for viewing.

---
## Backend Class Diagram
```mermaid
  classDiagram
    class Frontend {
    }

    class Agent {
        +structured_send_off(agent_graph, message)
        +stream_send_off(res, agent_graph, formatted_input)
    }

    class LLM {
    }

    class Courier {
        +determine_best_result(votes)
        +db_store(step, user_id, story_id, chapter_number, db_data, res)
        +aggregateHandler(req, res)
    }

    class Translator {
        +translateHandler(req, res)
    }

    class AgentController {
        +agent_list(req, res, next)
        +agent_detail(req, res, next)
        +agent_create_post(req, res, next)
        +agent_delete_post(req, res, next)
        +agent_update_post(req, res, next)
        +agent_update_last_response_post(req, res, next)
        +agent_get_last_response(req, res, next)
    }

    class PersonaController {
        +persona_list(req, res, next)
        +create_persona(req, res, next)
        +delete_persona(req, res, next)
    }

    class StoryController {
        +story_create(req, res, next)
        +user_stories_list(req, res, next)
        +story_details(req, res, next)
        +story_delete(req, res, next)
        +story_chapter_details(req, res, next)
        +story_name_update(req, res, next)
        +story_get_number_of_chapters(req, res, next)
        +story_add_outline(req, res, next)
        +story_add_agent_outlines(req, res, next)
        +story_add_critique(req, res, next)
        +story_add_agent_critiques(req, res, next)
        +story_add_chapter(req, res, next)
        +story_add_agent_chapter(req, res, next)
        +story_agent_chapter_edit(req, res, next)
        +story_agent_critique_edit(req, res, next)
        +story_get_critique(req, res, next)
        +story_agent_chapter_votes(req, res, next)
        +story_get_outline(req, res, next)
        +story_agents_list(req, res, next)
        +story_get_generate_outline_details(req, res, next)
        +story_get_critique_outline_details(req, res, next)
        +story_get_rewrite_outline_details(req, res, next)
        +story_get_first_chapter_details(req, res, next)
        +story_get_next_chapter_details(req, res, next)
        +story_get_critique_chapter_details(req, res, next)
        +story_get_rewrite_chapter_details(req, res, next)
        +story_get_step(req, res, next)
        +story_update_step(req, res, next)
    }

    class UserController {
        +create_user(req, res, next)
        +user_login(req, res, next)
        +user_delete(req, res, next)
        +user_update(req, res, next)
        +user_details(req, res, next)
    }

    class Database {
    }

    Frontend ..> Translator
    Frontend ..> UserController
    Frontend ..> PersonaController

    Translator ..> Courier
    Translator ..> StoryController
    Translator ..> PersonaController

    Courier ..> Agent
    Courier ..> StoryController

    Agent ..> LLM

    StoryController ..> Database
    UserController ..> Database
    PersonaController ..> Database
    AgentController ..> Database
```

## Courier Class:
**Purpose**: The only class which will have several instances of itself running. It’s also the only class which directly accesses the LLM. Its main goal is to send prompts assembled by PromptAdmin from information sent by Translator in order to get input to further refine.

### Data Fields:
- `style: String`: PLACEHOLDER
- `prompt_info: JSON`: Information stored as a JSON var grabbed directly from the database and sent here from Translator. This will be cited constantly by the Courier instance to remind itself which agent it’s representing.
- `JUDGING: int`: PLACEHOLDER
- `INSTANCENUM: int`: The order an instance has in relation to the rest of the instances (4 indicates it’s the fourth instance, 3 if it’s third).
- `API_KEY: String`: Points to the key which accesses the LLM (will NOT be stored here)
- `local_story: String`: A copy of the original generated story the instance made in its first API call. Can be used for refinement and comparison.

### Methods:
#### `story_call(int PLACEHOLDER, String key, String prompt): JSON` - Sends the finished prompt over to the LLM, places the output locally (if it’s the first time) and in the shared data structure. 

#### `story_push(String local_story) : void` - PLACEHOLDER

#### `judge(): LinkedList` - Replaces the chapterbank structure in Translator with a new, ranked version no longer corresponding to instance numbers but to quality. The LLM will rank the chapters for us and this function will format the output to be presentable for React.

---

## Prompt_Admin Class:
**Purpose**: The final step in the pipeline between accessing database agent info and communicating with the LLM. It assembles a prompt based on some templates which serve different purposes (i.e., generation, critique, and judgement). Only Courier will access this class, and it will send it information it’s sent by Translator.

### Data Fields:
- `refineprompt: String`: Template for chapter refinement. Relevant information will be added to this and the rest of these fields in getprompt.
- `generateprompt: String`: Template for chapter generation.
- `rankprompt: String`: Template for ranking ALL chapters after refinement is done.

### Methods:
#### `get_prompt(String promptinfo, String type): String` - Assembles a prompt by placing keywords in the promptinfo JSON object into one of the templates above, with ‘type’ deciding which to use.

---

## DB_Tracker Class:
**Purpose**: The class that handles all database access. It is a CRUD API can grab any information from any table in the database for other classes to use, be it for login verification or prompt history.

### Data Fields:
- `DB_key: String`: Field which links to the DB (obviously the key itself will not be stored here).

### Methods:
#### `DB_grab(): JSON` - PLACEHOLDER

#### `accountgrab(JSON info): JSON` -  Checks to see if account info is in the database. Used for login/signup.

#### `agent_grab(): JSON` - Checks if an agent is in the database and grabs all style and prompt info from its entry. This will be returned to the frontend.

#### `new_account(): JSON` - Creates a new account in the database. Returns necessary login info.

#### `new_agent(): JSON` - Creates a new agent based on information entered in the frontend. This will be formatted and posted to one of the tables as a new entry that can be cited.

#### `agent_dropdown(): JSON` - Returns all agents in the database for user selection. 

---

## Translator Class:
**Purpose**: Superclass which is responsible for handling the output of the Courier instances and communicating with the frontend web pages. It is the only class those pages will communicate with directly in the backend besides DB_Tracker. Inside of it is a shared data structure where the instances store their chapters, as well as functions to rank, format and return a chapter.

### Data Fields:
- `story_bank: Map` - Holds keys indicating which instance the  content belongs to, and values containing JSON objects grabbed from the LLM. This will be used to store final chapters as well as being a hub from which instances can judge each other’s products.
- `agent_instances: int` - Keeps track of the number of Courier instances accessing the LLM. In case this can be set by the user later (or in case we want to return ALL of the chapters at once) the user can cite this field.

### Methods:
#### `text_box(): String` - Stores input from frontend text box

#### `rank_format(): void` - PLACEHOLDER

#### `writing_session(): void` - Creates all couriers, has them write and refine stories, and picks one to be the final judge.

#### `write_chapter(input: JSON): JSON` - Takes input from the frontend and sends it to the Courier instances. The courier instances will return their chapters to chapterbank.

#### `make_courier(): int` - Creates an instance of the Courier class. Returns the instance’s assigned number and key in the chapterbank.

#### `get_story_bank(): LinkedList` - Returns the entire chapter bank.
