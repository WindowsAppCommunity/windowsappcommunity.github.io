export const getStoreUrl = (id: string) => {
    return `https://www.microsoft.com/store/apps/${id}`;
}

export const getGithubUrl = (id: string) => {
    return `https://www.github.com/${id}`;
}

export const getDiscordUrl = (id: string) => {
    return `https://www.discord.gg/${id}`;
}

export const getHeadTitle = (path: string) => {
    let title = "UWP Community"
    switch (path) {
        case "/":
            title = title + " // Home"
            break;
        case "/projects":
            title = title + " // Projects"
            break;
        case "/launch":
            title = title + " // Launch"
            break;
        case "/dashboard":
            title = title + " // Dashboard"
            break;
        case "/signin":
            title = title + " // Sign in"
            break;
        default:
            title = title + " // 404"
            break;
    }
    return title
}
export const isLocalhost = window.location.host.includes("localhost") && navigator.userAgent !== "ReactSnap";

export default {
    getDiscordUrl, getGithubUrl, getStoreUrl
}