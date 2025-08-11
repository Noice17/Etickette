// src/api.ts
import axios from "axios";
import { UserDTO } from "@/app/Models/UserDTO";
import { LoginRequest } from "@/app/Models/LoginRequest";
import { RegisterDTO } from "@/app/Models/RegisterDTO";
import { TicketPayload } from "@/app/Models/TicketPayload";
import { TicketDTO } from "@/app/Models/TicketDTO";
import { CommentDTO } from "@/app/Models/CommentDTO";



const API_BASE_URL = "https://etickette-production.up.railway.app/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (credentials: LoginRequest) => {
  const response = await api.post<{ token: string; message: string }>(
    "/auth/login",
    credentials
  );
  const token = response.data.token;
  localStorage.setItem("token", token);

  // Fetch current user after login to get role
  const user = await getCurrentUser();
  if (user?.role) {
    localStorage.setItem("role", user.role);
    localStorage.setItem("id", user.id.toString());
  }

  return {
    message: response.data.message,
    token,
    user,
  };
};

export const register = async (userData: RegisterDTO) => {
  const response = await api.post<RegisterDTO>("/auth/register", userData);
  return response.data;
};

export const editSelf = async (userData: UserDTO) => {
  const response = await api.put<UserDTO>("/auth/edit", userData);
  return response.data;
};

// ===== User Endpoints =====

export const getCurrentUser = async (): Promise<UserDTO> => {
  const response = await api.get<UserDTO>("/users/me");
  return response.data;
};

export const getUserById = async (id: number): Promise<UserDTO> => {
  const response = await api.get<UserDTO>(`/users/${id}`);
  return response.data;
};

export const getAllUsers = async (): Promise<UserDTO[]> => {
  const response = await api.get<UserDTO[]>("/users");
  return response.data;
};

export const createUser = async (userData: FormData): Promise<UserDTO> => {
  const response = await api.post<UserDTO>("/users", userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateUser = async (
  id: number,
  userData: FormData
): Promise<UserDTO> => {
  const response = await api.put<UserDTO>(`/users/${id}`, userData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export default api;

// Add to your existing src/api.ts

// ===== Ticket Endpoints =====

// Create a ticket (CLIENT only)
export const createTicket = async (ticket: TicketPayload): Promise<TicketDTO> => {
  const response = await api.post<TicketDTO>("/tickets", ticket);
  return response.data;
};

// Get ticket by ID
export const getTicketById = async (id: number): Promise<TicketDTO> => {
  const response = await api.get<TicketDTO>(`/tickets/${id}`);
  return response.data;
};

// Update ticket (AGENT only)
export const updateTicket = async (id: number, ticket: TicketDTO): Promise<void> => {
  await api.put(`/tickets/${id}`, ticket);
};

// Delete ticket (AGENT only)
export const deleteTicket = async (id: number): Promise<void> => {
  await api.delete(`/tickets/${id}`);
};

// Get tickets by client ID 
export const getTicketsByClient = async (clientId: number): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>(`/tickets/client/${clientId}`);
  return response.data;
};

// Get tickets by agent ID (ADMIN only)
export const getTicketsByAgent = async (agentId: number): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>(`/tickets/agent/${agentId}`);
  return response.data;
};

// Get tickets by title
export const getTicketsByTitle = async (title: string): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>(`/tickets/title/${title}`);
  return response.data;
};

// Get tickets by status
export const getTicketsByStatus = async (status: string): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>(`/tickets/status/${status}`);
  return response.data;
};

// Get tickets by category
export const getTicketsByCategory = async (category: string): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>(`/tickets/category/${category}`);
  return response.data;
};

// Get tickets by description
export const getTicketsByDescription = async (desc: string): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>(`/tickets/description/${desc}`);
  return response.data;
};

// Get tickets by creation date (ISO format required)
export const getTicketsByCreatedAt = async (dateTime: string): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>(`/tickets/createdAt?dateTime=${dateTime}`);
  return response.data;
};

// Get tickets by resolution date (ISO format required)
export const getTicketsByResolvedAt = async (dateTime: string): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>(`/tickets/resolvedAt?dateTime=${dateTime}`);
  return response.data;
};

// Get all tickets
export const getAllTickets = async (): Promise<TicketDTO[]> => {
  const response = await api.get<TicketDTO[]>("/tickets/all");
  return response.data;
};

// ===== Metrics =====

export const getAvgResolutionTime = async (): Promise<number> => {
  const response = await api.get<number>("/tickets/metrics/average-resolution-time");
  return response.data;
};

export const getTotalTicketsCreated = async (): Promise<number> => {
  const response = await api.get<number>("/tickets/metrics/total-created");
  return response.data;
};

export const getTotalTicketsResolved = async (): Promise<number> => {
  const response = await api.get<number>("/tickets/metrics/total-resolved");
  return response.data;
};

export const getTicketStatusCount = async (): Promise<Record<string, number>> => {
  const response = await api.get<Record<string, number>>("/tickets/metrics/status-count");
  return response.data;
};

export const getAvgResolutionTimePerAgent = async (): Promise<Record<number, number>> => {
  const response = await api.get<Record<number, number>>("/tickets/metrics/agent-average-resolution");
  return response.data;
};

// ===== Rating Agent =====

export const rateAgent = async (ticketId: number, rating: number) => {
  const response = await api.put(
    `/tickets/${ticketId}/rate`,
    null, 
    { params: { rating } }
  );
  return response.data;
};

// Create a comment (CLIENT or AGENT)
export const createComment = async (comment: CommentDTO): Promise<CommentDTO> => {
  const response = await api.post<CommentDTO>("/comments", comment);
  return response.data;
};

// Get comments by ticket ID (CLIENT, AGENT, ADMIN)
export const getCommentsByTicket = async (ticketId: number): Promise<CommentDTO[]> => {
  const response = await api.get<CommentDTO[]>(`/comments/ticket/${ticketId}`);
  return response.data;
};

// Get comments by user ID (ADMIN only)
export const getCommentsByUser = async (userId: number): Promise<CommentDTO[]> => {
  const response = await api.get<CommentDTO[]>(`/comments/user/${userId}`);
  return response.data;
};

// Get comments containing a specific message (ADMIN only)
export const getCommentsByMessage = async (message: string): Promise<CommentDTO[]> => {
  const response = await api.get<CommentDTO[]>(`/comments/message/${message}`);
  return response.data;
};

// Get comments by creation date (ADMIN only) — dateTime in ISO format
export const getCommentsByCreatedAt = async (dateTime: string): Promise<CommentDTO[]> => {
  const response = await api.get<CommentDTO[]>(`/comments/createdAt?dateTime=${dateTime}`);
  return response.data;
};

