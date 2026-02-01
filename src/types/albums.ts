import { ObjectId } from "mongodb";

export type Album = {
    _id: ObjectId
    id: number;
    title: string;
    artistId: number;
    coverUrl: string;
    songIds: ObjectId[] | string[];
    year: number

  };