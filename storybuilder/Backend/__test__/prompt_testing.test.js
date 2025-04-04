const promptadmin = require('../promptformatter.js');

describe('promptforming', () => {
      it('Should build a JSON prompt which contains a prompt with the user input placed inside, specifying the model type and the stream binary.', () => {
        let prompt = "Write a story about pirates.";
        var draft = promptadmin.draft(prompt);
        expect(draft).toEqual({
          model: "llama3.1-8b", // Use model names from API documentation for model provider
          messages: [
              { "role": "system", "content": `You are a helpful assistant. You will work in a Mechanical Turks style with other assistants to compose stories for users following a certain set of steps. The story will be written in chapters, and you will write the first chapter.`},
              { "role": "user", "content": `Write a story about pirates.`},
          ],
          stream: false, // Ensures a single response instead of a streamed response
      });
      });
      
      it('Should build a JSON prompt that asks to critique a story, and which provides the original prompt and the draft in its proper place', () => {
        let prompt = "Z";
        let outline = "Y";
        let story = "X";
        var crit = promptadmin.critique(prompt, story, outline);
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
        var crit = promptadmin.rewrite(prompt, chapter, critique);
        expect(crit).toEqual({
          model: "llama3.1-8b", 
          messages: [
              { "role": "system", "content": `You are now being fed a chapter written by another agent, along with a critique of that chapter and the original prompt information. Rewrite the chapter, improving it based upon the critique's observations. Make sure it's a similar chapter length, and do not change anything if it doesn't violate the critique parameters. Just return the rewritten chapter and nothing else.`},
              { "role": "user", "content":  `This is the prompt: Z\n\nThis is the critique: Y\n\nAnd this is the chapter: X`},
          ],
          stream: false, 
      });
      });
      
      it('Should build a JSON prompt that parses the stories in the storybank and places them in the prompt template.', () => {
        let promptinfo = "Write a story about pirates.";
        var storybank = [{story_index: 1, story: "X"}, {story_index: 2, story: "Y"}, {story_index: 3, story: "Z"}];
        var judgelist = promptadmin.judge(storybank, promptinfo);
        expect(judgelist).toEqual({
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
          var next = promptadmin.nextchapter(prompt, outline, chapter);
          expect(next).toEqual({
            model: "llama3.1-8b", 
            messages: [
                { "role": "system", "content": `You are now being fed a chapter written by another agent. You will continue the story in another chapter of roughly equal length while still following the guidelines established in the original prompt.`},
                { "role": "user", "content": `Write a story about pirates.\n\nStory outline: Y\n\n Chapter: X`},
            ],
            stream: false, 
        });
        });

        it('Should build a JSON prompt that asks the LLM to fill an array of chapter outlines, with each chapter having an entry. Each outline will be no longer than a couple of sentences, and it should be easily searchable.', () => {
          let prompt = "Write a story about pirates";
          let chaptercount = 3;
          var next = promptadmin.storyoutline(chaptercount, prompt);
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