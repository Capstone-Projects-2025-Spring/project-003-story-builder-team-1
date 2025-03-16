---
sidebar_position: 4
---

# State Diagram

## Agent Drafting Process
 ```mermaid
stateDiagram-v2
    [*] --> Story_Drafting: Agents Receives User Story Prompt

   Story_Drafting: Story Drafting
   state Story_Drafting {
      state is_finished <<choice>>
      [*] --> is_finished

      is_finished --> Chapter_Drafting: If There are still Chapters to be Written

      Chapter_Drafting: Chapter Drafting
      state Chapter_Drafting{
         state is_satisfied <<choice>>
         [*] --> is_satisfied
         
         is_satisfied --> Draft: If the User is Not Yet Satisfied with Draft Quality or Drafts Have Not Yet Been Generated
         Draft: Agents Write Drafts and Vote on Which Story They Believe to be the Best

         Draft --> Critique: User May Edit a Draft, Veto the Voting Process, or Agree to Continue the Process
         Critique: Agents Give Critiques of Winning Draft, and Vote on Which Critiques to Focus on

         Critique -->  is_satisfied: User Can Either Edit an Agent's Critique, Veto the Critique Vote, or Agree to Continue the Process

         is_satisfied --> [*]: If the Chapter Draft is to the User's Satisfaction
      }

      Chapter_Drafting --> is_finished

      is_finished --> [*]: If All Chapters Requested are Completed
         
   }

   Story_Drafting --> [*]: Story is Saved

```
