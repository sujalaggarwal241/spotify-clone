import { ObjectId } from "mongodb";

export type Artist = {
    _id : ObjectId
    id: number;
    name: string;
    imageUrl: string;
    monthlyListeners: number;

};