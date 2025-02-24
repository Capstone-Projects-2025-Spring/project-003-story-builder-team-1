---
sidebar_position: 1
---

# Backend API

## /courier
### POST /courier/story_call
**Description**: Calls the LLM with a given prompt and returns text.

#### Request Body/Params
- int PLACEHOLDER
- String key
- String prompt

#### Returns
String story_snippet

### POST /courier/story_push
**Description**: Pushes local story content to the system.

#### Request Body/Params
- String local_story

#### Returns
**200 OK** on success

### GET /courier/judge
**Description**: Invokes the judge() method to get a list of judgments/results

#### Request Body/Params
- None

#### Returns
JSON list_of_judgements
