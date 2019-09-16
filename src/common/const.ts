export const Links = {
  thisSiteRepo: "https://github.com/UWPCommunity/uwpcommunity.github.io/",
  launch2019Medium: "https://medium.com/@Arlodottxt/launch-2019-7efd37cc0877",
  discordServerInvite: "https://discord.gg/eBHZSKG",
  githubOrganization: "https://github.com/UWPCommunity/"
};

export const Images = {
  discordChatExample: "/assets/img/discordchatexample.png",
  githubOrgScreenshot: "/assets/img/githuborgscreenshot.png",
  launchHeroImage: "/assets/img/LaunchHero.png",
  launchHeroImageHD: "/assets/img/LaunchHeroHD.png",
  launchAppsHero: "/assets/img/LaunchAppsHero.png",

  uwpCommunityLogo: "/assets/img/uwpCommunityLogo.png",
  Badges: {
    msstore: "/assets/img/msstoreBadge.svg",
    github: "/assets/img/githubBadge.svg",
    discord: "/assets/img/discordBadge.svg"
  }
};

export const isBackend = window.location.host.includes("localhost");
export const backendHost: string = (
  isBackend ? "localhost:5000" : "uwpcommunity-site-backend.herokuapp.com"
); 