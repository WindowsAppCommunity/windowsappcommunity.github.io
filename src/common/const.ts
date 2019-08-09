export const getSreenshotUrl = (id: string) => {
  return `assets/screenshots/${id}.png`;
}

export const getThumbUrl = (id: string) => {
  return `assets/thumbs/${id}.png`;
}

export const getStoreUrl = (id: string) => {
  return `https://www.microsoft.com/store/apps/${id}`;
}

export const getGitHubUrl = (id: string) => {
  return `https://www.github.com/${id}`;
}

export const getDiscordUrl = (id: string) => {
  return `https://www.discord.gg/${id}`;
}

export const Links = {
  thisSiteRepo: "https://github.com/UWPCommunity/uwpcommunity.github.io/",
  launch2019Medium: "https://medium.com/@Arlodottxt/launch-2019-7efd37cc0877",
  discordServerInvite: "https://discord.gg/eBHZSKG",
  githubOrganization: "https://github.com/UWPCommunity/"
};

export const Images = {
  discordChatExample: "assets/img/discordchatexample.png",
  githubOrgScreenshot: "assets/img/githuborgscreenshot.png",
  launchHeroImage: "assets/img/LaunchHero.png",

  uwpCommunityLogo: "assets/img/uwpCommunityLogo.png",
  Badges: {
    msstore: "assets/img/msstoreBadge.png",
    github: "assets/img/githubBadge.png",
    discord: "assets/img/discordBadge.png"
  }
};