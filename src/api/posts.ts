import { api } from '../lib/api'
import type {
  CommentPayload,
  CreateOrUpdatePostPayload,
  LikeCommentPayload,
  LikePostPayload,
  PaginatedPosts,
  Post,
} from '../types'

export const fetchPosts = async (page = 1, limit = 10) => {
  const { data } = await api.get<PaginatedPosts>('/tweets/', {
    params: { page, limit },
  })
  return data
}

export const fetchPostById = async (id: number) => {
  const { data } = await api.get<Post>(`/tweets/${id}/detail`)
  return data
}

export const createPostRequest = async (payload: CreateOrUpdatePostPayload) => {
  const { data } = await api.post<{ id: number }>('/tweets/', payload)
  return data
}

export const updatePostRequest = async (id: number, payload: CreateOrUpdatePostPayload) => {
  const { data } = await api.put<{ id: number }>(`/tweets/${id}/update`, payload)
  return data
}

export const deletePostRequest = async (id: number) => {
  const { data } = await api.delete<{ message: string }>(`/tweets/${id}/delete`)
  return data
}

export const likeOrUnlikePostRequest = async (payload: LikePostPayload) => {
  const { data } = await api.post<{ message: string }>('/tweets/action', payload)
  return data
}

export const createCommentRequest = async (payload: CommentPayload) => {
  const { data } = await api.post<{ message: string }>('/comments/', payload)
  return data
}

export const likeOrUnlikeCommentRequest = async (payload: LikeCommentPayload) => {
  const { data } = await api.post<{ message: string }>('/comments/action', payload)
  return data
}
