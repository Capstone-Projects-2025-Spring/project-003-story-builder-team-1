---
sidebar_position: 1
---
# Unit tests
## Test Library

### Jest
The test Library in use is Jest. Jest is compatible with javascript, react, node, and express, making it the testing library for the frontend and backend. 

### Supertest
Supertest is also used to for testing. It simulates HTTP requests. This allows for testing the backend without starting the server each time.

## Running the test cases
Copy the following commands from 2-7 in order to run the tests.
Note: The following npm installs only need to be run once each.
1. Have node installed on your machine
2. cd storybuilder/Backend
3. npm install
4. cd ..
5. cd test
6. npm install
7. npm test

## Automatic Testing
The above commands are run, and node is installed each time a pull request is created to main and when code is pushed to main. If the tests all pass, then the pull request will be created successfully and or the push will go through. 
