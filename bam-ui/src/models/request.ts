import User from "./user";

type Request = {
    _id: string,
    owner: User;
    description: string;
    explanation: string;
    status: {
        state: string;
        details?: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
};

export default Request;