import { useState, createContext, useEffect } from "react";
let UiTheme = {
    "mode": "light",
    "fontFamily": "Satoshi",
    "bgk_url": "https://portfolio-avis-s3.s3.amazonaws.com/app/images/night_fade.png",
    "bgk_name": "night_fade",

}
export const ThemeContext = createContext();

const userPcTheme = () => {
    let theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return theme;
}
if (localStorage.getItem("theme")) {
    UiTheme = JSON.parse(localStorage.getItem("theme"))
} else {
    UiTheme.mode = userPcTheme()
}
export const ThemeProvider = (props) => {
    const [theme, setTheme] = useState(UiTheme);
    useEffect(() => {
        if (theme.mode === 'system') {
            theme.mode = userPcTheme()
        }
        if (theme.mode === "dark") {
            document.body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.527),rgba(0, 0, 0, 0.5)) , url(${theme.bgk_url})`
            document.documentElement.style.setProperty('--filterForIcons', '100%');
        } else {
            document.documentElement.style.setProperty('--filterForIcons', '0%');
            document.body.style.backgroundImage = `url(${theme.bgk_url})`
        }
        document.documentElement.style.fontFamily = theme.fontFamily;
        localStorage.setItem('theme', JSON.stringify(theme))
    }, [theme]);
    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {props.children}
        </ThemeContext.Provider>
    )
}