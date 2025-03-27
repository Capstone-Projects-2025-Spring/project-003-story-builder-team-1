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
        let prompt = "Write a story about pirates.";
        let story = "X";
        var crit = promptadmin.critique(prompt, story);
        expect(crit).toEqual({
          model: "llama3.1-8b", 
          messages: [
              { "role": "system", "content": "You are now being fed a chapter written by another agent. You will critique the drafting of this story based on grammatical correctness as well as its faithfulness to the style parameters that were specified."},
              { "role": "user", "content": "Write a story about pirates."},
              { "role": "assistant", "content": "X"},
          ],
          stream: false, 
      });
      });
      
      it('Should build a JSON prompt that parses the stories in the storybank and places them in the prompt template.', () => {
        let storybank = "Judge a story about pirates: X";
        var judgelist = promptadmin.judge(storybank);
        expect(judgelist).toEqual({
          model: "llama3.1-8b", // Use model names from API documentation for model provider
          messages: [
              { "role": "user", "content": "Your job now is to judge all of these stories as objectively as you can based on the initial prompt information. Each of these stories have gone through two drafting sessions, now you will rank them from best to worst. Judge a story about pirates: X"}
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
                { "role": "user", "content": `Write a story about pirates.\n\nStory outline: Y`},
                { "role": "assistant", "content": `X`},
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