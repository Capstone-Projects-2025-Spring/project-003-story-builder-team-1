import { tool } from "@langchain/core/tools"
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatDeepSeek } from "@langchain/deepseek";
import { stream_handler } from "../stream_handler.js";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage } from "@langchain/core/messages";

export default function outline_tools(llm: ChatOpenAI | ChatDeepSeek) {
        
    // 1) Define the exact shape you want:
    const outline_schema = z.object({
        chapters: z.array(
        z.object({
            title: z.string(),
            summary: z.string(),
        })
        ),
        totalChapters: z.number(),
    });
    // Prompt
    const generate_outline_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that creates story outlines. You will only ever make one tool call.
        You will ensure the results are compatible with the style of "{agent_name}".
        Create a detailed outline where you decide the number of chapters based on the following idea:

        "{prompt_info}"
    `);

    const critique_outline_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that critiques story outlines.
       You are now being fed an outline written by another agent. 
       You will critique this outline based on grammatical correctness 
       as well as its faithfulness to the style parameters that were specified. 
       Do not rewrite the outline. It is very important that you ONLY return 
       the critique of the outline and nothing else. You will ensure the results
        are compatible with the style of "{agent_name}".

        Prompt information: "{prompt_info}"        

        Outline: "{outline}"
    `);

    const rewrite_outline_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that revises story outlines.
        Rewrite the following outline based on the provided critique.
        Make sure to check for grammatical correctness, plot continuity, and adherence to the prompt information.
        You will ensure the results
        are compatible with the style of "{agent_name}".

        Critique: "{critique}"

        Prompt information: "{prompt_info}"

        Outline: "{outline}"
    `);

    const vote_outline_prompt = ChatPromptTemplate.fromTemplate(`
       Your job is to judge the outlines sent to you and decide on the best one. 
       These outlines will be used to generate stories, with LLMs generating entire 
       chapters based on each 1-2 sentence synopsis you see corresponding to each 
       chapter. You will choose the best outline, and you will make your decision 
       based on the logical continuity of the outline as well as its originality 
       and artistic merit. Do not return an explanation for your decision and don't 
       return the outlines themselves, just return the outline's index number. It's 
       extremely important that you ONLY return the index number of the outline you 
       prefer and absolutely nothing else.
       You will ensure the results conform to the style of "{agent_name}".

        Prompt information: "{prompt_info}"

        Stories to vote on: "{outline_bank}"
    `)

    const generate_story_outline = tool(
        async ({ agent_name, prompt_info }: {agent_name: string, prompt_info: string}) => {
            const messages = await generate_outline_prompt.formatMessages({agent_name, prompt_info });

            const res = await llm.invoke(messages);

        // Construct a new AIMessage using the res.content
        return new AIMessage({
            content: res.content,
        });
        },
        {
        name: "story_outline",
        description: "Generates a story outline based on the provided prompt information. The outline will include chapter titles and a brief description of each chapter. Decide length of the story yourself. Do not say anything else to the user. ",
        schema: z.object({
            promptinfo: z.string().describe("Information about the story prompt to guide the drafting process.")
        })
        }
    );

    const critique_outline = tool(
        async ({ agent_name, prompt_info, outline }: {agent_name: string, prompt_info: string, outline: string}) => {
            const messages = await critique_outline_prompt.formatMessages({ agent_name, prompt_info, outline });

            const res = await llm.invoke(messages);
            return new AIMessage({
                content: res.content,
            });
        },
        {
        name: "critique_outline",
        description: "Provides a critique of a given outline, analyzing grammatical correctness and adherence to the promptinfo. This critique will help in revising the outline to improve its quality.",
        schema: z.object({
            promptinfo: z.string().describe("The outline that is to be followed."),
            outline: z.string().describe("The outline to be critiqued.")
        })
        }
    );

    const rewrite_outline = tool(
        async ({ agent_name, critique, prompt_info, outline }: {agent_name: string, critique: string, prompt_info: string, outline: string}) => {
            const messages = await rewrite_outline_prompt.formatMessages({ agent_name, critique , prompt_info, outline });

            const res = await llm.invoke(messages);
            return new AIMessage({
                content: res.content,
            });
        },
        {
        name: "revise_outline",
        description: "Revises a given outline to improve its quality based on feedback or critique.",
        schema: z.object({
            critique: z.string().describe("The critique to be applied to the outline."),
            outline: z.string().describe("The outline to be revised.")
        })
        }
    );

    const vote_outline = tool(
        async ({agent_name, prompt_info, outline_bank }: {agent_name: string, prompt_info: string, outline_bank: string}) => {
            const messages = await vote_outline_prompt.formatMessages({agent_name, prompt_info, outline_bank });

            const res = await llm.invoke(messages);
            return res.content;
        },
        {
        name: "vote_outline",
        description: "Votes on the different collected outlines. Outlines are stored as a 2-dimensional array, with rows corresponding to stories and columns corresponding to chapter summaries. The result will rank whichever row has the best sequence according to the parameters established in the agent information and initial prompt info. It does not return anything except for the index number of the winning outline.",
        schema: z.object({
            critique: z.string().describe("The critique to be applied to the outline."),
            outline: z.string().describe("The outline to be revised.")
        })
        }
    );

    return  [generate_story_outline, critique_outline, rewrite_outline, vote_outline];
}
