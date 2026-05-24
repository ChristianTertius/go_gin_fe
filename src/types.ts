export type Comment = {
  id: number
  username: string
  content: string
  like_count: number
  created_at: string
  updated_at: string
}

export type Post = {
  id: number
  title: string
  username: string
  content: string
  like_count: number
  comments: Comment[]
  created_at: string
  updated_at: string
}

export type PaginatedPosts = {
  total_page: number
  current_page: number
  limit: number
  data: Post[]
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  email: string
  username: string
  password: string
  password_confirm: string
}

export type CreateOrUpdatePostPayload = {
  title: string
  content: string
}

export type CommentPayload = {
  post_id: number
  content: string
}

export type LikePostPayload = {
  post_id: number
}

export type LikeCommentPayload = {
  comment_id: number
}

export type TokenPair = {
  accessToken: string | null
  refreshToken: string | null
}

export type TokenResponse = {
  token: string
  refresh_token: string
}

export type UserProfile = {
  id: number
  username: string
}

export type ApiError = {
  message?: string
}
