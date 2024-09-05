"use client";

import { useEffect, useState } from 'react';
import { CopilotKit, useCopilotReadable, useCopilotAction } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { getBoards, getLists, getCards, addCard } from '../app/trelloApi';

export default function SpeakerManager() {
  const [boards, setBoards] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoards = async () => {
      const data = await getBoards();
      setBoards(data);
    };
    fetchBoards();
  }, []);

  useCopilotReadable({
    description: "List of open calls for proposals and submitted talks",
    value: cards,
  });

  useCopilotAction({
    name: "Add a new talk",
    description: "Add a new talk proposal to a list",
    parameters: [
      {
        name: "listId",
        type: "string",
        description: "The ID of the list to add the talk to",
        required: true,
      },
      {
        name: "talkTitle",
        type: "string",
        description: "The title of the talk",
        required: true,
      },
      {
        name: "talkDescription",
        type: "string",
        description: "A brief description of the talk",
        required: true,
      }
    ],
    handler: async ({ listId, talkTitle, talkDescription }) => {
      console.log("testsfdsfs");
      // const { listId, talkTitle, talkDescription } = params;
      await addCard(listId, talkTitle, talkDescription);
      setCards(await getCards(listId));
    },
    render: "Adding a new talk...",
  });

  const handleBoardSelection = async (boardId: string) => {
    const listsData = await getLists(boardId);
    setLists(listsData);
  };

  const handleListSelection = async (listId: string) => {
    setSelectedListId(listId);
    const cardsData = await getCards(listId);
    setCards(cardsData);
  };

  return (
    <div className="border rounded-md max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold">Speaker Events Management Assistant</h1>
      <h2 className="text-base font-base mb-4">Manage Your Talks in Trello with AI</h2>

      <CopilotKit
        publicApiKey={process.env.NEXT_PUBLIC_COPILOT_CLOUD_API_KEY}
        // Alternatively, you can use runtimeUrl to host your own CopilotKit Runtime
        // runtimeUrl="/api/copilotkit"
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Select Board</h2>
          <select className="border rounded-md p-2" onChange={(e) => handleBoardSelection(e.target.value)}>
            {boards.map((board: any) => (
              <option key={board.id} value={board.id}>{board.name}</option>
            ))}
          </select>
        </div>

        {lists.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Select List</h2>
            <select className="border rounded-md p-2" onChange={(e) => handleListSelection(e.target.value)}>
              {lists.map((list: any) => (
                <option key={list.id} value={list.id}>{list.name}</option>
              ))}
            </select>
          </div>
        )}

        {selectedListId && (
          <div>
            <h2 className="text-lg font-semibold">Submitted Talks</h2>
            <ul className="list-disc pl-5">
              {cards.map((card: any) => (
                <li key={card.id}>
                  Title: {card.name}, Description: {card.desc}
                </li>
              ))}
            </ul>
          </div>
        )}

        <CopilotPopup
          instructions={
            "Help the user manage their talks. If the user provides details of a new talk, " +
            "add it to the selected list."
          }
          defaultOpen={true}
          labels={{
            title: "Talk Management Copilot",
            initial: "Hi there! 👋 I can help you manage talks for your events.",
          }}
          clickOutsideToClose={false}
        />
      </CopilotKit>
    </div>
  );
}
