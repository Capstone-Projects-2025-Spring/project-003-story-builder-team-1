"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[1452],{24282:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>r,default:()=>l,frontMatter:()=>a,metadata:()=>o,toc:()=>d});var i=n(74848),s=n(28453);const a={sidebar_position:1},r=void 0,o={id:"system-architecture/Design",title:"Design",description:"Frontend Class Diagram",source:"@site/docs/system-architecture/Design.md",sourceDirName:"system-architecture",slug:"/system-architecture/Design",permalink:"/project-003-story-builder-team-1/docs/system-architecture/Design",draft:!1,unlisted:!1,editUrl:"https://github.com/Capstone-Projects-2025-Spring/project-003-story-builder-team-1/edit/main/documentation/docs/system-architecture/Design.md",tags:[],version:"current",lastUpdatedBy:"JawnnyD",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"docsSidebar",previous:{title:"System Architecture",permalink:"/project-003-story-builder-team-1/docs/category/system-architecture"},next:{title:"Development Environment",permalink:"/project-003-story-builder-team-1/docs/system-architecture/development-environment"}},c={},d=[{value:"Frontend Class Diagram",id:"frontend-class-diagram",level:2},{value:"Agent Drafting Process State Diagram",id:"agent-drafting-process-state-diagram",level:2},{value:"Sequence Diagrams",id:"sequence-diagrams",level:2},{value:"Account Creation",id:"account-creation",level:3},{value:"Account Deletion",id:"account-deletion",level:3},{value:"Agent Creation",id:"agent-creation",level:3},{value:"Selecting Writing Mode (Manual: user involvement, Automatic: no user involvement)",id:"selecting-writing-mode-manual-user-involvement-automatic-no-user-involvement",level:3},{value:"Selecting Involvement Options",id:"selecting-involvement-options",level:3},{value:"Initial Writing Process",id:"initial-writing-process",level:3},{value:"Editing Agent Work",id:"editing-agent-work",level:3},{value:"Viewing and Editing Chat History",id:"viewing-and-editing-chat-history",level:3},{value:"Voting for Stories",id:"voting-for-stories",level:3},{value:"Vetoing Stories",id:"vetoing-stories",level:3},{value:"Critiquing Stories",id:"critiquing-stories",level:3},{value:"AI Agent Ecosystem",id:"ai-agent-ecosystem",level:3}];function g(e){const t={h2:"h2",h3:"h3",img:"img",mermaid:"mermaid",p:"p",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h2,{id:"frontend-class-diagram",children:"Frontend Class Diagram"}),"\n",(0,i.jsx)(t.mermaid,{value:"classDiagram\n    class App {\n        -user_session: User\n        +render()\n        +set_user_session(user: User) void\n    }\n\n    class Login_Page {\n        -username: string\n        -password: string\n        +handle_login() void\n        +validate_input() boolean\n        +display_error_message() void\n        +redirect_to_home_page() void\n    }\n\n    class Home_Page {\n        -user_stories: Story[]\n        +show_story_list() void\n        +create_new_story() void\n        +open_agent_creation_modal() void\n        +open_agent_selection_modal() void\n    }\n\n    class Agent_Creation {\n        -agent_name: string\n        +create_agent() void\n        +confirm_agent_creation() void\n        +show_success_message() void\n    }\n\n    class Agent_Selection {\n        -available_agents: Agent[]\n        -selected_agents: Agent[]\n        +display_available_agents() void\n        +select_agent() void\n        +remove_agent() void\n        +display_selected_agents() void\n    }\n\n    class Story_Writing {\n        -current_chapter: int\n        -story_prompt: string\n        -agent_versions: string[]\n        -critique: string\n        +display_story() void\n        +collect_votes() void\n        +show_agent_chapters() void\n        +display_voting_results() void\n        +submit_critique() void\n        +select_chapter_to_critique() void\n        +display_revised_chapter() void\n    }\n\n    class Story {\n        -story_title: string\n        -chapters: Chapter[]\n    }\n\n    class Chapter {\n        -chapter_number: int\n        -chapter_title: string\n        -chapter_content: string\n    }\n\n    class User {\n        -username: string\n        -auth_token: string\n    }\n\n    class Agent {\n        -agent_name: string\n    }\n\n    App --\x3e User : uses\n    App --\x3e Login_Page : renders\n    App --\x3e Home_Page : renders\n    Login_Page --\x3e Home_Page : navigates to\n    Home_Page --\x3e Story : uses\n    Story --\x3e Chapter : uses\n    Home_Page --\x3e Agent_Creation : contains\n    Home_Page --\x3e Agent_Selection : contains\n    Agent_Selection --\x3e Agent : uses\n    Home_Page --\x3e Story_Writing : contains"}),"\n",(0,i.jsx)(t.h2,{id:"agent-drafting-process-state-diagram",children:"Agent Drafting Process State Diagram"}),"\n",(0,i.jsx)(t.mermaid,{value:"stateDiagram-v2\n   [*] --\x3e Story_Drafting: Agents Receives User Story Prompt\n\n  Story_Drafting: Story Drafting\n  state Story_Drafting {\n     state is_finished <<choice>>\n     [*] --\x3e is_finished\n\n     is_finished --\x3e Chapter_Drafting: If There are still Chapters to be Written\n\n     Chapter_Drafting: Chapter Drafting\n     state Chapter_Drafting{\n        state is_satisfied <<choice>>\n        [*] --\x3e is_satisfied\n        \n        is_satisfied --\x3e Draft: If the User is Not Yet Satisfied with Draft Quality or Drafts Have Not Yet Been Generated\n        Draft: Agents Write Drafts\n\n        Draft --\x3e Vote: User May Participate in the Draft Writing Process\n        Vote: Agents Vote on which story they believe to be the best\n\n        Vote --\x3e Critique: User May Veto the Vote with Their Own Preference\n        Critique: Agents give critiques of Winning Draft\n\n        Critique --\x3e Critique_Vote: User May Add Critiques of Their Own\n        Critique_Vote: Agents Vote on which Critiques to Focus\n\n        Critique_Vote --\x3e is_satisfied: User May Select Critiques that the Agents did not Select\n\n        is_satisfied --\x3e [*]: If the Chapter Draft is to the User's Satisfaction\n     }\n\n     Chapter_Drafting --\x3e is_finished\n\n     is_finished --\x3e [*]: If All Chapters Requested are Completed\n        \n  }\n\n  Story_Drafting --\x3e [*]: Story is Saved\n"}),"\n",(0,i.jsx)(t.h2,{id:"sequence-diagrams",children:"Sequence Diagrams"}),"\n",(0,i.jsx)(t.h3,{id:"account-creation",children:"Account Creation"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/a3726231-ee86-45f3-a440-ff35f56d238e",alt:"Account Creation Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"account-deletion",children:"Account Deletion"}),"\n",(0,i.jsx)(t.p,{children:"Please refer to the Account Creation Diagram before looking at the Account Deletion."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/7baae06e-798d-4996-b338-453ffe22a7e1",alt:"Account Deletion Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"agent-creation",children:"Agent Creation"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/8089b7f3-8ea1-4931-b2a4-8f71baebd486",alt:"Agent Creation Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"selecting-writing-mode-manual-user-involvement-automatic-no-user-involvement",children:"Selecting Writing Mode (Manual: user involvement, Automatic: no user involvement)"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/43c4f354-2a91-4150-ba62-5b6dbf15bc64",alt:"Manual vs Automatic Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"selecting-involvement-options",children:"Selecting Involvement Options"}),"\n",(0,i.jsx)(t.p,{children:"Please refer to the Selecting Writing Mode sequence diagram as this is a continuation."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/bf2543e1-3738-4a96-b3f6-413b2aa71735",alt:"Involvement Options Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"initial-writing-process",children:"Initial Writing Process"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/cd6b3dad-c2c2-4e6b-b6ca-acf07bb46919",alt:"Initial Writing Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"editing-agent-work",children:"Editing Agent Work"}),"\n",(0,i.jsx)(t.p,{children:"Please refer to the Initial Writing Process sequence diagram as this is a continuation."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/905326e6-947b-49ac-8291-d5352aa3f13b",alt:"Editing Agent Work Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"viewing-and-editing-chat-history",children:"Viewing and Editing Chat History"}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/c527ef8e-dbd2-4897-8225-efc3a2095549",alt:"Viewing and Editing Chat History Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"voting-for-stories",children:"Voting for Stories"}),"\n",(0,i.jsx)(t.p,{children:"Please refer to the Initial Writing Process sequence diagram as this is a continuation."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/7c5665b3-85f3-4865-aeb7-3ccc3773c275",alt:"Voting for Stories Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"vetoing-stories",children:"Vetoing Stories"}),"\n",(0,i.jsx)(t.p,{children:"Please refer to the Initial Writing Process sequence diagram as this is a continuation."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/59c247df-944b-42f7-8c63-15e8cbeaf4e9",alt:"Vetoing Stories Sequence Diagram drawio"})}),"\n",(0,i.jsx)(t.h3,{id:"critiquing-stories",children:"Critiquing Stories"}),"\n",(0,i.jsxs)(t.p,{children:["Please refer to the Initial Writing Process sequence diagram as this is a continuation.\n",(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/f7a3d559-95c9-45b5-a69c-094d10144f6d",alt:"Critiquing Stories Sequence Diagram drawio"})]}),"\n",(0,i.jsx)(t.h3,{id:"ai-agent-ecosystem",children:"AI Agent Ecosystem"}),"\n",(0,i.jsx)(t.p,{children:"Please refer to the Initial Writing Process sequence diagram as this is a continuation."}),"\n",(0,i.jsx)(t.p,{children:(0,i.jsx)(t.img,{src:"https://github.com/user-attachments/assets/c4f0fe27-5232-4b37-9503-4697e3c2ff80",alt:"AI Agent Backend Sequence Diagram drawio"})})]})}function l(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(g,{...e})}):g(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>o});var i=n(96540);const s={},a=i.createContext(s);function r(e){const t=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function o(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:r(e.components),i.createElement(a.Provider,{value:t},e.children)}}}]);