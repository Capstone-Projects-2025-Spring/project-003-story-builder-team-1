import { tool } from "@langchain/core/tools"
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatDeepSeek } from "@langchain/deepseek";
import { stream_handler } from "../stream_handler.js";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage } from "@langchain/core/messages";

export default function chapter_tools(llm: ChatOpenAI | ChatDeepSeek) {
        
    const chapter_context_schema = z.object({
        chapters: z.array(
        z.object({
            title: z.string(),
            content: z.string(),
        })
        ),
        totalChapters: z.number(),
    });

    const vote_chapter_output_schema = z.object({
        winningChapterIndex: z.number().describe("The index of the winning chapter in the chapter bank."),
        voteValue: z.number().describe("The value of the vote, from 0 to 100, where 100 is the best possible chapter."),
    })

    const vote_critique_output_schema = z.object({
        winningChapterIndex: z.number().describe("The index of the winning critique in the critique bank."),
        voteValue: z.number().describe("The value of the vote, from 0 to 100, where 100 is the best possible critique."),
    })

    // Prompt
    const first_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. The story will be written in chapters, and 
        you will write the first chapter. It's very important that you don't 
        return anything except for the chapter itself. Do not return any supplementary commentary or reflections or any acknowledgement of the prompt itself, you will only return your chapter and absolutely nothing else. You will ensure the results
        conform to the style of this persona: "{persona}".

        This is the prompt information: "{prompt_info}"

        This is the story outline: "{outline}"

        You will write the first chapter based on the chapter 1 summary above.
    `);

    const vote_first_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        Your job now is to judge all of these chapters as objectively 
        as you can based on the initial prompt information. You will 
        choose the best chapter. Do not return an explanation for your 
        decision and don't return the chapters themselves, just return 
        the chapter's index number. It's extremely important that you ONLY 
        return the index number of the chapter you prefer and absolutely nothing else. Do not return any other reflections, commentary, or any acknowledgement of the prompt itself, just the number that corresponds to the winning chapter.
         You will ensure the results conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Chapters to vote on: "{chapter_bank}"
    `);

    const next_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You are now being fed a chapter written by another agent. 
        You will continue the story in another chapter of roughly equal 
        length while still following the guidelines established in the original prompt. It's 
        very important that you DON'T include any additional text besides the chapter itself. Do not return any reflections, commentary, or acknowledgement of the prompt itself, just the chapter.
        You will ensure the results conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Previous chapter(s) whose story you're continuing: "{chapter}"

        Outline: "{outline}"
    `);

    const vote_next_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        Your job now is to judge all of these chapters as objectively 
        as you can based on the initial prompt information. You will 
        choose the best chapter. Do not return an explanation for your 
        decision and don't return the chapters themselves, just return 
        the chapter's index number. It's extremely important that you ONLY 
        return the index number of the chapter you prefer and absolutely nothing else. Do not return any other reflections, commentary, or any acknowledgement of the prompt itself, just the number that corresponds to the winning chapter.
         You will ensure the results conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Chapters to vote on: "{chapter_bank}"
    `);

    const critique_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You are now being fed a chapter written by another agent. You will 
        critique the drafting of this chapter based on grammatical correctness 
        as well as its faithfulness to the style parameters that were specified, 
        and the previous chapters. Do not rewrite the chapter. It's very important 
        that you ONLY return the critique and nothing else. Do not return any other reflections, commentary, or any acknowledgement of the prompt itself, just the critique of the chapter.
        You will ensure the results conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Chapter: "{chapter}"

        Outline: "{outline}"
    `);

    const rewrite_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You are now being fed a chapter written by another agent, along 
        with a critique of that chapter and the original prompt information. 
        Rewrite the chapter, improving it based upon the critique's observations. 
        Make sure it's a similar chapter length, and do not change anything if it 
        doesn't violate the critique parameters. It's very important that you just 
        return the rewritten chapter and nothing else. Do not return any other reflections, commentary, or any acknowledgement of the prompt itself, just the rewritten chapter.
        You will ensure the results conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        This is the critique: "{critique}"
        
        This is the outline of the entire story: "{outline}"

        And this is the chapter you will rewrite: "{chapter}"
    `);

    const vote_rewrite_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You are now being fed a chapter written by another agent, along 
        with a critique of that chapter and the original prompt information. 
        Rewrite the chapter, improving it based upon the critique's observations. 
        Make sure it's a similar chapter length, and do not change anything if it 
        doesn't violate the critique parameters. It's very important that you just 
        return the rewritten chapter and nothing else. Do not return any other reflections, commentary, or any acknowledgement of the prompt itself, just the rewritten chapter.
        You will ensure the results conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Critiques to vote on: "{chapter_bank}"
    `);

    const regenerate_chapter_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant. You are now being fed a chapter written by another agent. 
        You will regenerate this chapter, keeping the length roughly equal, and still 
        following the guidelines established in the original prompt. It's very important 
        that you ONLY return the regenerated chapter and nothing else. Do not return any other reflections, commentary, or any acknowledgement of the prompt itself. just the regenerated chapter.
        You will ensure the results conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Outline: "{outline}"
    `);

    const vote_chapter_critique_prompt = ChatPromptTemplate.fromTemplate(`
        Your job now is to judge all of these critiques to see which one is the most
        thorough. You will return the index number that corresponds to the critique you find
        the most appropriate. Return only this number, and absolutely nothing else. Do not return any other reflections, commentary, or any acknowledgement of the prompt itself,  just the number that corresponds to the winning chapter.
         You will ensure the results will conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Critiques to vote on: "{critique_bank}"
    `);

    const first_chapter = tool(
        async ({persona, prompt_info, outline }: {persona: string, prompt_info: string, outline: string}) => {
            const messages = await first_chapter_prompt.formatMessages({persona, prompt_info, outline });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "first_chapter",
        description: "Generates an initial chapter for a story based on the provided prompt information and a story outline. The provided outline will be used as context to ensure the result doesn't include redundant info for continuity. Decide length of the chapter yourself. It's very important that you do NOT say anything else to the user. ",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            outline: z.string().describe("The outline of the entire story to be used for additional context.")
        })
        }
    );

    const vote_first_chapter = tool(
        async ({persona, prompt_info, chapter_bank }: {persona: string, prompt_info: string, chapter_bank: string}) => {
            const messages = await vote_first_chapter_prompt.formatMessages({persona, prompt_info, chapter_bank });

            const res = await llm.withStructuredOutput(vote_chapter_output_schema).invoke(messages);
            return res;

        },
        {
        name: "vote_first_chapter",
        description: "Votes on the different collected chapters. Chapters are stored as a stringified array. The result will rank whichever entry has the best chapter according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning chapter.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            chapter_bank: z.string().describe("The collection of chapters to be judged.")
        })
        }
    );

    const next_chapter = tool(
        async ({persona, prompt_info, chapter, outline }: {persona: string, prompt_info: string, chapter: string, outline: string}) => {
            const messages = await next_chapter_prompt.formatMessages({persona, prompt_info, chapter, outline });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "next_chapter",
        description: "Writes another chapter in the story, continuing the narrative and keeping consistent with the style parameters. This chapter will use previous chapters as context as well as a story outline to ensure continuity is maintained, chapter length stays consistent, and style parameters are still being followed. Do not return anything to the user besides the chapter itself.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            chapter: z.string().describe("The previous chapter used as reference to maintain narrative continuity."),
            outline: z.string().describe("The outline of the entire story to be used for additional context.")
        })
        }
    );

    const vote_next_chapter = tool(
        async ({persona, prompt_info, chapter_bank }: {persona: string, prompt_info: string, chapter_bank: string}) => {
            const messages = await vote_next_chapter_prompt.formatMessages({persona, prompt_info, chapter_bank });

            const res = await llm.withStructuredOutput(vote_chapter_output_schema).invoke(messages);
            return res;

        },
        {
        name: "vote_next_chapter",
        description: "Votes on the different collected chapters. Chapters are stored as a stringified array. The result will rank whichever entry has the best chapter according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning chapter.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            chapter_bank: z.string().describe("The collection of chapters to be judged.")
        })
        }
    );

    const rewrite_chapter = tool(
        async ({persona, prompt_info, critique, outline, chapter}: {persona: string, prompt_info: string, critique: string, outline: string, chapter: string}) => {
            const messages = await rewrite_chapter_prompt.formatMessages({persona, prompt_info, critique , outline, chapter });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "rewrite_chapter",
        description: "Rewrites a given chapter based on the original chapter itself, a critique of that chapter, the initial prompt information, and a general story outline. Ensure the rewritten chapter keeps in line with the parameters the rest of the chapters must follow. Return nothing but the rewritten chapter itself.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process.."),
            critique: z.string().describe("The critique to be applied to the outline."),
            outline: z.string().describe("The outline of the entire story to be used for additional context."),
            chapter: z.string().describe("The chapter to be rewritten."),
        })
        }
    );

    const vote_rewrite_chapter = tool(
        async ({persona, prompt_info, chapter_bank }: {persona: string, prompt_info: string, chapter_bank: string}) => {
            const messages = await vote_rewrite_chapter_prompt.formatMessages({persona, prompt_info, chapter_bank });

            const res = await llm.withStructuredOutput(vote_chapter_output_schema).invoke(messages);
            return res;

        },
        {
        name: "vote_rewrite_chapter",
        description: "Votes on the different collected chapters. Chapters are stored as a stringified array. The result will rank whichever entry has the best chapter according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning chapter.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            chapter_bank: z.string().describe("The collection of chapters to be judged.")
        })
        }
    );

    const regenerate_chapter = tool(
        async ({persona, prompt_info, outline }: {persona: string, prompt_info: string, outline: string}) => {
            const messages = await regenerate_chapter_prompt.formatMessages({persona, prompt_info, outline });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "regenerate_chapter",
        description: "Regenerates a given chapter WITHOUT a provided critique. May be used to contrast with a rewritten chapter that uses a critique made by another agent. It's important that only the regenerated chapter is returned and nothing else. ",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            outline: z.string().describe("The outline of the entire story to be used for additional context.")
        })
        }
    );

    const critique_chapter = tool(
        async ({persona, prompt_info, chapter, outline }: {persona: string, prompt_info: string, chapter: string, outline: string}) => {
            const messages = await critique_chapter_prompt.formatMessages({persona, prompt_info, chapter, outline });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "critique_chapter",
        description: "Critiques a chapter, given the initial prompt information along with a general storyline to keep continuity and style constraints in check. This critique will be refernced later so the chapter can be rewritten. This does NOT rewrite the chapter itself, and it is very important this function only returns a critique of the chapter and nothing else.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            chapter: z.string().describe("The chapter to be critiqued."),
            outline: z.string().describe("The outline of the entire story to be used for additional context.")
        })
        }
    );

    const vote_critique_chapter = tool(
        async ({persona, prompt_info, critique_bank }: {persona: string, prompt_info: string, critique_bank: string}) => {
            const messages = await vote_chapter_critique_prompt.formatMessages({persona, prompt_info, critique_bank });

            const res = await llm.withStructuredOutput(vote_critique_output_schema).invoke(messages);
            return res;

        },
        {
        name: "vote_critique_chapter",
        description: "Votes on the different collected chapters. Chapters are stored as a stringified array. The result will rank whichever entry has the best chapter according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning chapter.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            critique_bank: z.string().describe("The collection of critiques to be judged.")
        })
        }
    );

    return  [first_chapter, vote_first_chapter, next_chapter, vote_next_chapter, rewrite_chapter, vote_rewrite_chapter, critique_chapter, vote_critique_chapter];
}