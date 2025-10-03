export interface AuthResponse {
    user:         User;
    access_token: string;
}

export interface User {
    uuid:       string;
    role:       string;
    from:       string;
    redirectTo: string;
    data:       UserData;
}



export interface UserData {
    displayName: string;
    photoURL:    string;
    email:       string;
    shortcuts:   any[];
    settings:    null;
}