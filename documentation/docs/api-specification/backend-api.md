---
sidebar_position: 1
---

# Backend API

## /courier
### <Highlight color="#1c70a4">POST</Highlight> /courier/story_call
**Description**: Calls the LLM with a given prompt and returns text.

#### Request Body/Params:
- int PLACEHOLDER
- String key
- String prompt

#### Returns:
String story_snippet

### POST /courier/story_push
**Description**: Pushes local story content to the system.

#### Request Body/Params:
- String local_story

#### Returns:
**200 OK** on success

### GET /courier/judge
**Description**: Invokes the judge() method to get a list of judgments/results

#### Request Body/Params:
- None

#### Returns:
JSON list_of_judgements

---

## /prompt_admin
### GET /prompt_admin/prompt
**Description**: Calls prompt(prompt_info) to fetch a prompt string.

#### Request Body/Params:
- String prompt_info

#### Returns:
String prompt

### GET /prompt_admin/refine_prompt
**Description**: Retrieves the refine_prompt property.

#### Request Body/Params:
- None

#### Returns:
String refine_prompt

### GET /prompt_admin/generate
**Description**: Retrieves the generate_prompt property.

#### Request Body/Params:
- None

#### Returns:
String generate_prompt

### GET /prompt_admin/rank
**Description**: Retrieves the rank_prompt property.

#### Request Body/Params:
- None

#### Returns:
String rank_prompt

---

## /db
### GET /db/grab
**Description**: Calls DB_grab() to retrieve some global data.

#### Request Body/Params:
- None

#### Returns:
JSON data

### GET db/account
**Description**: Retrieves account info given some input JSON.

#### Request Body/Params:
- JSON account_query_info

#### Returns:
JSON account_data

### GET /db/agent
**Description**: Retrieves agent info.

#### Request Body/Params:
- None

#### Returns:
JSON agent_data

### POST db/new_account
**Description**: Creates a new account.

#### Request Body/Params:
- JSON new_account_info

#### Returns:
JSON status_info

### POST db/new_agent
**Description**: Creates a new agent.

#### Request Body/Params:
- JSON new_agent_info

#### Returns:
JSON status_info

### GET /db/agent_dropdown
**Description**: Returns a list of agents for a dropdown.

#### Request Body/Params:
- None

#### Returns:
JSON list_of_agents

---

## /translator
### POST /translator/rank_format
**Description**: Triggers the rank_format() method.

#### Request Body/Params:
- None

#### Returns:
**200 OK** on success

### POST /translator/writing_session
**Description**: Starts or updates a writing session.

#### Request Body/Params:
- None

#### Returns:
**200 OK** on success

### POST /translator/write_chapter
**Description**: Writes a new chapter based on the input JSON.

#### Request Body/Params:
- JSON chapter_info

#### Returns:
JSON chapter_data

### GET /translator/story_bank
**Description**: Retrieves the entire story bank as a list.


#### Request Body/Params:
- None

#### Returns:
JSON list_of_stories
