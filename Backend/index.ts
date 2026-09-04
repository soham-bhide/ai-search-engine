import express from "express";
import {tavily} from "@tavily/core";
import Openai from "openai";
const client = tavily

const app = express();
app.use(express.json());

app.post("/ask",async(req,res)=>{
    const query = req.body.query;
    const webSearchResponse = await client.search(query,{
        searchDepth:"advanced"
    });

    const weSearchResults = webSearchResponse.results;
})
app.listen(3000);