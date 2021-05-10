import React from 'react';
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Album } from '../../types';
import styles from './styles';

export type AlbumHeaderProps = {
    album:Album
}

const AlbumHeader = (props: AlbumHeaderProps) => {

    return (
        <View style={styles.container}>
            <Image source={{uri: props.album.imageUri}} style={styles.image} />
            <Text style={styles.name}>{props.album.name}</Text>
            <TouchableOpacity>
                <View style={styles.play}>
                    <Text style={styles.buttonText}>Play</Text>
                </View>
            </TouchableOpacity>
            {/* Cover Image */}
            {/* Name */}
            {/* Play button */}
        </View>
    )
}

export default AlbumHeader;