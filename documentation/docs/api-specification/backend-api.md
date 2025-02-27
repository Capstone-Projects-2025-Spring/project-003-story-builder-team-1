---
sidebar_position: 1
---

# Backend API

## /courier
### POST /courier/story_call
### /courier/story_call
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

openapi: 3.0.0
```
info:
  title: Story Builder API
  version: 0.0.0
  description: API for communication between frontend user interface, LLM Agents, and MongoDB Database.
```
paths:
  /courier:
```  
    post:
      summary: Calls the LLM with a given prompt and returns text.
      operationId: story_call
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                PLACEHOLDER:
                  type: integer
                key:
                  type: string
                prompt:
                  type: string
      responses:
        '200':
          description: A story snippet
          content:
            application/json:
              schema:
                type: string

    post:
      summary: Pushes local story content to the system.
      operationId: story_push
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                local_story:
                  type: string
      responses:
        '200':
          description: Success

    get:
      summary: Invokes the judge() method to get a list of judgments/results
      operationId: judge
      responses:
        '200':
          description: A list of judgments
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
```
  /prompt_admin:
```  
    get:
      summary: Calls prompt(prompt_info) to fetch a prompt string.
      operationId: prompt
      parameters:
        - name: prompt_info
          in: query
          required: true
          schema:
            type: string
      responses:
        '200':
          description: A prompt string
          content:
            application/json:
              schema:
                type: string

    get:
      summary: Retrieves the refine_prompt property.
      operationId: refine_prompt
      responses:
        '200':
          description: A refine prompt string
          content:
            application/json:
              schema:
                type: string

    get:
      summary: Retrieves the generate_prompt property.
      operationId: generate_prompt
      responses:
        '200':
          description: A generate prompt string
          content:
            application/json:
              schema:
                type: string

    get:
      summary: Retrieves the rank_prompt property.
      operationId: rank_prompt
      responses:
        '200':
          description: A rank prompt string
          content:
            application/json:
              schema:
                type: string
```
  /db:
 ``` 
  /db/grab:
    get:
      summary: Calls DB_grab() to retrieve some global data.
      description: Retrieves global data.
      responses:
        '200':
          description: JSON data
          content:
            application/json:
              schema:
                type: object

  /db/account:
    get:
      summary: Retrieves account info given some input JSON.
      description: Retrieves account information based on a query input.
      parameters:
        - in: query
          name: account_query_info
          required: true
          schema:
            type: object
            description: JSON containing account query details.
      responses:
        '200':
          description: JSON account data
          content:
            application/json:
              schema:
                type: object

  /db/agent:
    get:
      summary: Retrieves agent info.
      description: Retrieves agent information.
      responses:
        '200':
          description: JSON agent data
          content:
            application/json:
              schema:
                type: object

  /db/new_account:
    post:
      summary: Creates a new account.
      description: Creates a new account in the database.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              description: JSON containing new account details.
      responses:
        '200':
          description: JSON status information
          content:
            application/json:
              schema:
                type: object

  /db/new_agent:
    post:
      summary: Creates a new agent.
      description: Creates a new agent in the database.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              description: JSON containing new agent details.
      responses:
        '200':
          description: JSON status information
          content:
            application/json:
              schema:
                type: object

  /db/agent_dropdown:
    get:
      summary: Returns a list of agents for a dropdown.
      description: Retrieves a list of agents suitable for use in a dropdown menu.
      responses:
        '200':
          description: JSON list of agents
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
```
  /translator:
  ```
    post:
      summary: Triggers the rank_format() method.
      operationId: rank_format
      responses:
        '200':
          description: Success

    post:
      summary: Starts or updates a writing session.
      operationId: writing_session
      responses:
        '200':
          description: Success

    post:
      summary: Writes a new chapter based on the input JSON.
      operationId: write_chapter
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                chapter_info:
                  type: object
      responses:
        '200':
          description: Chapter data
          content:
            application/json:
              schema:
                type: object

    get:
      summary: Retrieves the entire story bank as a list.
      operationId: story_bank
      responses:
        '200':
          description: A list of stories
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
