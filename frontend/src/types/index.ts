export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
}
