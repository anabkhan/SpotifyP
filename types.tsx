/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

export type RootStackParamList = {
  Root: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

export type TabOneParamList = {
  TabOneScreen: undefined;
  AlbumScreen: undefined;
};

export type TabTwoParamList = {
  TabTwoScreen: undefined;
};

export type Album = {
  id: string;
  imageUri: string;
  name: string;
  artistsHeadline: string;
}
 export type Song = {
   id: string;
   image: string;
   title: string;
   name: string;
   author: string;
   artist: {
    name: string;
   };
   type: string;
   videoId: string;
   thumbnails: [{
     url: string;
   }] | {url: string;};
   url: string;
   duration: number;
 }

 export type Favourites = {
   id: string;
   song: Song;
 }