export interface Project {
  name: string;
  description: string;
  _id: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  githubId?: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  logIn: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logOut: () => void;
  token: string | null;
  setToken: (token: string | null) => void;
}

// export interface Task {
//   _id: string;
//   title: string;
//   description?: string;
//   status: TaskStatus;
// }