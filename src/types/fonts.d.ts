type CustomFontNames = 'Poppins-Regular' | 'Poppins-Bold';

declare module 'expo-font' {
  export function useFonts(fontMap: {
    [fontFamily: string]: string;
  }): [boolean, Error | null];
}