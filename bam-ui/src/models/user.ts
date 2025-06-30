type User = {
    name: string;
    idfNumber: number;
    email: string;
    password: string;
    isAdmin: boolean;
    tokens: [{ token: string, _id: string }];
    _id: string;
    __v: number;
};

export default User;