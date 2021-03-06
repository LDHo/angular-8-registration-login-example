export class User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    birthday?: string;
    ssn?: string;
}

export class UserRegisterRequestPayload {
    email: string;
    password: string;
}


export class LoginResponse {
    token: string;
}