---
sidebar_position: 1
---
## Agent Drafting Process State Diagram
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
## Sequence Diagrams

### Account Creation
![Account Creation Sequence Diagram drawio](https://github.com/user-attachments/assets/a3726231-ee86-45f3-a440-ff35f56d238e)

### Account Deletion
Please refer to the Account Creation Diagram before looking at the Account Deletion.

![Account Deletion Sequence Diagram drawio](https://github.com/user-attachments/assets/7baae06e-798d-4996-b338-453ffe22a7e1)

### Agent Creation
![Agent Creation Sequence Diagram drawio](https://github.com/user-attachments/assets/8089b7f3-8ea1-4931-b2a4-8f71baebd486)

### Selecting Writing Mode (Manual: user involvement, Automatic: no user involvement)
![Manual vs Automatic Sequence Diagram drawio](https://github.com/user-attachments/assets/43c4f354-2a91-4150-ba62-5b6dbf15bc64)

### Selecting Involvement Options
Please refer to the Selecting Writing Mode sequence diagram as this is a continuation.

![Involvement Options Sequence Diagram drawio](https://github.com/user-attachments/assets/bf2543e1-3738-4a96-b3f6-413b2aa71735)

**Purpose**

The Design Document - Part I Architecture describes the software architecture and how the requirements are mapped into the design. This document will be a combination of diagrams and text that describes what the diagrams are showing.

**Requirements**

In addition to the general requirements the Design Document - Part I Architecture will contain:

A description the different components and their interfaces. For example: client, server, database.

For each component provide class diagrams showing the classes to be developed (or used) and their relationship.

Sequence diagrams showing the data flow for _all_ use cases. One sequence diagram corresponds to one use case and different use cases should have different corresponding sequence diagrams.

Describe algorithms employed in your project, e.g. neural network paradigm, training and training data set, etc.

If there is a database:

Entity-relation diagram.

Table design.

A check list for architecture design is attached here [architecture\_design\_checklist.pdf](https://templeu.instructure.com/courses/106563/files/16928870/download?wrap=1 "architecture_design_checklist.pdf")  and should be used as a guidance.
