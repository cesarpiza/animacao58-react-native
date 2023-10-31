import React from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    StyleSheet,
    View
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const IMAGE_WIDTH = width * 0.85;
const IMAGE_HEIGHT = IMAGE_WIDTH * 1.3;
const SPACING = IMAGE_WIDTH * 0.1;

export default function Item(props) {

    const {
        _index,
        index,
        poster,
        animatedValue,
        handleUp,
        handleDown,
    } = props;

    const inputRange = [
        index - 1,
        index,
        index + 1,
    ]

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: interpolate(animatedValue.value,
                inputRange,
                [0.9, 1, 0],
            ),
            transform: [
                {
                    translateY: interpolate(animatedValue.value,
                        inputRange,
                        [-30, 0, -100],
                    )
                },
                {
                    scale: interpolate(animatedValue.value,
                        inputRange,
                        [0.9, 1, 1.1],
                    )
                }
            ]
        }
    })

    return (
        <GestureDetector gesture={Gesture.Race(handleUp, handleDown)}>
            <Pressable
                onPress={() => {

                }}
            >
                <Animated.View
                    style={[styles.imageContainer, {
                        pointerEvents: _index == index ? 'auto' : 'none',
                    }, animatedStyle]}
                >
                    <Image
                        style={styles.image}
                        source={{ uri: poster }}
                    />
                </Animated.View>
            </Pressable>
        </GestureDetector>
    );
}

export const styles = StyleSheet.create({
    container: {},
    imageContainer: {
        position: 'absolute',
        width: IMAGE_WIDTH,
        height: IMAGE_HEIGHT,
        borderRadius: SPACING,
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    }
});