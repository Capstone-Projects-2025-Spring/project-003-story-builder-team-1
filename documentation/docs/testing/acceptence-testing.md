---
sidebar_position: 3
---
# Acceptance Tests

| Test ID | Actions/Steps | Notes/Expected Results
| -------- | ------- | -------
| 1 | **Access Create Account Page**: Click the "Create Account" Button. | See if you are redirected to the Account Creation Page.
| 2 | **Create Account**: Fill in the fields for the Username, Password, and Confirm Password, and click the button. | See if you received the confirmation popup.
| 3 | **Login**: Fill in the Login fields with the appropriate information, and press hte button | Ensure you are now on the Home Page.
| 4 | **Generate New Story**: Click the "Generate New Story" button, and select/remove any Agents you want. | See if the fields for story information appear.
| 5 | **Agnet Amount LImit**: When selecting agents, ensure that you cannot have more than 5 agents created. | See if the ability to create new agents dissapears after five slots appear.
| 6 | **Generate Outline**: Fill out the required fields, and press the "Send Prompt" | Agent responses should begin to generate.
| 7 | **Check Agent Tab**: Ensure you are in the Agent Tab, and view the live response | Boxes containing the individual responses and thoughts should be visible, with larger popups available.
| 8 | **Check Continue Button on Agent Tab**: Click the "Continue" button to generate the next prompt. | The page should update with the new prompt. Scroll in the box to view the first chapter.
| 9 | **Check Best Response Tab**: Click on the "Best Response" tab. If not visible click on Story's tab first. Click the "Continue" button to generate chapter two. | Check if chapter 2 is visible within the response box on the screen.
| 10 | **View Story**: Click on the Story's tab. Then click on "View Story" tab. | The entire story should be on screen.
| 11 | **View Chapters**: Click on Story's tab. Then click on "View Story" tab. On the right side, click on a chapter tab to view the individual chapter. | The entire generated chapter should be displayed
| 12 | **View Outline**: Click on Story's tab. Then click on "View Story" tab. On the rightside , click on the "Outline" tab to view the outline. | The generated outline should be displayed.
| 13| **Check Disappearing Continue Button** Generate chapters one at a time until the amount of chapters originally specified in the prompt have been generated. Navigate to the "Best Response" page and the "Agent" page by clicking their tabs on the left. | Check if the "Continue" button is gone.
