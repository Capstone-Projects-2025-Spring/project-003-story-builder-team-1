---
sidebar_position: 1
---
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
         
         is_satisfied --> Draft: If the User is not yet satisfied with Draft Quality or Drafts have not yet been generated
         Draft: Agents Write Drafts

         Draft --> Vote
         Vote: Agents Vote on which story they believe to be the best

         Vote --> Critique
         Critique: Agents give critiques of Winning Draft

         Critique --> Critique_Vote
         Critique_Vote: Agents vote on which Critiques to focus on

         Critique_Vote --> is_satisfied

         is_satisfied --> [*]: If the Chapter Draft is to the User's Satisfaction
      }

      Chapter_Drafting --> is_finished

      is_finished --> [*]: If All Chapters Requested are Completed
         
   }

   Story_Drafting --> [*]: Story is Saved

```
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
