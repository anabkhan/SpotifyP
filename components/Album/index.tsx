import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {View, Image, Text, TouchableWithoutFeedback} from 'react-native';
import { Album, Song } from '../../types';
import styles from "./styles";

export type AlbumProps = {
    album: Album | Song
}

const AlbumComponent = (props: AlbumProps) => {

    const navigation = useNavigation()

    const onPress = () => {
        navigation.navigate('AlbumScreen', {album: props.album})
    }

    return (
            <View style={styles.container}>
                    <Image source={{ uri: props.album.imageUri ? props.album.imageUri : (props.album.thumbnails[0] ? props.album.thumbnails[0].url : props.album.thumbnails.url) }} style={styles.image}  />
                    <Text style={styles.text} numberOfLines={2}>{props.album.artistsHeadline ? props.album.artistsHeadline : props.album.name}</Text>
            </View>
        // <TouchableWithoutFeedback onPress={onPress}>
        // </TouchableWithoutFeedback>
    )
}

export default AlbumComponent;