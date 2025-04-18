---
sidebar_position: 3
---
# Acceptance Tests

| Test ID | Actions/Steps | Notes/Expected Results
| -------- | ------- | -------
| 1 | **Invalid Prompt**: Go to the Home Page for Story Builder. Leave one of the required boxes empty and click "Send Prompt". | Check to see if the an error appears.
| 2 | **Generate an Outline**: Send a prompt with valid information and more than two chapter. Click "Send Prompt" only once and wait for the outline. | Check if redirected to a page with the story outline with the amount of specifed chapters
| 3 | **Check Agent Tab**: Click on the "Story 1" tab on the top right to open up a menu with other tabs. Click the "Agent" tab and check to see if you are rediected. | A box containing the individual response should be visible and scrollable.
| 4 | **Check Continue Button on Agent Tab**: Click the "Continue" button to generate the next prompt. | The page should update with the new prompt. Scroll in the box to view the first chapter.
| 5 | **Check Best Response Tab**: Click on the "Best Response" tab. If not visible click on "Story 1" tab first. Click the "Continue" button to generate chapter two. | Check if chapter 2 is visible within the response box on the screen.
| 6| **Check Best Response Continue Button**: Navigate to the "Best Response" page. Click the "Continue" button found on the best response page. | The next chapter should appear within the text box.
| 7 | **Veiw Story**: Click on "Story 1" tab. Then click on "View Story" tab. | The entire story should be on screen.
| 8 | **View Chapters**: Click on "Story 1" tab. Then click on "View Story" tab. On the right side, click on a chapter tab to view the individual chapter. | The entire generated chapter should be displayed
| 9 | **View Outline**: Click on "Story 1" tab. Then click on "View Story" tab. On the rightside , click on the "Outline" tab to view the outline. | The generated outline should be displayed.
| 10| **Check Disappearing Continue Button** Generate chapters one at a time until the amount of chapters originally specified in the prompt have been generated. Navigate to the "Best Response" page and the "Agent" page by clicking their tabs on the left. | Check if the "Continue" button is gone.
