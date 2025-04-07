[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=17857627)
<div align="center">

# Story Builder
### By Kamaljeeth Vijay, Edgardo Gonzalez, Dylan Cael, John Dang, Yousef Qari, and Christopher McGarrity
[![Report Issue on Jira](https://img.shields.io/badge/Report%20Issues-Jira-0052CC?style=flat&logo=jira-software)](https://temple-cis-projects-in-cs.atlassian.net/jira/software/c/projects/SBTA/issues?jql=project%20%3D%20%22SBTA%22%20ORDER%20BY%20created%20DESC)
[![Deploy Docs](https://github.com/ApplebaumIan/tu-cis-4398-docs-template/actions/workflows/deploy.yml/badge.svg)](https://github.com/Capstone-Projects-2025-Spring/project-003-story-builder-team-1/actions/workflows/deploy.yml)
[![Documentation Website Link](https://img.shields.io/badge/-Documentation%20Website-brightgreen)](https://capstone-projects-2025-spring.github.io/project-003-story-builder-team-1/)


</div>

## Project Overview

AI Story Builder Team 1

## Project Abstract

This design document describes a full-stack web application for an AI story generator with an efficient, highly customizable refinement system. These generated stories are organized via agents that take in the user’s prompt as input, and they will critique the AI-generated result after sending the prompt through an LLM. The app will then present these results to the user, who can vote on their favorite for further refinement or start a new session. After playing with this app, the user will feel better equipped with a myriad of options for learning how to refine and adjust AI-generated material, which is a critical step to successfully integrate this technology in workflows for professionals and hobbyists alike.

## Conceptual Design

The primary language used to code this application will be Javascript, with dependencies such as React.js and Express.js used for the frontend and backend, respectively. A MongoDB database will be used as a repository to organize the refinement history for every prompt the user generates, as well as a secure method of storing account information. The UI will include an account creation page, a prompt generation page, and a prompt history page, with an option to start a new session at any time. If a new session begins, the previous session will be on hold until it is reactivated. 

The amount of agents running at a time is scalable, and the user will decide how many agents it wants to run for each prompt. These agents will have access to the LLM that generates the content, and they will each refine and re-prompt these results before presenting them to the user. The user can continue this process indefinitely and the program will continually adjust the new results each time.

## Background

Many AI clients and web applications exist in order to make it easier for non-technical people to access this technology, such as ChatGPT and Deepseek’s websites. There are also plenty of programs the user can choose to locally host LLMs, like Ollama and Text Generation WebUI. These options usually either require too much setup for casual users or provide fewer customization options in the refinement process. ChatGPT, for example, will provide, at most, two agents at a time, and these agents only return the output without critiquing it themselves first. By including elements from both approaches to LLM interfaces, this application reaps the benefits of a technician-focused user experience with the ease of use of Llama and OpenAI’s web clients.

## How to Run Locally
1. Ensure that npm and Docker are installed on your system.
2. Clone the repository.
3. Ensure that Docker is running on your system.
4. Run the following: ``npm run setup``.
5. Next, run ``npm run build:f``.
6. Finally, run ``npm run start:con``.
7. Go to [localhost://8080](http://localhost:8080/), where you can locally view the project.

## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/JawnnyD">
            <img src="https://media.licdn.com/dms/image/v2/D5603AQFm7qBiz7RFJw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1677198760248?e=1745452800&v=beta&t=G1zs2Syy5fzCnQ5KwwJpphi0q95V1fuWplLmwP2-Nt4" width="100;" alt="DangJohn"/>
            <br />
            <sub><b>John Dang</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/leighflagg">
            <img src="https://avatars.githubusercontent.com/u/77810293?v=4" width="100;" alt="leighflagg"/>
            <br />
            <sub><b>Null</b></sub>
        </a>
    </td></tr>
</table>

[//]: # ( readme: collaborators -end )
