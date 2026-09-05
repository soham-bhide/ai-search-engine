import express from "express";
import { tavily } from "@tavily/core";
import { streamText } from "ai";
import { createGroq } from "@ai-sdk/groq";
import { PROMPT_TEMPLATE, SYSTEM_PROMPT } from "./prompt";

const app = express();
app.use(express.json());

const client = tavily({ apiKey: process.env.TAVILY_API_KEY });

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post("/ask", async (req, res) => {
    try{
        const query:string = req.body.query;
    
        const webSearch = await client.search(query,{searchDepth:'advanced'}) ;
        const webSearchResults =webSearch.results;
        
    const prompt = PROMPT_TEMPLATE.replace(
      "{{WEBSEARCHRESULTS}}",
      JSON.stringify(webSearchResults)
    ).replace("{{USERQUERY}}", query);


    const result = streamText({
    model: groq("openai/gpt-oss-20b"),
    prompt: prompt,
    system: SYSTEM_PROMPT,
    });
    res.setHeader("Content-Type","simple/text,charset=utf-8");

    for await (const textpart of result.textStream){
        res.write(textpart);
    }
    const finalsearchresults = webSearchResults.map((r) => r.url);
    res.setHeader("X-Sources",finalsearchresults)   
    res.write("<Sources>")
    res.write(JSON.stringify({sources:finalsearchresults}));
    res.write("</Sources>");
    res.end();


    }catch(err){
    console.error(err);
    if (!res.headersSent) {
      res.status(500).json({ error: "failed to generate answer" });
    } else {
      res.end();
    }

    }
});

app.listen(3000, () => console.log("backend running on 3000"));