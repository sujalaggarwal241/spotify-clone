export type Album = {
    id: number;
    title: string;
    artistId: number;
    coverUrl: string;
    songIds: number[];
    year: number
  };
  export const albums: Album[] = [
    {
      id: 1,
      title: "Chill Beats",
      artistId: 1,
      coverUrl: "/coverImages/1.jpg",
      songIds: [1, 2],
      year : 2012

    },
    {
      id: 2,
      title: "Urban Vibes",
      artistId: 1,
      coverUrl: "/coverImages/3.jpg",
      songIds: [3, 4],
      year: 2021
    },
    {
      id: 3,
      title: "Lofi Nights",
      artistId: 2,
      coverUrl: "/coverImages/5.jpg",
      songIds: [5, 6],
      year: 1999
    },
    {
      id: 4,
      title: "Evening Mood",
      artistId: 3,
      coverUrl: "/coverImages/7.jpg",
      songIds: [7, 8],
      year : 2025
    },
    {
      id: 5,
      title: "Daily Vibes",
      artistId: 4,
      coverUrl: "/coverImages/9.jpg",
      songIds: [9, 10],
      year: 1990
    },
    {
      id: 6,
      title: "Work Mode",
      artistId: 5,
      coverUrl: "/coverImages/11.jpg",
      songIds: [11, 12],
      year : 2000
    },
    {
      id: 7,
      title: "After Dark",
      artistId: 6,
      coverUrl: "/coverImages/13.jpg",
      songIds: [13, 14],
      year: 2014
    },
    {
      id: 8,
      title: "Late Hours",
      artistId: 7,
      coverUrl: "/coverImages/15.jpg",
      songIds: [15],
      year : 2020
    },
  ];
  