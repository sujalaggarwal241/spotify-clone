export type Song = {
  id: number;
  title: string;
  duration: number;
  audioUrl: string;
  coverUrl: string;
  streams: number;
  artistId: number;
  albumId: number;
};
export const songs: Song[] = [
  { id: 1, title: "Midnight Drive", duration: 210, audioUrl: "/songFiles/1.mp3", coverUrl: "/coverImages/1.jpg", streams: 125000, artistId: 1, albumId: 1 },
  { id: 2, title: "Late Night Thoughts", duration: 195, audioUrl: "/songFiles/2.mp3", coverUrl: "/coverImages/2.jpg", streams: 98000, artistId: 1, albumId: 1 },

  { id: 3, title: "City Lights", duration: 202, audioUrl: "/songFiles/3.mp3", coverUrl: "/coverImages/3.jpg", streams: 143000, artistId: 1, albumId: 2 },
  { id: 4, title: "Slow Motion", duration: 188, audioUrl: "/songFiles/4.mp3", coverUrl: "/coverImages/4.jpg", streams: 87000, artistId: 2, albumId: 2 },

  { id: 5, title: "Dream State", duration: 216, audioUrl: "/songFiles/5.mp3", coverUrl: "/coverImages/5.jpg", streams: 156000, artistId: 2, albumId: 3 },
  { id: 6, title: "Floating", duration: 184, audioUrl: "/songFiles/6.mp3", coverUrl: "/coverImages/6.jpg", streams: 102000, artistId: 3, albumId: 3 },

  { id: 7, title: "Rainy Window", duration: 198, audioUrl: "/songFiles/7.mp3", coverUrl: "/coverImages/7.jpg", streams: 91000, artistId: 3, albumId: 4 },
  { id: 8, title: "Cold Coffee", duration: 176, audioUrl: "/songFiles/8.mp3", coverUrl: "/coverImages/8.jpg", streams: 76000, artistId: 4, albumId: 4 },

  { id: 9, title: "Sunset Boulevard", duration: 221, audioUrl: "/songFiles/9.mp3", coverUrl: "/coverImages/9.jpg", streams: 164000, artistId: 4, albumId: 5 },
  { id: 10, title: "Golden Hour", duration: 205, audioUrl: "/songFiles/10.mp3", coverUrl: "/coverImages/10.jpg", streams: 149000, artistId: 5, albumId: 5 },

  { id: 11, title: "Deep Focus", duration: 230, audioUrl: "/songFiles/11.mp3", coverUrl: "/coverImages/11.jpg", streams: 188000, artistId: 5, albumId: 6 },
  { id: 12, title: "No Distractions", duration: 212, audioUrl: "/songFiles/12.mp3", coverUrl: "/coverImages/12.jpg", streams: 171000, artistId: 6, albumId: 6 },

  { id: 13, title: "Night Walk", duration: 190, audioUrl: "/songFiles/13.mp3", coverUrl: "/coverImages/13.jpg", streams: 94000, artistId: 6, albumId: 7 },
  { id: 14, title: "Neon Streets", duration: 207, audioUrl: "/songFiles/14.mp3", coverUrl: "/coverImages/14.jpg", streams: 132000, artistId: 7, albumId: 7 },

  { id: 15, title: "Last Train Home", duration: 223, audioUrl: "/songFiles/15.mp3", coverUrl: "/coverImages/15.jpg", streams: 119000, artistId: 7, albumId: 8 },
];
