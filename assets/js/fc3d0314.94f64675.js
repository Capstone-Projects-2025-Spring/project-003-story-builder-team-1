"use strict";(self.webpackChunkcreate_project_docs=self.webpackChunkcreate_project_docs||[]).push([[1559],{24727:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>o,default:()=>l,frontMatter:()=>r,metadata:()=>c,toc:()=>h});var s=n(74848),i=n(28453);const r={sidebar_position:3},o="Acceptance Tests",c={id:"testing/acceptence-testing",title:"Acceptance Tests",description:"| Test ID | Actions/Steps | Notes/Expected Results",source:"@site/docs/testing/acceptence-testing.md",sourceDirName:"testing",slug:"/testing/acceptence-testing",permalink:"/project-003-story-builder-team-1/docs/testing/acceptence-testing",draft:!1,unlisted:!1,editUrl:"https://github.com/Capstone-Projects-2025-Spring/project-003-story-builder-team-1/edit/main/documentation/docs/testing/acceptence-testing.md",tags:[],version:"current",lastUpdatedBy:"Edgardo Gonzalez",sidebarPosition:3,frontMatter:{sidebar_position:3},sidebar:"docsSidebar",previous:{title:"Integration Tests",permalink:"/project-003-story-builder-team-1/docs/testing/integration-testing"}},d={},h=[];function a(e){const t={h1:"h1",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(t.h1,{id:"acceptance-tests",children:"Acceptance Tests"}),"\n",(0,s.jsxs)(t.table,{children:[(0,s.jsx)(t.thead,{children:(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.th,{children:"Test ID"}),(0,s.jsx)(t.th,{children:"Actions/Steps"}),(0,s.jsx)(t.th,{children:"Notes/Expected Results"})]})}),(0,s.jsxs)(t.tbody,{children:[(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"1"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"Invalid Prompt"}),": Go to the Home Page for Story Builder. Leave one of the required boxes empty and click send prompt"]}),(0,s.jsx)(t.td,{children:"Check to see if the an error appears"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"2"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"Generate an Outline"}),": Send a prompt with valid information and more than two chapter. Click send prompt only once and wait for the outline"]}),(0,s.jsx)(t.td,{children:"Check if redirected to a page with the story outline with the amount of specifed chapters"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"3"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"Check Agent Tab"}),": Click on the story 1 tab on the top right to open up a menu with other tabs. Click the agent tab and check to see if you are rediected"]}),(0,s.jsx)(t.td,{children:"A box containing the individual response should be visible and scrollable."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"4"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"Check Continue Button on Agent Tab"}),": Click the continue button to generate the next prompt"]}),(0,s.jsx)(t.td,{children:"The page should update with the new prompt. Scroll in the box to view the first chapter."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"5"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"Check Best Response Tab"}),": Click on the best response tab. If not visible click on story 1 tab first. Click the continue button to generate chapter two."]}),(0,s.jsx)(t.td,{children:"Check if chapter 2 is visible within the response box on the screen."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"6"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"Check Best Response Contiune Button"}),": Navigate to the best response page. Click the continue button found on the best response page."]}),(0,s.jsx)(t.td,{children:"The next chapter should appear within the text box."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"7"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"Veiw Story"}),": Click on Story 1 tab. Then click on view story tab."]}),(0,s.jsx)(t.td,{children:"The entire story should be on screen."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"8"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"View Chapters"}),": Click on Story 1 tab. Then click on view story tab. On the right click on a chapter tab to view the individual chapter"]}),(0,s.jsx)(t.td,{children:"The entire generated chapter should be displayed"})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"9"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"View Outline"}),": Click on Story 1 tab. Then click on view story tab. On the right click on the outline tab to view the outline"]}),(0,s.jsx)(t.td,{children:"The generated outline should be displayed."})]}),(0,s.jsxs)(t.tr,{children:[(0,s.jsx)(t.td,{children:"10"}),(0,s.jsxs)(t.td,{children:[(0,s.jsx)(t.strong,{children:"Check Disappearing Continue Button"})," Generate chapters one at a time until the amount of chapters originally specified in the prompt have been generated. Navigate to the best response page and the agent page by clicking their tabs on the left"]}),(0,s.jsx)(t.td,{children:"Check if the continue button is gone."})]})]})]})]})}function l(e={}){const{wrapper:t}={...(0,i.R)(),...e.components};return t?(0,s.jsx)(t,{...e,children:(0,s.jsx)(a,{...e})}):a(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>o,x:()=>c});var s=n(96540);const i={},r=s.createContext(i);function o(e){const t=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:t},e.children)}}}]);