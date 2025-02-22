"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[7642],{95857:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>o,contentTitle:()=>d,default:()=>h,frontMatter:()=>l,metadata:()=>t,toc:()=>c});var i=n(74848),r=n(28453);const l={sidebar_position:2},d="Class Diagrams",t={id:"system-architecture/class-diagrams",title:"Class Diagrams",description:"Frontend Class Diagram",source:"@site/docs/system-architecture/class-diagrams.md",sourceDirName:"system-architecture",slug:"/system-architecture/class-diagrams",permalink:"/project-003-story-builder-team-1/docs/system-architecture/class-diagrams",draft:!1,unlisted:!1,editUrl:"https://github.com/Capstone-Projects-2025-Spring/project-003-story-builder-team-1/edit/main/documentation/docs/system-architecture/class-diagrams.md",tags:[],version:"current",lastUpdatedBy:"Kamaljeeth Vijay",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"docsSidebar",previous:{title:"Design",permalink:"/project-003-story-builder-team-1/docs/system-architecture/Design"},next:{title:"Sequence Diagrams",permalink:"/project-003-story-builder-team-1/docs/system-architecture/sequence-diagrams"}},o={},c=[{value:"Frontend Class Diagram",id:"frontend-class-diagram",level:2},{value:"App Class",id:"app-class",level:2},{value:"Data Fields:",id:"data-fields",level:3},{value:"Methods:",id:"methods",level:3},{value:"<code>render(): void</code>",id:"render-void",level:4},{value:"<code>set_user_session(user: User): void</code>",id:"set_user_sessionuser-user-void",level:4},{value:"Login_Page Class",id:"login_page-class",level:2},{value:"Data Fields:",id:"data-fields-1",level:3},{value:"Methods:",id:"methods-1",level:3},{value:"<code>handle_login(): void</code>",id:"handle_login-void",level:4},{value:"<code>validate_input(): boolean</code>",id:"validate_input-boolean",level:4},{value:"<code>display_error_message(): void</code>",id:"display_error_message-void",level:4},{value:"<code>redirect_to_home_page(): void</code>",id:"redirect_to_home_page-void",level:4},{value:"Home_Page Class",id:"home_page-class",level:2},{value:"Data Fields:",id:"data-fields-2",level:3},{value:"Methods:",id:"methods-2",level:3},{value:"<code>show_story_list(): void</code>",id:"show_story_list-void",level:4},{value:"<code>create_new_story(): void</code>",id:"create_new_story-void",level:4},{value:"<code>open_agent_creation_modal(): void</code>",id:"open_agent_creation_modal-void",level:4},{value:"<code>open_agent_selection_modal(): void</code>",id:"open_agent_selection_modal-void",level:4},{value:"Agent_Creation Class",id:"agent_creation-class",level:2},{value:"Data Fields:",id:"data-fields-3",level:3},{value:"Methods:",id:"methods-3",level:3},{value:"<code>create_agent(): void</code>",id:"create_agent-void",level:4},{value:"<code>confirm_agent_creation(): void</code>",id:"confirm_agent_creation-void",level:4},{value:"<code>show_success_message(): void</code>",id:"show_success_message-void",level:4},{value:"Agent_Selection Class",id:"agent_selection-class",level:2},{value:"Data Fields:",id:"data-fields-4",level:3},{value:"Methods:",id:"methods-4",level:3},{value:"<code>display_available_agents(): void</code>",id:"display_available_agents-void",level:4},{value:"<code>select_agent(): void</code>",id:"select_agent-void",level:4},{value:"<code>remove_agent(): void</code>",id:"remove_agent-void",level:4},{value:"<code>display_selected_agents(): void</code>",id:"display_selected_agents-void",level:4},{value:"Story_Writing Class",id:"story_writing-class",level:2},{value:"Data Fields:",id:"data-fields-5",level:3},{value:"Methods:",id:"methods-5",level:3},{value:"<code>display_story(): void</code>",id:"display_story-void",level:4},{value:"<code>collect_votes(): void</code>",id:"collect_votes-void",level:4},{value:"<code>show_agent_chapters(): void</code>",id:"show_agent_chapters-void",level:4},{value:"<code>display_voting_results(): void</code>",id:"display_voting_results-void",level:4},{value:"<code>submit_critique(): void</code>",id:"submit_critique-void",level:4},{value:"<code>select_chapter_to_critique(): void</code>",id:"select_chapter_to_critique-void",level:4},{value:"<code>display_revised_chapter(): void</code>",id:"display_revised_chapter-void",level:4},{value:"Story Class",id:"story-class",level:2},{value:"Data Fields:",id:"data-fields-6",level:3},{value:"Chapter Class",id:"chapter-class",level:2},{value:"Data Fields:",id:"data-fields-7",level:3},{value:"Agent Class",id:"agent-class",level:2},{value:"Data Fields:",id:"data-fields-8",level:3},{value:"User Class",id:"user-class",level:2},{value:"Data Fields:",id:"data-fields-9",level:3}];function a(e){const s={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",li:"li",mermaid:"mermaid",p:"p",strong:"strong",ul:"ul",...(0,r.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.h1,{id:"class-diagrams",children:"Class Diagrams"}),"\n",(0,i.jsx)(s.h2,{id:"frontend-class-diagram",children:"Frontend Class Diagram"}),"\n",(0,i.jsx)(s.mermaid,{value:"  classDiagram\n    class App {\n        -user_session: User\n        +render()\n        +set_user_session(user: User) void\n    }\n\n    class Login_Page {\n        -username: string\n        -password: string\n        +handle_login() void\n        +validate_input() boolean\n        +display_error_message() void\n        +redirect_to_home_page() void\n    }\n\n    class Home_Page {\n        -user_stories: Story[]\n        +show_story_list() void\n        +create_new_story() void\n        +open_agent_creation_modal() void\n        +open_agent_selection_modal() void\n    }\n\n    class Agent_Creation {\n        -agent_name: string\n        +create_agent() void\n        +confirm_agent_creation() void\n        +show_success_message() void\n    }\n\n    class Agent_Selection {\n        -available_agents: Agent[]\n        -selected_agents: Agent[]\n        +display_available_agents() void\n        +select_agent() void\n        +remove_agent() void\n        +display_selected_agents() void\n    }\n\n    class Story_Writing {\n        -current_chapter: int\n        -story_prompt: string\n        -agent_versions: string[]\n        -critique: string\n        +display_story() void\n        +collect_votes() void\n        +show_agent_chapters() void\n        +display_voting_results() void\n        +submit_critique() void\n        +select_chapter_to_critique() void\n        +display_revised_chapter() void\n    }\n\n    class Story {\n        -story_title: string\n        -chapters: Chapter[]\n    }\n\n    class Chapter {\n        -chapter_number: int\n        -chapter_title: string\n        -chapter_content: string\n    }\n\n    class User {\n        -username: string\n        -auth_token: string\n    }\n\n    class Agent {\n        -agent_name: string\n    }\n\n    App --\x3e User : uses\n    App --\x3e Login_Page : renders\n    App --\x3e Home_Page : renders\n    Login_Page --\x3e Home_Page : navigates to\n    Home_Page --\x3e Story : uses\n    Story --\x3e Chapter : uses\n    Home_Page --\x3e Agent_Creation : contains\n    Home_Page --\x3e Agent_Selection : contains\n    Agent_Selection --\x3e Agent : uses\n    Home_Page --\x3e Story_Writing : contains"}),"\n",(0,i.jsx)(s.h2,{id:"app-class",children:"App Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Manages the user session and controls page rendering based on the session state (login or logged out)."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"user_session: User | null"}),": Stores the current user's session (if logged in) or ",(0,i.jsx)(s.code,{children:"null"})," if no user is logged in."]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"methods",children:"Methods:"}),"\n",(0,i.jsx)(s.h4,{id:"render-void",children:(0,i.jsx)(s.code,{children:"render(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Determines which page to render based on the current user session."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The app must be initialized, and the user session must be checked."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," Renders either the ",(0,i.jsx)(s.code,{children:"Login_Page"})," or ",(0,i.jsx)(s.code,{children:"Home_Page"})," based on whether ",(0,i.jsx)(s.code,{children:"user_session"})," is set."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"set_user_sessionuser-user-void",children:(0,i.jsx)(s.code,{children:"set_user_session(user: User): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Sets the current user session and triggers a page re-render."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," ",(0,i.jsx)(s.code,{children:"user"})," is a valid ",(0,i.jsx)(s.code,{children:"User"})," object."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," ",(0,i.jsx)(s.code,{children:"user_session"})," is set to the passed ",(0,i.jsx)(s.code,{children:"user"}),", and the page is re-rendered to the ",(0,i.jsx)(s.code,{children:"Home_Page"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"user"}),": ",(0,i.jsx)(s.code,{children:"User"})," object"]}),"\n"]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"login_page-class",children:"Login_Page Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Manages the login process, including handling user input, validating credentials, and navigating to the home page after a successful login."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-1",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"username: string"}),": Stores the entered username."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"password: string"}),": Stores the entered password."]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"methods-1",children:"Methods:"}),"\n",(0,i.jsx)(s.h4,{id:"handle_login-void",children:(0,i.jsx)(s.code,{children:"handle_login(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Handles the login logic, validates user input, and proceeds to authenticate the user."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," ",(0,i.jsx)(s.code,{children:"username"})," and ",(0,i.jsx)(s.code,{children:"password"})," are filled by the user."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," Either displays an error message (if invalid) or proceeds to authenticate the user and sets the user session."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"validate_input-boolean",children:(0,i.jsx)(s.code,{children:"validate_input(): boolean"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Validates the entered ",(0,i.jsx)(s.code,{children:"username"})," and ",(0,i.jsx)(s.code,{children:"password"})," before attempting authentication."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," ",(0,i.jsx)(s.code,{children:"username"})," and ",(0,i.jsx)(s.code,{children:"password"})," are non-empty."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," Returns a boolean indicating whether the input is valid."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"boolean"}),": ",(0,i.jsx)(s.code,{children:"true"})," if input is valid, ",(0,i.jsx)(s.code,{children:"false"})," otherwise."]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"display_error_message-void",children:(0,i.jsx)(s.code,{children:"display_error_message(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays an error message when the login fails."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," ",(0,i.jsx)(s.code,{children:"username"})," or ",(0,i.jsx)(s.code,{children:"password"})," is invalid."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," An error message is shown to the user."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"redirect_to_home_page-void",children:(0,i.jsx)(s.code,{children:"redirect_to_home_page(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Navigates to the home page after a successful login."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The user has successfully logged in."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," Redirects the user to the ",(0,i.jsx)(s.code,{children:"Home_Page"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"home_page-class",children:"Home_Page Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays the user's home page with a list of user stories and options for creating new stories or managing agents."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-2",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"user_stories: Story[]"}),": Stores an array of ",(0,i.jsx)(s.code,{children:"Story"})," objects."]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"methods-2",children:"Methods:"}),"\n",(0,i.jsx)(s.h4,{id:"show_story_list-void",children:(0,i.jsx)(s.code,{children:"show_story_list(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays the list of user stories."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The ",(0,i.jsx)(s.code,{children:"user_stories"})," array is populated with ",(0,i.jsx)(s.code,{children:"Story"})," objects."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The story list is rendered on the page."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"create_new_story-void",children:(0,i.jsx)(s.code,{children:"create_new_story(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Opens the story creation modal to allow the user to create a new story."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The user is on the home page."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," Opens the story creation modal."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"open_agent_creation_modal-void",children:(0,i.jsx)(s.code,{children:"open_agent_creation_modal(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Opens the agent creation modal."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The user is on the home page."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The agent creation modal is displayed."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"open_agent_selection_modal-void",children:(0,i.jsx)(s.code,{children:"open_agent_selection_modal(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Opens the agent selection modal."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The user is on the home page."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The agent selection modal is displayed."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"agent_creation-class",children:"Agent_Creation Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Allows the user to create and confirm new agents."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-3",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"agent_name: string"}),": Stores the name of the agent being created."]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"methods-3",children:"Methods:"}),"\n",(0,i.jsx)(s.h4,{id:"create_agent-void",children:(0,i.jsx)(s.code,{children:"create_agent(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Creates a new agent with the given ",(0,i.jsx)(s.code,{children:"agent_name"}),"."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," ",(0,i.jsx)(s.code,{children:"agent_name"})," is provided."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The agent is created and added to the available agents list."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"confirm_agent_creation-void",children:(0,i.jsx)(s.code,{children:"confirm_agent_creation(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Confirms the creation of the new agent and adds it to the system."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The agent has been created and validated."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The new agent is confirmed and displayed in the agent selection modal."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"show_success_message-void",children:(0,i.jsx)(s.code,{children:"show_success_message(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays a success message after the agent is created."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The agent has been successfully created."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," A success message is shown to the user."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"agent_selection-class",children:"Agent_Selection Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Manages the selection and removal of agents from the available agents list."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-4",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"available_agents: Agent[]"}),": Stores the list of available agents."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"selected_agents: Agent[]"}),": Stores the list of agents selected by the user."]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"methods-4",children:"Methods:"}),"\n",(0,i.jsx)(s.h4,{id:"display_available_agents-void",children:(0,i.jsx)(s.code,{children:"display_available_agents(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays the list of available agents."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The ",(0,i.jsx)(s.code,{children:"available_agents"})," array is populated with ",(0,i.jsx)(s.code,{children:"Agent"})," objects."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The available agents list is displayed."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"select_agent-void",children:(0,i.jsx)(s.code,{children:"select_agent(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Adds an agent to the ",(0,i.jsx)(s.code,{children:"selected_agents"})," list."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The agent must be available."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The agent is added to the ",(0,i.jsx)(s.code,{children:"selected_agents"})," list."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"remove_agent-void",children:(0,i.jsx)(s.code,{children:"remove_agent(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Removes an agent from the ",(0,i.jsx)(s.code,{children:"selected_agents"})," list."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The agent must be in the ",(0,i.jsx)(s.code,{children:"selected_agents"})," list."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The agent is removed from the list."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"display_selected_agents-void",children:(0,i.jsx)(s.code,{children:"display_selected_agents(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays the list of selected agents."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The ",(0,i.jsx)(s.code,{children:"selected_agents"})," array is populated."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The selected agents list is displayed."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"story_writing-class",children:"Story_Writing Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Handles the writing and critique of user stories, including agent involvement and voting."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-5",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"current_chapter: int"}),": Stores the current chapter number being worked on."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"story_prompt: string"}),": Stores the prompt for the story."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"agent_versions: string[]"}),": Stores different versions of a story chapter."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"critique: string"}),": Stores the critique of the current chapter."]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"methods-5",children:"Methods:"}),"\n",(0,i.jsx)(s.h4,{id:"display_story-void",children:(0,i.jsx)(s.code,{children:"display_story(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays the current story and chapter."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The current story and chapter exist."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The story is displayed to the user."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"collect_votes-void",children:(0,i.jsx)(s.code,{children:"collect_votes(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Collects votes on the story chapter from agents or users."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The chapter is ready for voting."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," Votes are collected and processed."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"show_agent_chapters-void",children:(0,i.jsx)(s.code,{children:"show_agent_chapters(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays the chapters written by different agents."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," Chapters exist for different agents."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The agent chapters are displayed."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"display_voting_results-void",children:(0,i.jsx)(s.code,{children:"display_voting_results(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays the results of the voting for the current chapter."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," Votes have been collected."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The voting results are shown."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"submit_critique-void",children:(0,i.jsx)(s.code,{children:"submit_critique(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Submits the critique for the current chapter."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," The critique text is written."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The critique is submitted."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"select_chapter_to_critique-void",children:(0,i.jsx)(s.code,{children:"select_chapter_to_critique(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Allows the user to select which chapter they want to critique."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," Multiple chapters are available."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The selected chapter is marked for critique."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"display_revised_chapter-void",children:(0,i.jsx)(s.code,{children:"display_revised_chapter(): void"})}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Displays the revised chapter after critique."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Pre-conditions:"})," A revised version of the chapter exists."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Post-conditions:"})," The revised chapter is displayed."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Parameters:"})," None"]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.strong,{children:"Return value:"})," None"]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"story-class",children:"Story Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Represents a story created by the user, which consists of multiple chapters."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-6",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"story_title: string"}),": The title of the story."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"chapters: Chapter[]"}),": A list of ",(0,i.jsx)(s.code,{children:"Chapter"})," objects that make up the story."]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"chapter-class",children:"Chapter Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Represents a single chapter in a story."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-7",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"chapter_number: int"}),": The chapter number."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"chapter_title: string"}),": The title of the chapter."]}),"\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"chapter_content: string"}),": The content of the chapter."]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"agent-class",children:"Agent Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Represents an agent that contributes to writing a story chapter or provides critique."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-8",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"agent_name: string"}),": The name of the agent."]}),"\n"]}),"\n",(0,i.jsx)(s.hr,{}),"\n",(0,i.jsx)(s.h2,{id:"user-class",children:"User Class"}),"\n",(0,i.jsxs)(s.p,{children:[(0,i.jsx)(s.strong,{children:"Purpose:"})," Represents the user of the application, typically the one logged in."]}),"\n",(0,i.jsx)(s.h3,{id:"data-fields-9",children:"Data Fields:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:[(0,i.jsx)(s.code,{children:"username: string"}),": The username"]}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,r.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},28453:(e,s,n)=>{n.d(s,{R:()=>d,x:()=>t});var i=n(96540);const r={},l=i.createContext(r);function d(e){const s=i.useContext(l);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function t(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(r):e.components||r:d(e.components),i.createElement(l.Provider,{value:s},e.children)}}}]);