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
         Draft: Agents Write Drafts

         Draft --> Vote: User May Participate in the Draft Writing Process
         Vote: Agents Vote on which story they believe to be the best

         Vote --> Critique: User May Veto the Vote with Their Own Preference
         Critique: Agents give critiques of Winning Draft

         Critique --> Critique_Vote: User May Add Critiques of Their Own
         Critique_Vote: Agents Vote on which Critiques to Focus

         Critique_Vote --> is_satisfied: User May Select Critiques that the Agents did not Select

         is_satisfied --> [*]: If the Chapter Draft is to the User's Satisfaction
      }

      Chapter_Drafting --> is_finished

      is_finished --> [*]: If All Chapters Requested are Completed
         
   }

   Story_Drafting --> [*]: Story is Saved

```
