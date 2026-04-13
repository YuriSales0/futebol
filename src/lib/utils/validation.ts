import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date)
    const age = Math.floor((Date.now() - dob.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    return age >= 10 && age <= 30
  }, 'Idade deve ser entre 10 e 30 anos'),
  position: z.enum([
    'goleiro', 'zagueiro', 'lateral_direito', 'lateral_esquerdo',
    'volante', 'meia', 'ponta_direita', 'ponta_esquerda', 'centroavante',
  ]),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Selecione um estado'),
  guardianName: z.string().optional(),
  guardianEmail: z.string().email('E-mail do responsável inválido').optional(),
  guardianRelationship: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas não coincidem',
  path: ['confirmPassword'],
})

export type SignUpFormData = z.infer<typeof signUpSchema>

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const playerProfileSchema = z.object({
  fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  nickname: z.string().optional(),
  position: z.enum([
    'goleiro', 'zagueiro', 'lateral_direito', 'lateral_esquerdo',
    'volante', 'meia', 'ponta_direita', 'ponta_esquerda', 'centroavante',
  ]),
  secondaryPosition: z.enum([
    'goleiro', 'zagueiro', 'lateral_direito', 'lateral_esquerdo',
    'volante', 'meia', 'ponta_direita', 'ponta_esquerda', 'centroavante',
  ]).optional(),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Selecione um estado'),
  heightCm: z.number().min(100).max(220).optional(),
  preferredFoot: z.enum(['direito', 'esquerdo', 'ambos']).optional(),
  currentClub: z.string().optional(),
  bio: z.string().max(500, 'Bio deve ter no máximo 500 caracteres').optional(),
})

export type PlayerProfileFormData = z.infer<typeof playerProfileSchema>

export const dimensionEntrySchema = z.object({
  videoId: z.string().uuid('Selecione um vídeo'),
  startTimeSeconds: z.number().min(0, 'Tempo inicial inválido'),
  endTimeSeconds: z.number().min(1, 'Tempo final inválido'),
  description: z.string().min(10, 'Descreva a jogada com pelo menos 10 caracteres').max(500),
  selfScore: z.number().min(1).max(10).optional(),
}).refine((data) => data.endTimeSeconds > data.startTimeSeconds, {
  message: 'Tempo final deve ser maior que o inicial',
  path: ['endTimeSeconds'],
})

export type DimensionEntryFormData = z.infer<typeof dimensionEntrySchema>

export const videoUploadSchema = z.object({
  matchDate: z.string().optional(),
  matchDescription: z.string().max(200).optional(),
})

export type VideoUploadFormData = z.infer<typeof videoUploadSchema>
