export type Playlist = {
  _id: string;
  name: string;
  description: string;
  coverUrl: string;
  ownerId: string;
  songs: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
};
