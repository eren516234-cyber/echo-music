export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  artwork: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  year: number;
  songCount: number;
}

export interface Artist {
  id: string;
  name: string;
  artwork: string;
  followers: string;
  genre: string;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  artwork: string;
  songCount: number;
}

export interface GlobalSong {
  id: string;
  title: string;
  artist: string;
  country: string;
  countryCode: string;
  artwork: string;
  lat: number;
  lon: number;
  color: string;
}

const img = (seed: number, w = 300, h = 300) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const SONGS: Song[] = [
  { id: "s1",  title: "Blinding Lights",   artist: "The Weeknd",    album: "After Hours",       duration: 200, artwork: img(101) },
  { id: "s2",  title: "Less Than Zero",    artist: "The Weeknd",    album: "Dawn FM",           duration: 131, artwork: img(102) },
  { id: "s3",  title: "Was Ich Liebe",     artist: "Rammstein",     album: "Rammstein",         duration: 260, artwork: img(103) },
  { id: "s4",  title: "Save Your Tears",   artist: "The Weeknd",    album: "After Hours",       duration: 197, artwork: img(104) },
  { id: "s5",  title: "Hornay",            artist: "AY YOLA",       album: "Vol.2",             duration: 192, artwork: img(105) },
  { id: "s6",  title: "meant to be",       artist: "bbnoS",         album: "Bag or Die",        duration: 166, artwork: img(106) },
  { id: "s7",  title: "Go Ghost",          artist: "Jackson Wang",  album: "MAGIC MAN",         duration: 184, artwork: img(107) },
  { id: "s8",  title: "Levitating",        artist: "Dua Lipa",      album: "Future Nostalgia",  duration: 203, artwork: img(108) },
  { id: "s9",  title: "MONTERO",           artist: "Lil Nas X",     album: "MONTERO",           duration: 137, artwork: img(109) },
  { id: "s10", title: "Peaches",           artist: "Justin Bieber", album: "Justice",           duration: 198, artwork: img(110) },
  { id: "s11", title: "Stay",              artist: "The Kid LAROI", album: "Stay",              duration: 141, artwork: img(111) },
  { id: "s12", title: "Bad Habits",        artist: "Ed Sheeran",    album: "=",                 duration: 231, artwork: img(112) },
  { id: "s13", title: "Industry Baby",     artist: "Lil Nas X",     album: "MONTERO",           duration: 212, artwork: img(113) },
  { id: "s14", title: "Happier Than Ever", artist: "Billie Eilish", album: "Happier Than Ever", duration: 295, artwork: img(114) },
  { id: "s15", title: "360",               artist: "Charli xcx",    album: "BRAT",              duration: 151, artwork: img(115) },
];

export const ALBUMS: Album[] = [
  { id: "a1",  title: "After Hours",       artist: "The Weeknd",    artwork: img(201), year: 2020, songCount: 14 },
  { id: "a2",  title: "BRAT",              artist: "Charli xcx",    artwork: img(202), year: 2024, songCount: 15 },
  { id: "a3",  title: "Future Nostalgia",  artist: "Dua Lipa",      artwork: img(203), year: 2020, songCount: 11 },
  { id: "a4",  title: "MONTERO",           artist: "Lil Nas X",     artwork: img(204), year: 2021, songCount: 15 },
  { id: "a5",  title: "Dawn FM",           artist: "The Weeknd",    artwork: img(205), year: 2022, songCount: 16 },
  { id: "a6",  title: "Justice",           artist: "Justin Bieber", artwork: img(206), year: 2021, songCount: 16 },
  { id: "a7",  title: "=",                 artist: "Ed Sheeran",    artwork: img(207), year: 2021, songCount: 14 },
  { id: "a8",  title: "Happier Than Ever", artist: "Billie Eilish", artwork: img(208), year: 2021, songCount: 16 },
  { id: "a9",  title: "Rammstein",         artist: "Rammstein",     artwork: img(209), year: 2019, songCount: 11 },
  { id: "a10", title: "MAGIC MAN",         artist: "Jackson Wang",  artwork: img(210), year: 2022, songCount: 12 },
];

export const ARTISTS: Artist[] = [
  { id: "ar1", name: "The Weeknd",    artwork: img(301, 400, 400), followers: "49.2M", genre: "R&B"         },
  { id: "ar2", name: "Charli xcx",    artwork: img(302, 400, 400), followers: "18.7M", genre: "Pop"         },
  { id: "ar3", name: "Dua Lipa",      artwork: img(303, 400, 400), followers: "41.3M", genre: "Pop"         },
  { id: "ar4", name: "Billie Eilish", artwork: img(304, 400, 400), followers: "52.1M", genre: "Alternative" },
  { id: "ar5", name: "Rammstein",     artwork: img(305, 400, 400), followers: "12.8M", genre: "Metal"       },
  { id: "ar6", name: "Jackson Wang",  artwork: img(306, 400, 400), followers: "9.4M",  genre: "Pop"         },
  { id: "ar7", name: "Lil Nas X",     artwork: img(307, 400, 400), followers: "21.5M", genre: "Hip-Hop"     },
  { id: "ar8", name: "Ed Sheeran",    artwork: img(308, 400, 400), followers: "63.7M", genre: "Pop"         },
];

export const PLAYLISTS: Playlist[] = [
  { id: "p1", title: "Liked Songs",   description: "Songs you loved",      artwork: img(401), songCount: 87 },
  { id: "p2", title: "Night Drive",   description: "Late night essentials", artwork: img(402), songCount: 42 },
  { id: "p3", title: "Workout",       description: "High energy",           artwork: img(403), songCount: 31 },
  { id: "p4", title: "Chill Vibes",   description: "Relax and unwind",      artwork: img(404), songCount: 54 },
  { id: "p5", title: "Focus Mode",    description: "Deep work sessions",    artwork: img(405), songCount: 38 },
  { id: "p6", title: "Top Hits 2024", description: "Best of the year",      artwork: img(406), songCount: 50 },
];

export const GLOBAL_SONGS: GlobalSong[] = [
  { id: "g1",  title: "Blinding Lights",   artist: "The Weeknd",    country: "Canada",    countryCode: "ca", artwork: img(101), lat:  45.4, lon: -75.7, color: "#FF3B30" },
  { id: "g2",  title: "Bad Guy",           artist: "Billie Eilish", country: "USA",       countryCode: "us", artwork: img(114), lat:  34.0, lon: -118.2, color: "#30D158" },
  { id: "g3",  title: "Was Ich Liebe",     artist: "Rammstein",     country: "Germany",   countryCode: "de", artwork: img(103), lat:  52.5, lon:  13.4, color: "#FF9F0A" },
  { id: "g4",  title: "360",               artist: "Charli xcx",    country: "UK",        countryCode: "gb", artwork: img(115), lat:  51.5, lon:  -0.1, color: "#BF5AF2" },
  { id: "g5",  title: "Go Ghost",          artist: "Jackson Wang",  country: "China",     countryCode: "cn", artwork: img(107), lat:  39.9, lon: 116.4, color: "#FF2D55" },
  { id: "g6",  title: "Levitating",        artist: "Dua Lipa",      country: "Kosovo",    countryCode: "xk", artwork: img(108), lat:  42.7, lon:  21.2, color: "#5AC8FA" },
  { id: "g7",  title: "Industry Baby",     artist: "Lil Nas X",     country: "USA",       countryCode: "us", artwork: img(113), lat:  40.7, lon: -74.0, color: "#FFD60A" },
  { id: "g8",  title: "Bad Habits",        artist: "Ed Sheeran",    country: "UK",        countryCode: "gb", artwork: img(112), lat:  51.9, lon:   1.0, color: "#64D2FF" },
  { id: "g9",  title: "Hornay",            artist: "AY YOLA",       country: "Nigeria",   countryCode: "ng", artwork: img(105), lat:   6.5, lon:   3.4, color: "#FF6961" },
  { id: "g10", title: "meant to be",       artist: "bbnoS",         country: "Canada",    countryCode: "ca", artwork: img(106), lat:  43.7, lon: -79.4, color: "#6AC4DC" },
  { id: "g11", title: "Stay",              artist: "The Kid LAROI", country: "Australia", countryCode: "au", artwork: img(111), lat: -33.9, lon: 151.2, color: "#FFB340" },
  { id: "g12", title: "MONTERO",           artist: "Lil Nas X",     country: "USA",       countryCode: "us", artwork: img(109), lat:  33.7, lon: -84.4, color: "#30B0C7" },
  { id: "g13", title: "Peaches",           artist: "Justin Bieber", country: "Canada",    countryCode: "ca", artwork: img(110), lat:  43.5, lon: -80.5, color: "#FF8C00" },
  { id: "g14", title: "Save Your Tears",   artist: "The Weeknd",    country: "Canada",    countryCode: "ca", artwork: img(104), lat:  45.5, lon: -73.6, color: "#FF375F" },
  { id: "g15", title: "Happier Than Ever", artist: "Billie Eilish", country: "USA",       countryCode: "us", artwork: img(114), lat:  34.1, lon: -118.4, color: "#5E5CE6" },
];

export const GENRES = [
  { id: "g0", name: "For you",    count: 219 },
  { id: "g1", name: "Rock",       count: 240 },
  { id: "g2", name: "Hip-hop",    count: 589 },
  { id: "g3", name: "K-Pop",      count: 719 },
  { id: "g4", name: "R&B",        count: 341 },
  { id: "g5", name: "Electronic", count: 428 },
];

export const BROWSE_CATS = [
  { id: "b1",  name: "Pop",        color: "#FF2D55" },
  { id: "b2",  name: "Hip-Hop",    color: "#FF9500" },
  { id: "b3",  name: "Rock",       color: "#FF3B30" },
  { id: "b4",  name: "R&B",        color: "#BF5AF2" },
  { id: "b5",  name: "K-Pop",      color: "#5AC8FA" },
  { id: "b6",  name: "Electronic", color: "#30D158" },
  { id: "b7",  name: "Jazz",       color: "#FFD60A" },
  { id: "b8",  name: "Lo-Fi",      color: "#64D2FF" },
  { id: "b9",  name: "Metal",      color: "#636366" },
  { id: "b10", name: "Indie",      color: "#FF6B35" },
  { id: "b11", name: "Classical",  color: "#8E8E93" },
  { id: "b12", name: "Latin",      color: "#FF375F" },
];

export const RECENT_SEARCHES = ["The Weeknd", "Rammstein", "AY YOLA", "bbnoS", "Rema"];

export const formatDuration = (sec: number) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
