import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_TRELLO_API_KEY;
const TOKEN = process.env.NEXT_PUBLIC_TRELLO_OAUTH_TOKEN;

const instance = axios.create({
  baseURL: 'https://api.trello.com/1/',
  params: {
    key: API_KEY,
    token: TOKEN,
  }
});

export const getBoards = async () => {
  const response = await instance.get('members/me/boards');
  return response.data;
};

export const getLists = async (boardId: string) => {
  const response = await instance.get(`boards/${boardId}/lists`);
  return response.data;
};

export const getCards = async (listId: string) => {
  const response = await instance.get(`lists/${listId}/cards`);
  return response.data;
};

export const addCard = async (listId: string, cardName: string, cardDescription: string) => {
  const response = await instance.post(`cards`, {
    name: cardName,
    desc: cardDescription,
    idList: listId,
  });
  return response.data;
};
