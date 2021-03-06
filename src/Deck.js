import React, { Component } from 'react';
import {
    View,
    Animated,
    PanResponder,
    Dimensions,
    LayoutAnimation,
    UIManager
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends Component {
    // for avoiding errors during testing
    // for reusable component
    static defaultProps = {
        onSwipeRight: () => {},
        onSwipeLeft: () => {}
    };

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
                // y: 0 disables drag up and down
                position.setValue({ x: gesture.dx, y: 0 }); // y: gesture.dx
            },

            // This function is called when a user releases finger from the screen.
            onPanResponderRelease: (event, gesture) => {
                if (gesture.dx > SWIPE_THRESHOLD) {
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }
            }
        });

        // just for injecting data into props
        // do not use setState() on position, use this.state.position.setValue()
        // index tracks current card
        this.state = { panResponder, position, index: 0 };
    }

    componentWillReceiveProps(nextProps) {
        // if new set of data, reset index of current card
        if (nextProps.data !== this.props.data) {
            this.setState({ index: 0 });
        }
    }

    // create animation after swiping card
    componentWillUpdate() {
        UIManager.setLayoutAnimationEnabledExperimental &&
            UIManager.setLayoutAnimationEnabledExperimental(true); // for android
        LayoutAnimation.spring(); // for both iOS and Android
    }

    forceSwipe(direction) {
        // Animated.timing is like Animated.spring, it has a linearing feeling
        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x: x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => this.onSwipeComplete(direction));
    }

    onSwipeComplete(direction) {
        const { onSwipeRight, onSwipeLeft, data } = this.props;
        const item = data[this.state.index]; // current card

        direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item);
        // reset card position
        this.state.position.setValue({ x: 0, y: 0 });
        // update current card index
        this.setState({ index: this.state.index + 1 }); // do not this.state.index++;
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
        // if all cards are used
        if (this.state.index >= this.props.data.length) {
            return this.props.renderNoMoreCards();
        }
        return this.props.data
            .map((item, i) => {
                if (i < this.state.index) {
                    return null;
                }
                if (i === this.state.index) {
                    return (
                        <Animated.View
                            key={item.id}
                            // passing mutiple styles needs to use array
                            style={[this.getCardStyle(), styles.cardStyle]}
                            // panHandlers is an object contains a lot of callbacks
                            {...this.state.panResponder.panHandlers}
                        >
                            {this.props.renderCard(item)}
                        </Animated.View>
                    );
                }
                return (
                    <Animated.View
                        key={item.id}
                        style={[
                            styles.cardStyle,
                            { top: 10 * (i - this.state.index) }
                        ]}
                    >
                        {this.props.renderCard(item)}
                    </Animated.View>
                );
            })
            .reverse();
    }

    render() {
        return <View>{this.renderCards()}</View>;
    }
}

const styles = {
    cardStyle: {
        // 'absolute' will cause card to stack up
        // it has a side effect which will cause elements shrink to minimal dispaly size
        position: 'absolute',
        width: SCREEN_WIDTH // same as left: 0, right: 0
    }
};

export default Deck;
