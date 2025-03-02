---
sidebar_position: 1
---
# Unit Tests
## Test Library

### Jest
The primary testing library is Jest. Jest is compatible with JavaScript, React, Node, and Express, making it the testing library for the Frontend and Backend. 

### Supertest
Supertest is also used to for testing. It simulates HTTP requests. This allows for testing the Backend without starting the server each time.

## Running the test cases
Copy the following commands from 2-7 in order to run the tests.
Note: The following npm installs only need to be run once each.
1. Have Node installed on your machine
2. Run the following Command
```bash
npm run setup
```
3. Run the first command for testing and the second for coverage
```bash
npm run test:b
```
```bash
npm run test:bc
```
## Automatic Testing
The above commands are run, and Node is installed each time a pull request is created to main and when code is pushed to main. If all the tests pass, then the pull request will be created successfully and the push will go through. 

#### [View Backend Test Coverage Report](documentation/docs/testing/lcov-report/index.html)
