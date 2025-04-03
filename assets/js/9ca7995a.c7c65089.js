"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[2987],{56674:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>a,default:()=>h,frontMatter:()=>o,metadata:()=>r,toc:()=>d});var i=n(74848),s=n(28453);const o={sidebar_position:2},a="Integration Tests",r={id:"testing/integration-testing",title:"Integration Tests",description:"Component Connection Logistics",source:"@site/docs/testing/integration-testing.md",sourceDirName:"testing",slug:"/testing/integration-testing",permalink:"/project-003-story-builder-team-1/docs/testing/integration-testing",draft:!1,unlisted:!1,editUrl:"https://github.com/Capstone-Projects-2025-Spring/project-003-story-builder-team-1/edit/main/documentation/docs/testing/integration-testing.md",tags:[],version:"current",lastUpdatedBy:"NocKtuRn4L",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"docsSidebar",previous:{title:"Unit Tests",permalink:"/project-003-story-builder-team-1/docs/testing/unit-testing"},next:{title:"Acceptance Tests",permalink:"/project-003-story-builder-team-1/docs/testing/acceptence-testing"}},c={},d=[{value:"Component Connection Logistics",id:"component-connection-logistics",level:2},{value:"There are four major components, three of which (Backend, Frontend, LLM) connect to create an input-output pipeline. The pipleine would be as follows:",id:"there-are-four-major-components-three-of-which-backend-frontend-llm-connect-to-create-an-input-output-pipeline-the-pipleine-would-be-as-follows",level:4},{value:"The fourth major component, the Database, will also interact with the Backend, Frontend, and LLM, as follows:",id:"the-fourth-major-component-the-database-will-also-interact-with-the-backend-frontend-and-llm-as-follows",level:4},{value:"Testing Logistics",id:"testing-logistics",level:2}];function l(e){const t={h1:"h1",h2:"h2",h4:"h4",li:"li",ol:"ol",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.h1,{id:"integration-tests",children:"Integration Tests"}),"\n",(0,i.jsx)(t.h2,{id:"component-connection-logistics",children:"Component Connection Logistics"}),"\n",(0,i.jsx)(t.h4,{id:"there-are-four-major-components-three-of-which-backend-frontend-llm-connect-to-create-an-input-output-pipeline-the-pipleine-would-be-as-follows",children:"There are four major components, three of which (Backend, Frontend, LLM) connect to create an input-output pipeline. The pipleine would be as follows:"}),"\n",(0,i.jsxs)(t.ol,{children:["\n",(0,i.jsx)(t.li,{children:"Frontend receives user input"}),"\n",(0,i.jsx)(t.li,{children:"User input is sent to the Backend"}),"\n",(0,i.jsx)(t.li,{children:"Backend Receives input, and sends the input to the LLM"}),"\n",(0,i.jsx)(t.li,{children:"Depending on the user input, the LLM would generate the chapter draft, critique, or edits"}),"\n",(0,i.jsx)(t.li,{children:"The generated data from the LLM would then be sent to the Backend, and then the Frontend"}),"\n"]}),"\n",(0,i.jsx)(t.h4,{id:"the-fourth-major-component-the-database-will-also-interact-with-the-backend-frontend-and-llm-as-follows",children:"The fourth major component, the Database, will also interact with the Backend, Frontend, and LLM, as follows:"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"The Database interacts with the Frontend when user story prompts are sent to the Backend, and then stored in the Database"}),"\n",(0,i.jsx)(t.li,{children:"Any edits to agent-generated drafts would then be sent to the Backend to be updated in the Database"}),"\n",(0,i.jsx)(t.li,{children:"Each step of agent-generated drafts would be send to the Backend to be stored in the Database"}),"\n",(0,i.jsx)(t.li,{children:"When the story is completed, each of the individual steps of the chapter drafting process will be deleted in the Database, and the final chapter data for each chapter will be merged into a single entry in the Database"}),"\n"]}),"\n",(0,i.jsx)(t.h2,{id:"testing-logistics",children:"Testing Logistics"}),"\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Testing connection from the Frontend to the Backend would involve sending data from the user interface, and ensuring the data is successfully received in the Backend."}),"\n",(0,i.jsx)(t.li,{children:"Testing connection from the Backend to the Frontend would involve sending a message that is visible on the Frontend."}),"\n",(0,i.jsx)(t.li,{children:"Testing connection from the Backend to the LLM would involve sending some prompt to the LLM, and ensuring a response is successfully received in the Backend."}),"\n",(0,i.jsx)(t.li,{children:"Testing connection from the LLM to the Backend would involve ensuring that the LLM response prompt to the Backend is coherent and grammatically correct."}),"\n",(0,i.jsxs)(t.li,{children:["Testing connection between the Backend and Database involves three distinct tests:","\n",(0,i.jsxs)(t.ul,{children:["\n",(0,i.jsx)(t.li,{children:"Testing adding a new entry into the Database would involve sending sample data to the Database, and ensuring the data is successfully received and an entry is created in the Database."}),"\n",(0,i.jsx)(t.li,{children:"Testing editing an entry in the Database would involve checking to see if a specific entry currently exists in the Database, sending new data to replace the specified entry, and ensuring that the data entry is successfully updated in the Database."}),"\n",(0,i.jsx)(t.li,{children:"Testing deleting an entry in the Database would involve checking to see if a specific entry currently exiss in the Database, sending a request to delete the specified entry, and ensuring that the proper status response is returned from the Database."}),"\n",(0,i.jsx)(t.li,{children:"Note: All tests involving the Database require retreiving the test entry from the Database to ensure that the test value matches the expected value."}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(t.li,{children:"Testing the entire input-output pipeline involves sending a sample prompt with specified requirements and receiving a generated LLM response that meets the requirements"}),"\n"]})]})}function h(e={}){const{wrapper:t}={...(0,s.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>a,x:()=>r});var i=n(96540);const s={},o=i.createContext(s);function a(e){const t=i.useContext(o);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function r(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),i.createElement(o.Provider,{value:t},e.children)}}}]);