// Triple-slash directive for React Native types
/// <reference types="react-native/types" />
/// <reference types="expo/types" />

// Fix for SVG imports
declare module '*.svg' {
    import { SvgProps } from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
  }