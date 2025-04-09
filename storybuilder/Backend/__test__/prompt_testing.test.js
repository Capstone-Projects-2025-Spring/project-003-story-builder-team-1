const prompt_admin = require('../prompt_formatter.js');

describe('prompt_forming', () => {
      it('Should build a JSON prompt which contains a prompt with the user input placed inside, specifying the model type and the stream binary.', () => {
        let prompt = "Write a story about pirates.";
        let outline = "X";
        var first_chapter = prompt_admin.first_chapter(prompt, outline);
        expect(first_chapter).toEqual({
          model: "llama3.1-8b", // Use model names from API documentation for model provider
          messages: [
              { "role": "system", "content": `You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. The story will be written in chapters, and you will write the first chapter. It's very important that you don't return anything except for the chapter itself.`},
              { "role": "user", "content": `This is the prompt: Write a story about pirates.\nThis is the story outline: X. \n\nYou will write the first chapter based on the chapter 1 summary above.`},
          ],
          stream: false, // Ensures a single response instead of a streamed response
      });
      });
      
      it('Should build a JSON prompt that asks to critique a chapter, and which provides the original prompt and the draft in its proper place', () => {
        let prompt = "Z";
        let outline = "Y";
        let story = "X";
        var crit = prompt_admin.critique_chapter(prompt, story, outline);
        expect(crit).toEqual({
          model: "llama3.1-8b", 
          messages: [
              { "role": "system", "content": `You are now being fed a chapter written by another agent. You will critique the drafting of this chapter based on grammatical correctness as well as its faithfulness to the style parameters that were specified, and the previous chapters. Do not rewrite the chapter. It's very important that you ONLY return the critique and nothing else.`},
              { "role": "user", "content":  `Z: Synopsis: Y\n\nChapter: X`},
          ],
          stream: false, 
      });
      });

      it('Should build a JSON prompt that asks to critique a story outline, and which provides the original prompt and the draft in its proper place', () => {
        let prompt = "Z";
        let outline = "Y";
        let story = "X";
        var crit = prompt_admin.critique_outline(prompt, story, outline);
        expect(crit).toEqual({
          model: "llama3.1-8b", 
          messages: [
              { "role": "system", "content": `You are now being fed an outline written by another agent. You will critique this outline based on grammatical correctness as well as its faithfulness to the style parameters that were specified. Do not rewrite the outline. It is very important that you ONLY return the critique of the outline and nothing else.`},
              { "role": "user", "content":  `Z: Synopsis: Y`},
          ],
          stream: false, 
      });
      });

      it('Should build a JSON prompt that asks to rewrite a chapter, and which provides the original prompt and the draft in its proper place', () => {
        let prompt = "Z";
        let chapter = "X";
        let critique = "Y";
        let outline = "A";
        var crit = prompt_admin.rewrite(prompt, chapter, critique, outline);
        expect(crit).toEqual({
          model: "llama3.1-8b", 
          messages: [
              { "role": "system", "content": `You are now being fed a chapter written by another agent, along with a critique of that chapter and the original prompt information. Rewrite the chapter, improving it based upon the critique's observations. Make sure it's a similar chapter length, and do not change anything if it doesn't violate the critique parameters. It's very important that you just return the rewritten chapter and nothing else.`},
              { "role": "user", "content":  `This is the prompt: Z\n\nThis is the critique: Y\n\nThis is the outline of the entire story: A\n\nAnd this is the chapter: X`},
          ],
          stream: false, 
      });
      });
      
      it('Should build a JSON prompt that parses the stories in the storybank and places them in the prompt template.', () => {
        let prompt_info = "Write a story about pirates.";
        var story_bank = [{story_index: 1, story: "X"}, {story_index: 2, story: "Y"}, {story_index: 3, story: "Z"}];
        var judge_list = prompt_admin.judge_stories(story_bank, prompt_info);
        expect(judge_list).toEqual({
          model: "llama3.1-8b", // Use model names from API documentation for model provider
          messages: [
              { "role": "system", "content": `Your job now is to judge all of these stories as objectively as you can based on the initial prompt information. You will choose the best story. Do not return an explanation for your decision and don't return the stories themselves, just return the story's index number. It's extremely important that you ONLY return the index number of the story you prefer and absolutely nothing else.` },
              { "role": "user", "content": `Write a story about pirates.\n\nStory index number 1: X\n\nStory index number 2: Y\n\nStory index number 3: Z`},
          ],
          stream: false, 
      });
      });

      it('Should build a JSON prompt that parses the outlines in the storybank and places them in the prompt template.', () => {
        let prompt_info = "Write a story about pirates.";
        var outline_bank = [{outline_index: 1, outline: "X"}, {outline_index: 2, outline: "Y"}, {outline_index: 3, outline: "Z"}];
        var judge_list = prompt_admin.judge_outlines(outline_bank, prompt_info);
        expect(judge_list).toEqual({
          model: "llama3.1-8b", // Use model names from API documentation for model provider
          messages: [
              { "role": "system", "content": `Your job is to judge the outlines sent to you and decide on the best one. These outlines will be used to generate stories, with LLMs generating entire chapters based on each 1-2 sentence synopsis you see corresponding to each chapter. You will choose the best outline, and you will make your decision based on the logical continuity of the outline as well as its originality and artistic merit. Do not return an explanation for your decision and don't return the outlines themselves, just return the outline's index number. It's extremely important that you ONLY return the index number of the outline you prefer and absolutely notihng else.` },
              { "role": "user", "content": `This is the prompt you will use to judge the outlines:${prompt_info}\n\nAnd these are the outlines:\nOutline index number 1: X\n\nOutline index number 2: Y\n\nOutline index number 3: Z` },
          ],
          stream: false, 
      });
      });

      it('Should build a JSON prompt that parses the chapters in the storybank and places them in the prompt template.', () => {
        let prompt_info = "Write a story about pirates.";
        var previous_chapters = "Y";
        var chapter_bank = [{chapter_index: 1, chapter: "X"}, {chapter_index: 2, chapter: "Y"}, {chapter_index: 3, chapter: "Z"}];
        var judge_list = prompt_admin.judge_chapters(chapter_bank, prompt_info, previous_chapters);
        expect(judge_list).toEqual({
          model: "llama3.1-8b", // Use model names from API documentation for model provider
          messages: [
              { "role": "system", "content": `Your job now is to judge all of these chapters as objectively as you can based on the initial prompt information. You will choose the best chapter based on its grammatical correctness and artistic merit, in addition to how well it fits with the previous chapters in the story. Do not return an explanation for your decision and don't return the stories themselves, just return the story's index number. It's extremely important that you ONLY return the index number of the chapter you prefer and absolutely notihng else.` },
              { "role": "user", "content": `The original prompt:\nWrite a story about pirates.\n\nPrevious chapters in the story you will compare these chapters to: Y\n\nAll chapters you will judge:\n\nChapter index number 1: X\n\nChapter index number 2: Y\n\nChapter index number 3: Z` },
          ],
          stream: false, 
      });
      });
      
      it('Should build a JSON prompt that asks to continue a story in a new chapter based on the previous chapter thats given as input.', () => {
          let prompt = "Write a story about pirates.";
          let chapter = "X";
          let outline = "Y";
          let chapter_count = 2;
          var next = prompt_admin.next_chapter(prompt, outline, chapter, chapter_count);
          expect(next).toEqual({
            model: "llama3.1-8b", 
            messages: [
                { "role": "system", "content": `You are now being fed a chapter written by another agent. You will continue the story in another chapter of roughly equal length while still following the guidelines established in the original prompt.`},
                { "role": "user", "content": `Write a story about pirates.\n\nPrevious chapter(s) whose story you're continuing: X\n\nStory outline: Y\n\n Write chapter 3.`},
            ],
            stream: false, 
        });
        });

        it('Should build a JSON prompt that asks to regenerate a chapter based on the original chapter thats given as input.', () => {
          let prompt = "Write a story about pirates.";
          let chapter = "X";
          let outline = "Y";
          let chapter_count = 2;
          var next = prompt_admin.regenerate(prompt, outline, chapter, chapter_count);
          expect(next).toEqual({
            model: "llama3.1-8b", 
            messages: [
                { "role": "system", "content": `You are now being fed a chapter written by another agent. You will regenerate chapter, keeping the length roughly equal length still following the guidelines established in the original prompt.`},
                { "role": "user", "content": `Write a story about pirates.\n\nAll previous chapters. The chapter you're regenerating is chapter 2: X\n\nStory outline: Y\n\n`},
            ],
            stream: false, 
        });
        });

        it('Should build a JSON prompt that asks the LLM to fill an array of chapter outlines, with each chapter having an entry. Each outline will be no longer than a couple of sentences, and it should be easily searchable.', () => {
          let prompt = "Write a story about pirates";
          let chapter_count = 3;
          var next = prompt_admin.story_outline(chapter_count, prompt);
          expect(next).toEqual({
            model: "llama3.1-8b", 
            messages: [
                { "role": "system", "content": `The following is a prompt for a story that will be split into 3 chapters. You will write an outline for each chapter, no more than two sentences for each chapter. You will fill the provided list with a summary of each chapter.`},
                { "role": "user", "content": `Write a story about pirates:\n\n Chapter 1: (Fill this entry)\nChapter 2: (Fill this entry)\nChapter 3: (Fill this entry)`},
            ],
            stream: false, 
        });
        });
      
})