export interface UserType {
    id: string
    email: string
    phone: string
    name: string
    status: string
    role: UserRole
    imageUrl?: string
    creatAt: Date
    updatedAt: Date
}


export enum UserRole {
    EDITOR = 'editor',
    ADMIN = 'admin',
    USER = 'user',
}