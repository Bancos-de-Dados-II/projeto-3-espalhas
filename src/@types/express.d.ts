declare namespace Express {
  export interface Request {
    userId: string;
    userType: 'Admin' | 'AssistenteSocial';
  }
}
