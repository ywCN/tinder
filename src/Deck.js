import React, { Component } from 'react';
import { View, Animated, PanResponder, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

class Deck extends Component {
    constructor(props) {
        super(props);

        const position = new Animated.ValueXY();

        const panResponder = PanResponder.create({
            // This function is called when a user taps or press down on the screen.
            // If it returns true like () => true, it means we want this instance of
            // the responder to be responsible for the user pressing on the screen.
            onStartShouldSetPanResponder: () => true,

            // This function is called when a user drags their finger around
            // the screen. It is being called ALL THE TIME during dragging.
            onPanResponderMove: (event, gesture) => {
                // debugger; // pause the cleaning up process of gesture
                // console.log(gesture);
                position.setValue({ x: gesture.dx, y: gesture.dy });
            },

            // This function is called when a user releases finger from the screen.
            onPanResponderRelease: () => {
                this.resetPosition();
            }
        });

        // just for injecting data into props
        // will not use setState() on them
        this.state = { panResponder, position };
    }

    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    // determine style of card during drag
    getCardStyle() {
        const { position } = this.state;

        // set up interpolation object
        const rotate = position.x.interpolate({
            // like a linear relationship of values in a range
            // * 1.5 makes rotating less sensitive
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        });

        return {
            ...position.getLayout(),
            transform: [{ rotate }] // { rotate: rotate }
        };
    }

    renderCards() {
        return this.props.data.map((item, index) => {
            if (index === 0) {
                return (
                    <Animated.View
                        key={item.id}
                        style={this.getCardStyle()}
                        // panHandlers is an object contains a lot of callbacks
                        {...this.state.panResponder.panHandlers}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            }
            return this.props.renderCard(item);
        });
    }

    render() {
        return <View>{this.renderCards()}</View>;
    }
}

export default Deck;
