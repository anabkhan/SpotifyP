import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 42,
        backgroundColor: '#131313',
        width: '100%',
        // flexDirection: 'row',
        // margin: 10,
        borderWidth: 2,
        borderColor: 'black',
        // alignItems: 'center',

    },
    progress: {
        height: 3,
        // width: '100%',
        left: 0,
        backgroundColor: 'white'
    },
    row: {
        flexDirection: 'row'
    },
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '50%'
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 100,
        justifyContent: 'space-around',
        backgroundColor: '#131313'
    },
    image: {
        width: 55,
        height: 55,
        marginRight: 10
    },
    title:{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        margin: 5
    },
    artist:{
        color: 'lightgray',
        fontSize: 15
    }
})

export default styles