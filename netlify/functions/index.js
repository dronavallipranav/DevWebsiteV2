import { OpenAI } from 'langchain/llms';
import { RetrievalQAChain } from 'langchain/chains';
import { HNSWLib } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import * as fs from 'fs';

export const runWithEmbeddings = async (inputQuestion) => {

    const question = inputQuestion;
    const txtPath = `./data.txt`;
    const VECTOR_STORE_PATH = `data.index`;
    const model = new OpenAI({});

    let vectorStore;
    if (fs.existsSync(VECTOR_STORE_PATH)) {

      console.log('Vector Exists..');
      try {
        vectorStore = await HNSWLib.load(VECTOR_STORE_PATH, new OpenAIEmbeddings());
     } catch (err) {
        console.error("Error loading vector store:", err);
     }
    } 
    const chain = RetrievalQAChain.fromLLM(model, vectorStore.asRetriever());
  
    const res = await chain.call({
      query: question,
  });
  
  console.log({ res });
  
  return res;
  };