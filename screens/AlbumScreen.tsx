import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Text, FlatList } from "react-native";
import AlbumHeader from '../components/AlbumHeader';
import SongListItem from '../components/SongListItem';
import albumCategories from '../data/albumCategories';

const AlbumScreen = () => {

    const route = useRoute();

    useEffect(() => {
        console.log(albumCategories[0].albums[0].songs)
    }, [])

    return (
        <View>
            
            <FlatList
                data={albumCategories[0].albums[0].songs} 
                renderItem={({item}) => <SongListItem song={item} />}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={() => <AlbumHeader album={albumCategories[0].albums[0]} />}
                />
            {/* <SongListItem song={route.params['album']['songs'][0]} /> */}
        </View>
    )
}

export default AlbumScreen;