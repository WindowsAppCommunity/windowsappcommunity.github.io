
export const getStoreUrl = (id: string) => {
    return `https://www.microsoft.com/store/apps/${id}`;
}

export const getGithubUrl = (id: string) => {
    return `https://www.github.com/${id}`;
}

export const getDiscordUrl = (id: string) => {
    return `https://www.discord.gg/${id}`;
}

export default {
    getDiscordUrl, getGithubUrl, getStoreUrl
}