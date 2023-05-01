export function request(target: string) {
  return fetch(`https://p-ncmapi.vercel.app${target}`);
}

// /artist?id=

export type Artist = {
  accountId: number;
  albumSize: number;
  alias: string[];
  briefDesc: string;
  followed: boolean;
  id: number;
  img1v1Id: number;
  img1v1Id_str: string;
  img1v1Url: string;
  musicSize: number;
  mvSize: number;
  name: string;
  picId: number;
  picId_str: string;
  picUrl: string;
  publishTime: number;
  topicPerson: number;
  trans: string;
};

export type HotSong = {
  al: HotSongAlbum;
  alia: string[];
  ar: HotSongArtist[];
  mv: number;
  name: string;
};

export type HotSongArtist = {
  id: number;
  name: string;
};

export type HotSongAlbum = {
  id: number;
  name: string;
  pic: number;
  picUrl: string;
  pic_str: string;
};

// /search?keyword=

export type Song = {
  album: SongAlbum;
  artists: SongArtist[];
  copyrightId: number;
  duration: number;
  fee: number;
  ftype: number;
  id: number;
  mark: number;
  mvid: number;
  name: string;
  status: number;
  transNames: string[];
};

export type SongArtist = {
  id: number;
  img1v1Url: string;
  name: string;
};

export type SongAlbum = {
  alia: string[];
  artist: SongArtist;
  copyrightId: number;
  id: number;
  mark: number;
  name: string;
  picId: number;
  publishTime: number;
  size: number;
  status: number;
};
