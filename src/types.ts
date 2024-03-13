export interface Person {
    name: string;
    age?: number;
}

export type Person2 = {
    name: string;
    age: number;
};

export type PersonName = string;

export type GetPersonNameFunc = (p: Person | Person2) => string;
