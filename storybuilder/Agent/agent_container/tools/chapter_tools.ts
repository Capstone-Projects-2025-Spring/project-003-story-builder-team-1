import { tool } from "@langchain/core/tools"
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatDeepSeek } from "@langchain/deepseek";
import { stream_handler } from "../stream_handler.js";

export default function chapter_tools(llm: ChatDeepSeek) {
        
    // Prompt
    const first_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You will work in a Mechanical Turks 
        style with other assistants to compose stories for users following 
        a certain set of steps. The story will be written in chapters, and 
        you will write the first chapter. It's very important that you don't 
        return anything except for the chapter itself. You will ensure the results
        conform to the style of "{agent_name}".

        This is the prompt information: "{prompt_info}"

        This is the story outline: "{outline}"

        You will write the first chapter based on the chapter 1 summary above.
    `);

    const next_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You will work in a Mechanical Turks 
        style with other assistants to compose stories for users following 
        a certain set of steps. You are now being fed a chapter written by another agent. 
        You will continue the story in another chapter of roughly equal 
        length while still following the guidelines established in the original prompt. It's 
        very important that you DON'T include any additional text besides the next chapter itself.
        You will ensure the results conform to the style of "{agent_name}".

        Prompt information: "{prompt_info}"

        Previous chapter(s) whose story you're continuing: "{chapter}"

        Outline: "{outline}"
    `);

    const critique_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You will work in a Mechanical Turks 
        style with other assistants to compose stories for users following 
        a certain set of steps. You are now being fed a chapter written by another agent. You will 
        critique the drafting of this chapter based on grammatical correctness 
        as well as its faithfulness to the style parameters that were specified, 
        and the previous chapters. Do not rewrite the chapter. It's very important 
        that you ONLY return the critique and nothing else.
        You will ensure the results conform to the style of "{agent_name}".

        Prompt information: "{prompt_info}"

        Chapter: "{chapter}"

        Outline: "{outline}"
    `);

    const rewrite_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You will work in a Mechanical Turks 
        style with other assistants to compose stories for users following 
        a certain set of steps. You are now being fed a chapter written by another agent, along 
        with a critique of that chapter and the original prompt information. 
        Rewrite the chapter, improving it based upon the critique's observations. 
        Make sure it's a similar chapter length, and do not change anything if it 
        doesn't violate the critique parameters. It's very important that you just 
        return the rewritten chapter and nothing else.
        You will ensure the results conform to the style of "{agent_name}".

        Prompt information: "{prompt_info}"

        This is the critique: "{critique}"
        
        This is the outline of the entire story: "{outline}"

        And this is the chapter you will rewrite: "{chapter}"
    `);

    const regenerate_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You will work in a Mechanical Turks 
        style with other assistants to compose stories for users following 
        a certain set of steps. You are now being fed a chapter written by another agent. 
        You will regenerate this chapter, keeping the length roughly equal, and still 
        following the guidelines established in the original prompt. It's very important 
        that you ONLY return the regenerated chapter and nothing else.
        You will ensure the results conform to the style of "{agent_name}".

        Prompt information: "{prompt_info}"

        Outline: "{outline}"
    `);

    const vote_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        Your job now is to judge all of these chapters as objectively 
        as you can based on the initial prompt information. You will 
        choose the best chapter. Do not return an explanation for your 
        decision and don't return the chapters themselves, just return 
        the chapter's index number. It's extremely important that you ONLY 
        return the index number of the chapter you prefer and absolutely nothing else.".
         You will ensure the results conform to the style of "{agent_name}".

        Prompt information: "{prompt_info}"

        Chapters to vote on: "{chapter_bank}"
    `);

    const first_chapter = tool(
        async ({agent_name, prompt_info, outline }: {agent_name: string, prompt_info: string, outline: string}) => {
            const messages = await first_chapter_prompt.formatMessages({agent_name, prompt_info, outline });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "first_chapter",
        description: "Generates an initial chapter for a story based on the provided prompt information and a story outline. The provided outline will be used as context to ensure the result doesn't include redundant info for continuity. Decide length of the chapter yourself. It's very important that you do NOT say anything else to the user. ",
        schema: z.object({
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process.")
        })
        }
    );

    const next_chapter = tool(
        async ({agent_name, prompt_info, chapter, outline }: {agent_name: string, prompt_info: string, chapter: string, outline: string}) => {
            const messages = await next_chapter_prompt.formatMessages({agent_name, prompt_info, chapter, outline });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "critique_chapter",
        description: "Writes another chapter in the story, continuing the narrative and keeping consistent with the style parameters. This chapter will use previous chapters as context as well as a story outline to ensure continuity is maintained, chapter length stays consistent, and style parameters are still being followed. Do not return anything to the user besides the chapter itself.",
        schema: z.object({
            prompt_info: z.string().describe("The chapter that is to be followed."),
            outline: z.string().describe("The outline used for reference.")
        })
        }
    );

    const rewrite_chapter = tool(
        async ({agent_name, prompt_info, critique, outline, chapter}: {agent_name: string, prompt_info: string, critique: string, outline: string, chapter: string}) => {
            const messages = await rewrite_chapter_prompt.formatMessages({agent_name, prompt_info, critique , outline, chapter });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "revise_outline",
        description: "Rewrites a given chapter based on the original chapter itself, a critique of that chapter, the initial prompt information, and a general story outline. Ensure the rewritten chapter keeps in line with the parameters the rest of the chapters must follow. Return nothing but the rewritten chapter itself.",
        schema: z.object({
            critique: z.string().describe("The critique to be applied to the outline."),
            outline: z.string().describe("The outline to be revised.")
        })
        }
    );

    const regenerate_chapter = tool(
        async ({agent_name, prompt_info, outline }: {agent_name: string, prompt_info: string, outline: string}) => {
            const messages = await regenerate_chapter_prompt.formatMessages({agent_name, prompt_info, outline });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "revise_outline",
        description: "Regenerates a given chapter WITHOUT a provided critique. May be used to contrast with a rewritten chapter that uses a critique made by another agent. It's important that only the regenerated chapter is returned and nothing else. ",
        schema: z.object({
            critique: z.string().describe("The critique to be applied to the outline."),
            outline: z.string().describe("The outline to be revised.")
        })
        }
    );

    const critique_chapter = tool(
        async ({agent_name, prompt_info, chapter, outline }: {agent_name: string, prompt_info: string, chapter: string, outline: string}) => {
            const messages = await critique_chapter_prompt.formatMessages({agent_name, prompt_info, chapter, outline });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "revise_outline",
        description: "Critiques a chapter, given the initial prompt information along with a general storyline to keep continuity and style constraints in check. This critique will be refernced later so the chapter can be rewritten. This does NOT rewrite the chapter itself, and it is very important this function only returns a critique of the chapter and nothing else.",
        schema: z.object({
            critique: z.string().describe("The critique to be applied to the outline."),
            outline: z.string().describe("The outline to be revised.")
        })
        }
    );

    const vote_chapter = tool(
        async ({agent_name, prompt_info, chapter_bank }: {agent_name: string, prompt_info: string, chapter_bank: string}) => {
            const messages = await vote_chapter_prompt.formatMessages({agent_name, prompt_info, chapter_bank });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "revise_outline",
        description: "Votes on the different collected chapters. Chapters are stored as a stringified array. The result will rank whichever entry has the best chapter according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning chapter.",
        schema: z.object({
            critique: z.string().describe("The critique to be applied to the outline."),
            outline: z.string().describe("The outline to be revised.")
        })
        }
    );

    return  [first_chapter, next_chapter, rewrite_chapter, regenerate_chapter, critique_chapter, vote_chapter];
}