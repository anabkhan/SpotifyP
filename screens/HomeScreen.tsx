import * as React from 'react';
import { AsyncStorage, DeviceEventEmitter, FlatList, StyleSheet, Text, View } from 'react-native';
import AlbumCategory from '../components/AlbumCategory';
import albumCategories from '../data/albumCategories';
import { Album, Song } from '../types';
import { useFocusEffect } from '@react-navigation/native';

export type AlbumCategory = {
  title: string;
  albums: Album[]|Song[];
}

const categoryTitleMap: any = {
  'FAVOURITES' : 'Favourites',
  'RECENTLY_PLAYED' : 'Recently Played',
  'DOWNLOADED': 'Downloaded'
}

export default function TabOneScreen() {

  const albumCategories = React.useRef<AlbumCategory[]>([])

  const [albumCategoriesUI, setAlbumCategoriesUI] = React.useState<AlbumCategory[]>([])

  const albumCategoryUpdatedHandler = () => {
    albumCategories.current = [];
    updateAlbumCategories('FAVOURITES')
    updateAlbumCategories('RECENTLY_PLAYED')
  }

  React.useEffect(() => {
      albumCategories.current = [];
      updateAlbumCategories('FAVOURITES')
      updateAlbumCategories('RECENTLY_PLAYED')

      DeviceEventEmitter.removeListener('album-category-updated', albumCategoryUpdatedHandler);
      DeviceEventEmitter.addListener('album-category-updated', albumCategoryUpdatedHandler);

    }, [])

    const updateAlbumCategories = async (category: string) => {
      let value = await AsyncStorage.getItem(category);
      if (value) {
        console.log(`value for ${category} : ${value}`)
          const favourites = JSON.parse(value);
          const keys: string[]  = Object.keys(favourites)
          const favouritesAlbums:Album[] = [];
          keys.forEach(key => {
            favouritesAlbums.push(favourites[key])
          });
          albumCategories.current.push({
            albums: favouritesAlbums,
            title: categoryTitleMap[category]
          })
          console.log('album category', albumCategories.current)
          // setAlbumCategories(albumCategories);
          // albumCategories.current = albumCategories.current;
          setAlbumCategoriesUI(albumCategories.current)
        }
    }


  return (
    <View style={styles.container}>
      <FlatList
        data={albumCategoriesUI}
        renderItem={({item}) => <AlbumCategory title={item.title} albums={item.albums} />}
        keyExtractor={(item) => item.title}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
