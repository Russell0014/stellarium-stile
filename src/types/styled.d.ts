import 'styled-components'

declare module 'styled-components' {

    //Default theme is being used as an interface of
    //props.theme
    export interface DefaultTheme {
        borderRadius: string;

        colors: {
            main: string;
            secondary: string;
        }
    }

    



}