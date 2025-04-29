[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-2972f46106e565e64193e422d61a12cf1da4916b45550586e14ef0a7c637dd04.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=17857627)
<div align="center">

# Story Builder
### By Kamaljeeth Vijay, Edgardo Juan González, Dylan Cael, John Dang, Yousuf Qari, and Christopher McGarrity
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

## Local Running Instructions:
1. Ensure that [npm & node](https://nodejs.org/en) and [Docker](https://www.docker.com/products/docker-desktop/) are installed on your system.
2. Clone the repository.
3. Ensure that [Docker](https://www.docker.com/products/docker-desktop/) is running on your system and that docker is open.
4. In the cloned repository, add the environment variables specified within to the .env file in the root.
5. MongoDB instructions: Please refer to the "Build Database" instructions below to fill in the DB_URL enviroment variable.
6. Run the following: ``npm run setup``.
7. Then run: ``npm run start:a``.
8. To stop it run: ``npm run stop:a``.

## Build Database

We chose MongoDB, and our database schemas reflect MongoDB's non-relational schema design. 
1. Add the MongoDB URI for your specific cluster and database to the .env file in the root and the one in storybuilder/Backend. This URI can be found in the MongoDB Atlas webpage instructions for a cluster. Follow the template and fill in the placeholder with your specific setup info: ``DB_URI = mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?retryWrites=true&w=majority&appName=<cluster-name>``
2. To populate the db with some agent personas like Shakespeare, Stephen King, etc., run the populate_personas.js script in the storybuilder/Backend directory using a command like this with your specific info: ``node populate_personsas "mongodb+srv://<username>:<password>@<cluster-address>/<database-name>?retryWrites=true&w=majority&appName=<cluster-name>"``

## Collaborators

[//]: # ( readme: collaborators -start )
<table>
<tr>
    <td align="center">
        <a href="https://github.com/JawnnyD">
            <img src="https://media.licdn.com/dms/image/v2/D5603AQFm7qBiz7RFJw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1677198760248?e=1751500800&v=beta&t=vpkZIET92cRZWlouoVjP8Kcj8rD3P_0IIWyzCCXVcuQ" width="100;" alt="DangJohn"/>
            <br />
            <sub><b>John Dang</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/EdJuanGonzalez">
            <img src="https://avatars.githubusercontent.com/u/114366772?v=4" width="100;" alt="GonzalezJEdgardo"/>
            <br />
            <sub><b>Edgardo Juan González</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/kjeeth04">
            <img src="https://avatars.githubusercontent.com/u/72448980?v=4" width="100;" alt="VijayKamaljeeth"/>
            <br />
            <sub><b>Kamaljeeth Vijay</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/CBerg333">
            <img src="https://avatars.githubusercontent.com/u/119720325?v=4" width="100;" alt="McGarrityChristopher"/>
            <br />
            <sub><b>Christopher McGarrity</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/qari7">
            <img src="https://avatars.githubusercontent.com/u/156926495?v=4" width="100;" alt="QariYousuf"/>
            <br />
            <sub><b>Yousuf Qari</b></sub>
        </a>
    </td>
    <td align="center">
        <a href="https://github.com/NocKtuRn4L">
            <img src="https://avatars.githubusercontent.com/u/133310401?v=4" width="100;" alt="CaelDylan"/>
            <br />
            <sub><b>Dylan Cael</b></sub>
        </a>
    </td>
</tr>
</table>

[//]: # ( readme: collaborators -end )

# Final Project Release - Story Builder Team 1

### Epic

[SBTA-12](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-12) Design Document

[SBTA-15](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-15) Requirements Document

[SBTA-31](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-31) Testing

[SBTA-32](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-32) Draft Development Interface

[SBTA-36](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-36) Database Configuration

[SBTA-51](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-51) Agent Writing

[SBTA-52](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-52) Account Configuration

[SBTA-53](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-53) User Draft Involvement Logic

[SBTA-54](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-54) Draft Management

[SBTA-61](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-61) Agent Voting

[SBTA-62](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-62) Agent Critiquing

[SBTA-64](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-64) Agent Initialization

[SBTA-70](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-70) Account Login

### Bug

[SBTA-143](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-143) Response Markdown

### Story

[SBTA-41](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-41) Agent Writing Voting Process

[SBTA-42](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-42) Agent Critiquing Process

[SBTA-45](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-45) Storing Final Draft

[SBTA-47](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-47) User Story Veto

[SBTA-49](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-49) Viewing Draft History

[SBTA-50](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-50) Editing Draft History

[SBTA-56](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-56) Agent Writing Process

[SBTA-57](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-57) User Draft Writing

[SBTA-58](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-58) Agent Critique Voting Process

[SBTA-67](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-67) Storing Draft History

[SBTA-113](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-113) Add Functionality of Adding, Deleting, and Updating from Database

[SBTA-115](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-115) Update Frontend Documentation

[SBTA-135](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-135) Regenerate Button

[SBTA-138](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-138) Update Backend Documentation

[SBTA-145](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-145) Story Dropdown Indicator

[SBTA-152](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-152) Fix Continue Button

[SBTA-153](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-153) Edit Button functionality

[SBTA-154](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-154) Agent history view

[SBTA-155](https://temple-cis-projects-in-cs.atlassian.net/browse/SBTA-155) Update Story Schema
