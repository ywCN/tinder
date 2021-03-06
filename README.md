# Tinder

## Tech Stacks
- React
- React Native
    - Animated module: handles animation output
    - PanResponder: handles user gestures
    - Dimensions: retrive width and height
    - LayoutAnimation: for testing android layout animation
    - UIManager: for layout animation like a stack of cards bouncing up
- [React Native Elements](https://github.com/react-native-training/react-native-elements)


## Trouble Shootings
- unable to resolve module
    - check typos in name, export, import
    - [steps](https://github.com/facebook/react-native/issues/4968)
        1. rm -rf node_modules && npm install
        2. rm -fr $TMPDIR/react-*
        3. watchman watch-del-all
- debugger;
    - pause at this line
- this.props.xxxx is not a function
    - check spelling
    - check if the callback is passed in component's props

## Expo
- app.js file is for both Android and iOS

## Animation Modules in React Native
- `LayoutAnimation`
    - Easy to setup
    - Not much control
    - Some things may be animated that we do not want they to be
- `Animated`
    - Far more complicated to set up
    - Allows for more complicated animations
    - Probably need this if want to handle gesture animations
    
## `Animated` module
- Note the `Animated` System runs outside the loop of rendering components.
    - Animation starts after component is rendered, and the component will not re-render during the animation.
- 3 values are required to describe an entire animation.
    1. What is the current position of the element being animated?
        - Values(object): Value, ValueXY
        - object example: Animated.Value.Animated
    2. How is the animation changing?
        - Types(module): Spring(object), Decay(object), Timing(object)
        - object example: Animated.Components.Spring
    3. Apply the animation's current position to an actual component.
        - Components: View, Text, Image
        - component example: Animated.Components.View

## `PanResponder`(Gesture System)
- Questions to ask when use gesture system
    1. What are we touching?
    2. What component handles the touch?
    3. How is the gesture changing?

## `Animated` vs. `PanResponder`
- Animated module handles output like animations
- PanResponder module handles user input like gestures