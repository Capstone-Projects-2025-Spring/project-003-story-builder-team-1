import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { AIMessage } from "@langchain/core/messages";
export default function outline_tools(llm) {
    // 1) Define the exact shape you want:
    const outline_schema = z.object({
        chapters: z.array(z.object({
            title: z.string(),
            summary: z.string(),
        })),
        totalChapters: z.number(),
    });
    const vote_revise_outline_output_schema = z.object({
        winningOutlineIndex: z.number().describe("The index of the winning outline in the outline bank."),
        voteValue: z.number().describe("The value of the vote, from 0 to 100, where 100 is the best possible chapter."),
    });
    const vote_critique_outline_output_schema = z.object({
        winningOutlineIndex: z.number().describe("The index of the winning critique in the critique bank."),
        voteValue: z.number().describe("The value of the vote, from 0 to 100, where 100 is the best possible critique."),
    });
    // Prompt
    const generate_outline_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that creates story outlines. You will only ever make one tool call. Don't return anything except for the outline and absolutely nothing else.
        You will ensure the results are compatible with the style of this persona: "{persona}".
        Create a detailed outline where you decide the number of chapters. Don't return anything before or after the outline, and don't return any supplementary commentary or reflections or any acknowledgement of the prompt itself. Just return the outline based on the following idea:

        "{prompt_info}"
    `);
    const vote_generate_outline_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that creates story outlines. You will only ever make one tool call. Don't return anything except for the outline and absolutely nothing else.
        You will ensure the results are compatible with the style of this persona: "{persona}".
        Create a detailed outline where you decide the number of chapters. Don't return anything before or after the outline, and don't return any supplementary commentary or reflections or any acknowledgement of the prompt itself. Just return the outline based on the following idea:

        "{prompt_info}"

        "{outline_bank}"
    `);
    const critique_outline_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that critiques story outlines.
       You are now being fed an outline written by another agent. 
       You will critique this outline based on grammatical correctness 
       as well as its faithfulness to the style parameters that were specified. 
       Do not rewrite the outline. It is very important that you ONLY return 
       the critique of the outline and nothing else. You will ensure the results
        are compatible with the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"        

        Outline: "{outline}"
    `);
    const vote_outline_critique_prompt = ChatPromptTemplate.fromTemplate(`
        Your job now is to judge all of these critiques to see which one is the most
        thorough. You will return the index number that corresponds to the critique you find
        the most appropriate. Return only this number, and absolutely nothing else. Just the number that corresponds to the winning outline.
         You will ensure the results will conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Critiques to vote on: "{critique_bank}"
    `);
    const revise_outline_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that revises story outlines.
        Rewrite the following outline based on the provided critique. Don't return anything except for the rewritten outline and absolutely nothing else.
        Make sure to check for grammatical correctness, plot continuity, and adherence to the prompt information. Don't return anything before or after the rewritten outline, and don't return any supplementary commentary or reflections or any acknowledgement of the prompt itself.
        You will ensure the results
        are compatible with the style of this persona: "{persona}".

        Critique: "{critique}"

        Prompt information: "{prompt_info}"

        Outline: "{outline}"
    `);
    const vote_revise_outline_prompt = ChatPromptTemplate.fromTemplate(`
       Your job is to judge the outlines sent to you and decide on the best one. 
       These outlines will be used to generate stories, with LLMs generating entire 
       chapters based on each 1-2 sentence synopsis you see corresponding to each 
       chapter. You will choose the best outline, and you will make your decision 
       based on the logical continuity of the outline as well as its originality 
       and artistic merit. Do not return an explanation for your decision and don't 
       return the outlines themselves, just return the outline's index number. It's 
       extremely important that you ONLY return the index number of the outline you 
       prefer and absolutely nothing else.
       You will ensure the results conform to the style of this persona: "{persona}".

        Prompt information: "{prompt_info}"

        Stories to vote on: "{outline_bank}"
    `);
    const generate_outline = tool(async ({ persona, prompt_info }) => {
        const messages = await generate_outline_prompt.formatMessages({ persona, prompt_info });
        const res = await llm.invoke(messages);
        // Construct a new AIMessage using the res.content
        return new AIMessage({
            content: res.content,
        });
    }, {
        name: "generate_outline",
        description: "Generates a story outline based on the provided prompt information. The outline will include chapter titles and a brief description of each chapter. Decide length of the story yourself. Do not say anything else to the user, and do not return any acknowledgement of the prompt itself. ",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process.")
        })
    });
    const vote_generate_outline = tool(async ({ persona, prompt_info, outline_bank }) => {
        const messages = await vote_revise_outline_prompt.formatMessages({ persona, prompt_info, outline_bank });
        const res = await llm.withStructuredOutput(vote_revise_outline_output_schema).invoke(messages);
        return new AIMessage({ content: res });
    }, {
        name: "vote_generate_outline",
        description: "Votes on the different collected outlines. Outlines are stored as a 2-dimensional array, with rows corresponding to stories and columns corresponding to chapter summaries. The result will rank whichever row has the best sequence according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning outline.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            outline_bank: z.string().describe("The collection of outlines to be judged.")
        })
    });
    const critique_outline = tool(async ({ persona, prompt_info, outline }) => {
        const messages = await critique_outline_prompt.formatMessages({ persona, prompt_info, outline });
        const res = await llm.invoke(messages);
        return new AIMessage({
            content: res.content,
        });
    }, {
        name: "critique_outline",
        description: "Provides a critique of a given outline, analyzing grammatical correctness and adherence to the promptinfo. This critique will help in revising the outline to improve its quality.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            outline: z.string().describe("The outline to be critiqued.")
        })
    });
    const vote_critique_outline = tool(async ({ persona, prompt_info, critique_bank }) => {
        const messages = await vote_outline_critique_prompt.formatMessages({ persona, prompt_info, critique_bank });
        const res = await llm.withStructuredOutput(vote_critique_outline_output_schema).invoke(messages);
        return new AIMessage({ content: res });
    }, {
        name: "vote_critique_outline",
        description: "Votes on the different collected critiques. Outlines are stored as entries corresponding to chapter summaries. The result will rank whichever entry has the best sequence according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning outline.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            critique_bank: z.string().describe("The critiques to be judged.")
        })
    });
    const revise_outline = tool(async ({ persona, critique, prompt_info, outline }) => {
        const messages = await revise_outline_prompt.formatMessages({ persona, critique, prompt_info, outline });
        const res = await llm.invoke(messages);
        return new AIMessage({
            content: res.content,
        });
    }, {
        name: "revise_outline",
        description: "Revises a given outline to improve its quality based on feedback or critique.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            critique: z.string().describe("The critique to be applied to the outline."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            outline: z.string().describe("The outline to be revised.")
        })
    });
    const vote_revise_outline = tool(async ({ persona, prompt_info, outline_bank }) => {
        const messages = await vote_revise_outline_prompt.formatMessages({ persona, prompt_info, outline_bank });
        const res = await llm.withStructuredOutput(vote_revise_outline_output_schema).invoke(messages);
        return res;
    }, {
        name: "vote_revise_outline",
        description: "Votes on the different collected outlines. Outlines are stored as a 2-dimensional array, with rows corresponding to stories and columns corresponding to chapter summaries. The result will rank whichever row has the best sequence according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning outline.",
        schema: z.object({
            persona: z.string().describe("Information about the style the story has to implement."),
            prompt_info: z.string().describe("Information about the story prompt to guide the drafting process."),
            outline_bank: z.string().describe("The collection of outlines to be judged.")
        })
    });
    return [generate_outline, vote_generate_outline, critique_outline, vote_critique_outline, revise_outline, vote_revise_outline];
}
