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
    const outline_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that creates story outlines. You will only ever make one tool call
        Create a detailed outline where you decide the number of chapters based on the following idea:

        "{promptinfo}"
    `);

    const critique_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that critiques story outlines.
        Critique the following outline based on the provided prompt information.
        Make sure to check for grammatical correctness and adherence to the prompt information.

        Prompt information: "{promptinfo}"        

        Outline: "{outline}"
    `);

    const revise_prompt = ChatPromptTemplate.fromTemplate(`
        You are a helpful assistant that revises story outlines.
        Revise the following outline based on the provided critique.
        Make sure to check for grammatical correctness and adherence to the prompt information.

        Critique: "{critique}"

        Outline: "{outline}"
    `);

    const story_outline = tool(
        async ({ promptinfo }: {promptinfo: string}) => {
            const messages = await outline_prompt.formatMessages({ promptinfo });

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
        async ({ promptinfo, outline }: {promptinfo: string, outline: string}) => {
            const messages = await critique_prompt.formatMessages({ promptinfo, outline });

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

    const revise_outline = tool(
        async ({ critique, outline }: {critique: string, outline: string}) => {
            const messages = await revise_prompt.formatMessages({ critique , outline });

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

    return  [story_outline, critique_outline, revise_outline];
}
