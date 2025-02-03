---
sidebar_position: 1
---
Project Abstract -
This design document describes a full-stack web application for an AI story generator with an efficient, highly customizable refinement system. These generated stories are organized via agents that take in the user’s prompt as input, and they will critique the AI-generated result after sending the prompt through an LLM. The app will then present these results to the user, who can vote on their favorite for further refinement or start a new session. After playing with this app, the user will feel better equipped with a myriad of options for learning how to refine and adjust AI-generated material, which is a critical step to successfully integrate this technology in workflows for professionals and hobbyists alike.



Conceptual Design -
The primary language used to code this application will be Javascript, with dependencies such as React.js and Express.js used for the frontend and backend, respectively. A SQL database will be used as a repository to organize the refinement history for every prompt the user generates, as well as a secure method of storing account information. The UI will include an account creation page, a prompt generation page, and a prompt history page, with an option to start a new session at any time. If a new session begins, the previous session will be on hold until it is reactivated. 

The amount of agents running at a time is scalable, and the user will decide how many agents it wants to run for each prompt. These agents will have access to the LLM that generates the content, and they will each refine and re-prompt these results before presenting them to the user. The user can continue this process indefinitely and the program will continually adjust the new results each time.



Background -
	Many AI clients and web applications exist in order to make it easier for non-technical people to access this technology, such as ChatGPT and Deepseek’s websites. There are also plenty of programs the user can choose to locally host LLMs, like Ollama and Text Generation WebUI. These options usually either require too much setup for casual users or provide fewer customization options in the refinement process. ChatGPT, for example, will provide, at most, two agents at a time, and these agents only return the output without critiquing it themselves first. By including elements from both approaches to LLM interfaces, this application reaps the benefits of a technician-focused user experience with the ease of use of Llama and OpenAI’s web clients.
