export function request(target: string) {
  return fetch(`https://p-ncmapi.vercel.app${target}`);
}

export type Album = {
  alia: string[];
  artist: Artist;
  copyrightId: number;
  id: number;
  mark: number;
  name: string;
  picId: number;
  publishTime: number;
  size: number;
  status: number;
};

export type Artist = {
  id: number;
  img1v1Url: string;
  name: string;
};

export type Song = {
  album: Album;
  artists: Artist[];
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
