const prompt_admin = require('../prompt_formatter.js');

describe('binary_stream', () => {
    it('Creates a JSON prompt with the binary stream altered to "true" from "false"', () => {
        let prompt = {
            model: "llama3.1-8b", 
            messages: [
                { "role": "user", "content": "You are now being fed a chapter written by another agent. You will continue the story in another chapter of roughly equal length while still following the guidelines established in the original prompt. The prompt is: 'Write a story about pirates.', and the most recent chapter of this story is: 'X'" }
            ],
            stream: false, 
        };
        var prompt_stream = prompt_admin.set_stream(prompt, true);
        expect(prompt_stream.stream).toEqual(true);
      });
})