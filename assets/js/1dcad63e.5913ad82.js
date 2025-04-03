"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[2994],{95156:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>i,default:()=>p,frontMatter:()=>s,metadata:()=>o,toc:()=>d});var a=t(74848),r=t(28453);const s={sidebar_position:3},i="Sequence Diagrams",o={id:"system-architecture/sequence-diagrams",title:"Sequence Diagrams",description:"Use Case 1: Account Creation",source:"@site/docs/system-architecture/sequence-diagrams.md",sourceDirName:"system-architecture",slug:"/system-architecture/sequence-diagrams",permalink:"/project-003-story-builder-team-1/docs/system-architecture/sequence-diagrams",draft:!1,unlisted:!1,editUrl:"https://github.com/Capstone-Projects-2025-Spring/project-003-story-builder-team-1/edit/main/documentation/docs/system-architecture/sequence-diagrams.md",tags:[],version:"current",lastUpdatedBy:"NocKtuRn4L",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"docsSidebar",previous:{title:"Use Case Diagram",permalink:"/project-003-story-builder-team-1/docs/system-architecture/use-case-diagram"},next:{title:"State Diagram",permalink:"/project-003-story-builder-team-1/docs/system-architecture/state-diagram"}},c={},d=[{value:"Use Case 1: Account Creation",id:"use-case-1-account-creation",level:2},{value:"Use Case 2: Agent Creation",id:"use-case-2-agent-creation",level:2},{value:"Use Case 3: Agent Deletion",id:"use-case-3-agent-deletion",level:2},{value:"Use Case 4: Viewing History",id:"use-case-4-viewing-history",level:2},{value:"Use Case 5: Editing Agent Work",id:"use-case-5-editing-agent-work",level:2},{value:"User Case 6: Vetoing Agent Votes",id:"user-case-6-vetoing-agent-votes",level:2},{value:"Use Case 7: Agent Story Generation",id:"use-case-7-agent-story-generation",level:2},{value:"Use Case 8: Agent Voting",id:"use-case-8-agent-voting",level:2},{value:"Use Case 9: Agent Critiquing",id:"use-case-9-agent-critiquing",level:2},{value:"Use Case 10: Agent Editing",id:"use-case-10-agent-editing",level:2},{value:"User-to-Agent Generation Pipeline",id:"user-to-agent-generation-pipeline",level:2}];function u(e){const n={a:"a",h1:"h1",h2:"h2",li:"li",mermaid:"mermaid",ol:"ol",p:"p",...(0,r.R)(),...e.components};return(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)(n.h1,{id:"sequence-diagrams",children:"Sequence Diagrams"}),"\n",(0,a.jsx)(n.h2,{id:"use-case-1-account-creation",children:"Use Case 1: Account Creation"}),"\n",(0,a.jsx)(n.mermaid,{value:'sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    participant Database\n    User->>+Frontend: User clicks "Sign Up"\n    Frontend--\x3e>User: Redirect to Registration page\n    loop Until valid email is provided\n        User->>Frontend: User enters login information\n        Frontend->>+Backend: Send credentials for authentication\n        Backend->>+Database: Check Database for email\n        alt if Email exists\n            Database--\x3e>Backend: Returns existing email\n            Backend--\x3e>Frontend: Authentication failure response\n            Frontend--\x3e>User: "User already exists error" message\n            Frontend--\x3e>User: Prompts User to try again\n        else if Email does not exist\n            Database--\x3e>Backend: Returns no email\n            Backend--\x3e>Frontend: Authentication success response\n            Frontend--\x3e>User: "Account successfully created" message\n            Frontend--\x3e>User: Redirect to Login Page\n        end\n    end\n    deactivate Database\n    deactivate Backend\n    deactivate Frontend'}),"\n",(0,a.jsx)(n.h2,{id:"use-case-2-agent-creation",children:"Use Case 2: Agent Creation"}),"\n",(0,a.jsx)(n.mermaid,{value:'sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    participant LLM\n    participant Database\n    User->>+Frontend: User clicks "Create Agent"\n    Frontend--\x3e>User: Prompts User for writing style\n    opt Writing Style Preferences\n    User->>Frontend: User specifies writing style\n    end\n    Frontend->>+Backend: Agent creation request\n    Backend->>+Database: Search for Agent context\n    alt if Agent context in Database\n        Database--\x3e>Backend: Returns Agent context\n    else if Agent context is not in Database\n        Database--\x3e>Backend: Returns empty cursor\n        Backend->>+LLM: Search for Agent context request\n        LLM--\x3e>-Backend: Returns Agent context\n        Backend->>Database: Add Agent context\n        Database--\x3e>-Backend: Returns document with entry ID\n    end\n    Backend--\x3e>-Frontend: Request successful response\n    Frontend--\x3e>User: "Agent successfully created" message\n    Frontend--\x3e>-User: Opens Agent popup modal'}),"\n",(0,a.jsx)(n.h2,{id:"use-case-3-agent-deletion",children:"Use Case 3: Agent Deletion"}),"\n",(0,a.jsx)(n.mermaid,{value:'sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    User->>+Frontend: User clicks "Agents"\n    Frontend--\x3e>User: Opens Agents popup modal\n    User->>Frontend: User clicks desired Agent\n    Frontend--\x3e>User: Opens specific Agent Menu modal\n    User->>Frontend: User clicks "Delete Agent"\n    Frontend->>+Backend: Agent deletion request\n    alt if Deletion was successful\n        Backend--\x3e>Frontend: Returns "Agent successfully deleted" response\n    else if Deletion was unsuccessful\n        Backend--\x3e>-Frontend: Returns "Error: Unable to Delete Agent" error response\n    end\n    Frontend--\x3e>-User: Shows returned response'}),"\n",(0,a.jsx)(n.h2,{id:"use-case-4-viewing-history",children:"Use Case 4: Viewing History"}),"\n",(0,a.jsx)(n.mermaid,{value:"sequenceDiagram\n    participant User\n    participant Frontend\n    User->>+Frontend: User clicks desired story\n    Frontend--\x3e>User: Opens story page\n    User->>Frontend: User clicks desired chapter\n    Frontend--\x3e>User: Opens chapter page with full history\n    User->>Frontend: User scrolls to view story history\n    deactivate Frontend"}),"\n",(0,a.jsx)(n.h2,{id:"use-case-5-editing-agent-work",children:"Use Case 5: Editing Agent Work"}),"\n",(0,a.jsxs)(n.p,{children:["This diagram assumes the sequence of events in ",(0,a.jsx)(n.a,{href:"#use-case-7-agent-story-generation",children:"Agent Story Generation"})," sequence diagram."]}),"\n",(0,a.jsxs)(n.p,{children:["This diagram follows the ",(0,a.jsx)(n.a,{href:"#use-case-4-viewing-history-sequence-diagram",children:"Viewing History"})," sequence diagram for finding the desired agent work to edit."]}),"\n",(0,a.jsx)(n.mermaid,{value:'sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    participant Database\n    User->>+Frontend: User clicks "Edit"\n    Frontend--\x3e>User: Opens text box for editing\n    User->>Frontend: Edits Agent work with desired changes\n    Frontend->>+Backend: Edit request with desired changes\n    Backend->>+Database: Get Request for the story\n    Database--\x3e>-Backend: Return story JSON\n    Backend->>+Database: Add Request for new story (Copied story until change + desired change)\n    Database--\x3e>-Backend: Returns document containing status of operation\n    Backend--\x3e>-Frontend: Return updated Agent work with desired changes\n    Frontend--\x3e>-User: Display updates and remove any history after changes from story chat'}),"\n",(0,a.jsx)(n.h2,{id:"user-case-6-vetoing-agent-votes",children:"User Case 6: Vetoing Agent Votes"}),"\n",(0,a.jsxs)(n.p,{children:["This diagram assumes the sequence of events in ",(0,a.jsx)(n.a,{href:"#use-case-7-agent-story-generation",children:"Agent Story Generation"})," sequence diagram."]}),"\n",(0,a.jsx)(n.mermaid,{value:"sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    participant Database\n    User->>+Frontend: The user clicks on desired voted upon result\n    Frontend--\x3e>User: Opens popup modal containing each Agents individual work for chosen result\n    User->>Frontend: The user clicks veto on the specifc Agent contribution they prefer\n    Frontend->>+Backend: Send Update Request with the ID of the desired Agent work.\n    Backend->>+Database: Update Request (Change ID reference to the desired Agent work)\n    Database--\x3e>-Backend: Returns document containing entry ID\n    Backend--\x3e>-Frontend: Return the new Agent work selected via the veto. \n    Frontend--\x3e>-User: Display the new chosen Agent work. "}),"\n",(0,a.jsx)(n.h2,{id:"use-case-7-agent-story-generation",children:"Use Case 7: Agent Story Generation"}),"\n",(0,a.jsx)(n.mermaid,{value:'sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    participant LLM\n    participant Database\n    User->>+Frontend: User selects "Generate Story"\n    Frontend--\x3e>User: Opens up a prompt popup modal\n    User->>Frontend: User enters necessary information (number of chapters, story subject/synopsis, any extra criteria)\n    Loop For every Agent\n    Frontend->>+Backend: Sends generation request allow with inputted information\n    Backend->>+LLM: Generate Request with formatted prompt\n    LLM--\x3e>-Backend: Returns generated chapter response as a JSON\n    Backend->>+Database: Add Request for newly generated story chapter\n    Database--\x3e>-Backend: Returns document containing status of operation\n    end\n    Backend--\x3e>-Frontend: Return all Agent chapters\n    Frontend--\x3e>-User: Display all Agent chapters'}),"\n",(0,a.jsx)(n.h2,{id:"use-case-8-agent-voting",children:"Use Case 8: Agent Voting"}),"\n",(0,a.jsxs)(n.p,{children:["This diagram assumes the sequence of events in ",(0,a.jsx)(n.a,{href:"#use-case-7-agent-story-generation",children:"Agent Story Generation"})," sequence diagram."]}),"\n",(0,a.jsx)(n.mermaid,{value:"sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    participant LLM\n    participant Database\n    activate Frontend\n    activate Backend\n    loop For every Agent\n        Backend->>+LLM: Vote Request (Provides every other Agents' work)\n        LLM--\x3e>-Backend: Returns casted vote\n    end\n    Backend->>+Database: Update Request (Change reference in story entry to the most-voted Agent work)\n    Database--\x3e>-Backend: Returns document with the operation status\n    Backend--\x3e>-Frontend: Return most-voted Agent work\n    Frontend--\x3e>-User: Display the most-voted Agent work"}),"\n",(0,a.jsx)(n.h2,{id:"use-case-9-agent-critiquing",children:"Use Case 9: Agent Critiquing"}),"\n",(0,a.jsx)(n.p,{children:"This diagram assumes the sequence of events in the following sequence diagrams in the following order:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"#use-case-7-agent-story-generation",children:"Agent Story Generation"})}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"#use-case-8-agent-voting",children:"Agent Voting"})," on the generated chapters"]}),"\n"]}),"\n",(0,a.jsx)(n.mermaid,{value:'sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    participant LLM\n    participant Database\n    User->>+Frontend: User clicks "Continue" to move to critiquing step\n    Frontend->>+Backend: Critiquing start signal\n    loop For every Agent\n        Backend->>+LLM: Critique Request (Passes most-voted Agent chapter for critiquing)\n        LLM--\x3e>-Backend: Returns critique of most-voted chapter as a JSON\n        Backend->>+Database: Add Request (Store each critique as new entry)\n        Database--\x3e>-Backend: Returns document with the operation status\n    end\n    Backend--\x3e>-Frontend: Returns all Agent critiques of most-voted chapter\n    Frontend--\x3e>-User: Displays all Agent critiques'}),"\n",(0,a.jsx)(n.h2,{id:"use-case-10-agent-editing",children:"Use Case 10: Agent Editing"}),"\n",(0,a.jsx)(n.p,{children:"This diagram assumes the sequence of events in the following sequence diagrams in the following order:"}),"\n",(0,a.jsxs)(n.ol,{children:["\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"#use-case-7-agent-story-generation",children:"Agent Story Generation"})}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"#use-case-8-agent-voting",children:"Agent Voting"})," on the generated chapters"]}),"\n",(0,a.jsx)(n.li,{children:(0,a.jsx)(n.a,{href:"#use-case-9-agent-critiquing",children:"Agent Critiquing"})}),"\n",(0,a.jsxs)(n.li,{children:[(0,a.jsx)(n.a,{href:"#use-case-8-agent-voting",children:"Agent Voting"})," on the generated critiques"]}),"\n"]}),"\n",(0,a.jsx)(n.mermaid,{value:'sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend\n    participant LLM\n    participant Database\n    User->>+Frontend: User clicks "Continue" to move to editing step\n    Frontend->>+Backend: Editing start signal\n    loop For every Agent\n        Backend->>+LLM: Edit Request (Passes most-voted chapter and critique for editing)\n        LLM--\x3e>-Backend: Returns edited most-voted chapter as a JSON\n        Backend->>+Database: Add Request (Store each chapter as new entry)\n        Database--\x3e>-Backend: Returns document with the operation status\n    end\n    Backend--\x3e>-Frontend: Returns all Agent edited most-voted chapter\n    Frontend--\x3e>-User: Displays all Agent edited chapters'}),"\n",(0,a.jsx)(n.h2,{id:"user-to-agent-generation-pipeline",children:"User-to-Agent Generation Pipeline"}),"\n",(0,a.jsx)(n.mermaid,{value:"sequenceDiagram\n    participant User\n    participant Frontend\n    participant Backend-Translator\n    participant Backend-Prompt_Admin\n    participant Courier\n    participant LLM\n\n    User->>+Frontend: Input prompt information\n    Frontend->>+Backend-Translator: POST /story_contents (Prompt Data)\n    Backend-Translator->>+Backend-Prompt_Admin: POST /prompt_admin (Prompt Data)\n    Backend-Prompt_Admin->>+Courier: POST /courier/storycall (Formatted Prompt Data)\n    Courier->>+LLM: Generate Story Request (Formatted Prompt Data)\n    LLM--\x3e>-Courier: Returns Generated story\n    Courier->>Backend-Translator: POST /courier_response (Generated Story Data) \n    Backend-Translator--\x3e>Courier: Returns response code\n    Courier--\x3e>-Backend-Prompt_Admin: Returns response code\n    Backend-Prompt_Admin--\x3e>-Backend-Translator: Returns response code\n    Backend-Translator--\x3e>-Frontend: Returns Generated Story Data\n    Frontend--\x3e>-User: Displays Generated Story Data"})]})}function p(e={}){const{wrapper:n}={...(0,r.R)(),...e.components};return n?(0,a.jsx)(n,{...e,children:(0,a.jsx)(u,{...e})}):u(e)}},28453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>o});var a=t(96540);const r={},s=a.createContext(r);function i(e){const n=a.useContext(s);return a.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:i(e.components),a.createElement(s.Provider,{value:n},e.children)}}}]);