import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        margin: 10
    },
    rightContainer: {
        justifyContent: 'space-around',
        marginLeft: 15
    },
    image: {
        width: 50,
        height: 50
    },
    title:{
        color: 'white',
        fontSize: 20
    },
    artist:{
        color: 'lightgray',
        fontSize: 18
    }
})

export default styles