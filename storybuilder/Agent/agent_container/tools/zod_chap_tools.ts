import { tool } from "@langchain/core/tools"
import { z } from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatDeepSeek } from "@langchain/deepseek";
import { stream_handler } from "../stream_handler.js";
import { ChatOpenAI } from "@langchain/openai";
import { AIMessage } from "@langchain/core/messages";export default function outline_tools(llm: ChatOpenAI | ChatDeepSeek) {
        
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
    const chapter_prompt = ChatPromptTemplate.fromTemplate(`
        System (Shakespeare Style):
        You are an agent that speaks and reasons in the style of William Shakespeare.
        • Use blank verse (unrhymed iambic pentameter) whenever possible.
        • Employ archaic pronouns (“thou,” “thee,” “thy”) and elevated diction.
        • Weave in vivid metaphors, antitheses, and rhetorical questions.
        • Reveal inner thoughts as if in a soliloquy, blending poetry with dramatic flair.        
        
        Create a detailed second chapter based on the following outline and prompt information
        Always use the same chapter title as the outline.: 

        Prompt information: "{promptinfo}"

        Outline: "{outline}"
    `);

    const critique_prompt = ChatPromptTemplate.fromTemplate(`
        System (Shakespeare Style):
        You are an agent that speaks and reasons in the style of William Shakespeare.
        • Use blank verse (unrhymed iambic pentameter) whenever possible.
        • Employ archaic pronouns (“thou,” “thee,” “thy”) and elevated diction.
        • Weave in vivid metaphors, antitheses, and rhetorical questions.
        • Reveal inner thoughts as if in a soliloquy, blending poetry with dramatic flair.   
        Critique the following chapter based on the provided prompt information.
        Make sure to check for grammatical correctness and adherence to the prompt information.

        Prompt information: "{promptinfo}"        

        Chapter: "{chapter}"
    `);

    const revise_prompt = ChatPromptTemplate.fromTemplate(`
        System (Shakespeare Style):
        You are an agent that speaks and reasons in the style of William Shakespeare.
        • Use blank verse (unrhymed iambic pentameter) whenever possible.
        • Employ archaic pronouns (“thou,” “thee,” “thy”) and elevated diction.
        • Weave in vivid metaphors, antitheses, and rhetorical questions.
        • Reveal inner thoughts as if in a soliloquy, blending poetry with dramatic flair.   
        Revise the following chapter based on the provided critique.
        Make sure to check for grammatical correctness and adherence to the prompt information.

        Critique: "{critique}"

        Chapter: "{chapter}"
    `);

    const first_chapter = tool(
        async ({ promptinfo, outline }: {promptinfo: string, outline: string}) => {
            const messages = await chapter_prompt.formatMessages({ promptinfo, outline });

            const res = await llm.invoke(messages);

        // Construct a new AIMessage using the res.content
        return new AIMessage({
            content: res.content,
        });
        },
        {
        name: "draft_chapter",
        description: "Generates a chapter of a story based on the provided outline and prompt information. The chapter should be detailed and follow the structure of the outline.",
        schema: z.object({
            promptinfo: z.string().describe("Information about the story prompt to guide the drafting process."),
            outline: z.string().describe("The outline to be followed for the first chapter.")
        })
        }
    );

    const critique_chapter = tool(
        async ({ promptinfo, chapter }: {promptinfo: string, chapter: string}) => {
            const messages = await critique_prompt.formatMessages({ promptinfo, chapter });

            const res = await llm.invoke(messages);
            return new AIMessage({
                content: res.content,
            });
        },
        {
        name: "critique_chapter",
        description: "Provides a critique of a given chapter, analyzing grammatical correctness and adherence to the promptinfo. This critique will help in revising the chapter to improve its quality.",
        schema: z.object({
            promptinfo: z.string().describe("The prompt that is to be followed."),
            chapter: z.string().describe("The outline to be critiqued.")
        })
        }
    );

    const revise_chapter = tool(
        async ({ critique, chapter }: {critique: string, chapter: string}) => {
            const messages = await revise_prompt.formatMessages({ critique , chapter });

            const res = await llm.invoke(messages);
            return new AIMessage({
                content: res.content,
            });
        },
        {
        name: "revise_outline",
        description: "Revises a given chapter to improve its quality based on feedback or critique.",
        schema: z.object({
            critique: z.string().describe("The critique to be applied to the chapter."),
            chapter: z.string().describe("The chapter to be revised.")
        })
        }
    );

    return  [first_chapter, critique_chapter, revise_chapter];
}