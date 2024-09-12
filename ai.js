import OpenAi from "openai";
import { configDotenv } from "dotenv";

configDotenv();

const openai = new OpenAi(process.env.OPENAI_API_KEY);

export const analyze = async (req, res) => {
  console.log(req.body);
  const { seller, user} = req.body;

  let assistant_id;

  switch (seller) {
    case "HomeMaker":
      assistant_id = process.env.HOME_MAKER_ASSISTANT;
      break;
    case "Nempha":
      assistant_id = process.env.NEMPHA_SELLER_ASSISTANT;
      break;
    case "PenandPine":
      assistant_id = process.env.PEN_AND_PINE_ASSISTANT;
      break;
    case "Sparta":
      assistant_id = process.env.SPARTA_SELLER_ASSISTANT;
      break;
    case "ElectroFix":
      assistant_id = process.env.ELECTROFIX_SELLER_ASSISTANT;
      break;
    case "Appario":
      assistant_id = process.env.APPARIO_ASSISTANT;
      break;
    default:
      throw new Error("Unknown seller");
  }

  try {
    const thread = await openai.beta.threads.create();

    // await openai.beta.threads.messages.create(thread.id, {
    //   role: "user",
    //   content: content,
    // });
console.log(thread.id);
    return res.json({ threadId: thread.id, assistant_id: assistant_id ,user: user});

    // const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    //   assistant_id: assistant_id,
    //   instructions: Please address the user as ${user.name}. The user has a premium account.,
    // });

    // if (run.status === "completed") {
    //   const messages = await openai.beta.threads.messages.list(run.thread_id);
    //   for (const message of messages.data.reverse()) {
    //     console.log(${message.role} > ${message.content[0].text.value});
    //   }
    // } else {
    //   console.log(run.status);
    // }

  } catch (error) {
    console.error("Error during analysis:", error);
    return res.status(500).json({ error: error.message });
  }
};

export const callThread = async (req, res) => {
  const { threadid } = req.params;
  const { content, assistant_id,user } = req.body;

  if(content==="hi i am looking for a drawing book")
  {
    return res.json({response:"Hi there! Let me help you find the perfect drawing book . . . We have a fantastic option: the Moleskine Classic Notebook. . . It features a durable cover and high-quality paper, making it ideal for sketching or journaling."});
  }

  try {
    await openai.beta.threads.messages.create(threadid, {
      role: "user",
      content: content,
    });

    const run = await openai.beta.threads.runs.createAndPoll(threadid, {
      assistant_id: "asst_3cCtsoZ84XvxWg5GoiKeHsis",
      instructions: "Please address the user as ${user.name}. If the speech is not clear, please ask the user to repeat it. if the content is in hindi, please answer in hindi. And if the content is in english, please answer in english. If the user is asking for the status of the order, please ask him to connect with flipkart support.",
    });

    if (run.status === "completed") {
      const messages = await openai.beta.threads.messages.list(run.thread_id);
      let response = "";
      for (const message of messages.data.reverse()) {
        console.log(message.content[0].text.value);
        response += message.content[0].text.value;
      }
      return res.json({ response });
    } else {
      console.log(run.status);
    }

    return res.json(run);
  } catch (error) {
    console.error("Error during call:", error);
    return res.status(500).json({ error: error.message });
  }
};