import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:5000/api'
});
export const getAll = async () => {
  const response = await axios.get('/todos');
  return response.data;
};
export const createTodo = async (todo: { title: string; completed: boolean }) => {
  const response = await axios.post('/todos', todo);
  return response.data;
}