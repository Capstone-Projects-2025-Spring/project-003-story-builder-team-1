const prompt_admin = require('../prompt_formatter.js');

describe('prompt_forming', () => {
      it('Should build a JSON prompt which contains a prompt with the user input placed inside, specifying the model type and the stream binary.', () => {
        let prompt = "Write a story about pirates.";
        let outline = "X";
        var first_chapter = prompt_admin.first_chapter(prompt, outline);
        expect(first_chapter).toEqual({
          model: "llama3.1-8b", // Use model names from API documentation for model provider
          messages: [
              { "role": "system", "content": `You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. The story will be written in chapters, and you will write the first chapter.`},
              { "role": "user", "content": `This is the prompt: Write a story about pirates.\nThis is the story outline: X. \n\nYou will write the first chapter based on the chapter 1 summary above.`},
          ],
          stream: false, // Ensures a single response instead of a streamed response
      });
      });
      
      it('Should build a JSON prompt that asks to critique a story, and which provides the original prompt and the draft in its proper place', () => {
        let prompt = "Z";
        let outline = "Y";
        let story = "X";
        var crit = prompt_admin.critique(prompt, story, outline);
        expect(crit).toEqual({
          model: "llama3.1-8b", 
          messages: [
              { "role": "system", "content": `You are now being fed a chapter written by another agent. You will critique the drafting of this story based on grammatical correctness as well as its faithfulness to the style parameters that were specified. Do not rewrite the chapter.`},
              { "role": "user", "content":  `Z: Synopsis: Y\n\nChapter: X`},
          ],
          stream: false, 
      });
      });

      it('Should build a JSON prompt that asks to critique a story, and which provides the original prompt and the draft in its proper place', () => {
        let prompt = "Z";
        let chapter = "X";
        let critique = "Y";
        let outline = "A";
        var crit = prompt_admin.rewrite(prompt, chapter, critique, outline);
        expect(crit).toEqual({
          model: "llama3.1-8b", 
          messages: [
              { "role": "system", "content": `You are now being fed a chapter written by another agent, along with a critique of that chapter and the original prompt information. Rewrite the chapter, improving it based upon the critique's observations. Make sure it's a similar chapter length, and do not change anything if it doesn't violate the critique parameters. Just return the rewritten chapter and nothing else.`},
              { "role": "user", "content":  `This is the prompt: Z\n\nThis is the critique: Y\n\nThis is the outline of the entire story: A\n\nAnd this is the chapter: X`},
          ],
          stream: false, 
      });
      });
      
      it('Should build a JSON prompt that parses the stories in the storybank and places them in the prompt template.', () => {
        let prompt_info = "Write a story about pirates.";
        var story_bank = [{story_index: 1, story: "X"}, {story_index: 2, story: "Y"}, {story_index: 3, story: "Z"}];
        var judge_list = prompt_admin.judge(story_bank, prompt_info);
        expect(judge_list).toEqual({
          model: "llama3.1-8b", // Use model names from API documentation for model provider
          messages: [
              { "role": "system", "content": `Your job now is to judge all of these stories as objectively as you can based on the initial prompt information. You will choose the best story. Do not return an explanation for your decision and don't return the stories themselves, just return the story's index number.` },
              { "role": "user", "content": `Write a story about pirates.\n\nStory index number 1: X\n\nStory index number 2: Y\n\nStory index number 3: Z`},
          ],
          stream: false, 
      });
      });
      
      it('Should build a JSON prompt that asks to continue a story in a new chapter based on the previous chapter thats given as input.', () => {
          let prompt = "Write a story about pirates.";
          let chapter = "X";
          let outline = "Y"
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