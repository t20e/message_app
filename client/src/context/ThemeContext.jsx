import { useState, createContext, useEffect } from "react";
export const UiTheme = {
    "mode": "light",
    "fontFamily": "Satoshi",
    "bgk_url": "https://portfolio-avis-s3.s3.amazonaws.com/app/images/night_fade.png"
}
export const ThemeContext = createContext();

const userPcTheme = () => {
    let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return theme;
}
UiTheme.mode = userPcTheme()

export const ThemeProvider = (props) => {
    const [theme, setTheme] = useState(UiTheme);
    useEffect(() => {
        if (theme.mode === 'system') {
            theme.mode = userPcTheme()
        }
        if (theme.mode === "dark") {
            document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url(${theme.bgk_url})`
        } else {
            document.body.style.backgroundImage = `url(${theme.bgk_url})`
        }
        document.documentElement.style.fontFamily = theme.fontFamily;
    }, [theme]);
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}