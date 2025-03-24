const promptadmin = require('../promptformatter.js');



describe('modelchange', () => {
    it('Should return a JSON prompt which upgrades the model from Llama 3.1 with 8 billion parameters to 3.2 with 8 billion parameters.', () => {
        let prompttemp = 
        {
            model: "llama3.1-8b", // Uses a cheaper model for a less intensive task
            messages: [
                { "role": "user", "content": "Return a list of style tags that correlate with this prompt: Return it so that I could just extract the list and append it to the end of a prompt, with commas and everything."}
            ],
            stream: false, // Ensures a single response instead of a streamed response
        };
        boost = promptadmin.boostmodel(prompttemp);
        expect(boost.model).toBe("llama3.1-8b")
    });


    it('Should return a JSON prompt which downgrades the model from Llama 3.2 with 8 billion parameters to 3.1 with 1 billion parameters.', () => {
        let prompttemp = 
        {
            model: "llama3.1-8b", // Uses a cheaper model for a less intensive task
            messages: [
                { "role": "user", "content": "Return a list of style tags that correlate with this prompt: Return it so that I could just extract the list and append it to the end of a prompt, with commas and everything."}
            ],
            stream: false, // Ensures a single response instead of a streamed response
        };
        degrade = promptadmin.degrademodel(prompttemp);
        expect(degrade.model).toBe("llama3.1-1b");
    });


    it('Should return a JSON prompt which returns the model from Llama 3.1 with 1 billion parameters to the DEFAULT 3.1 with 8 billion parameters.', () => {
        let prompttemp = 
        {
            model: "llama3.1-1b", // Uses a cheaper model for a less intensive task
            messages: [
                { "role": "user", "content": "Return a list of style tags that correlate with this prompt: Return it so that I could just extract the list and append it to the end of a prompt, with commas and everything."}
            ],
            stream: false, // Ensures a single response instead of a streamed response
        };
        def = promptadmin.defaultmodel(prompttemp);
        expect(def.model).toBe("llama3.1-8b");
    });
});