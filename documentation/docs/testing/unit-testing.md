---
sidebar_position: 1
---
# Unit Tests
## Test Library

### Jest
The primary testing library is Jest. Jest is compatible with JavaScript, React, Node, and Express, making it the testing library for the Frontend and Backend. 

### Supertest
Supertest is also used to for testing. It simulates HTTP requests. This allows for testing the Backend without starting the server each time.

## Running the Backend Test Cases
1. Have Node installed on your machine
2. Run the following command when testing for the first time:
```bash
npm run setup
```
3. Run the first command to test the Backend, or run the second command to test the Backend and generate a coverage report:
```bash
npm run test:b
```
```bash
npm run test:bc
```
## Automatic Testing
On a pull request to main, the above testing process will applied through a workflow and will use the test:bc command to generate a coverage report, which is then pushed to the branch that is about to be merged into main.

On a push to main, the above testing process will be applied through a workflow and will use the test:b command to test that the merged code does not cause any issues when pushed to main.

#### [View Backend Test Coverage Report](https://htmlpreview.github.io/?https://github.com/Capstone-Projects-2025-Spring/project-003-story-builder-team-1/blob/main/documentation/docs/testing/lcov-report/index.html)
