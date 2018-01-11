import React, { Component } from 'react';
import { View, Animated, PanResponder } from 'react-native';

class Deck extends Component {
    constructor(props) {
        super(props);

        const panResponder = PanResponder.create({
            // This function is called when a user taps or press down on the screen.
            // If it returns true like () => true, it means we want this instance of
            // the responder to be responsible for the user pressing on the screen.
            onStartShouldSetPanResponder: () => true,

            // This function is called when a user starts to drag their finger
            // around the screen. It will be call many many times.
            onPanResponderMove: (event, gesture) => {
                // debugger; // pause the cleaning up process of gesture
                // console.log(gesture);
            },

            // This function is called when a user moves finger from the screen.
            onPanResponderRelease: () => {}
        });

        this.state = { panResponder };
    }

    renderCards() {
        return this.props.data.map(item => {
            return this.props.renderCard(item);
        });
    }

    render() {
        // panHandlers is an object contains a lot of callbacks
        return (
            <View {...this.state.panResponder.panHandlers}>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;
