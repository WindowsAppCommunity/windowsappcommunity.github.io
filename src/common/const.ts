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

export const MicrosoftStoreAppCategories = [
  "Books & reference",
  "Business",
  "Developer tools",
  "Education",
  "Entertainment",
  "Food & dining",
  "Government & politics",
  "Kids & family",
  "Lifestyle",
  "Medical",
  "Multimedia design",
  "Music",
  "Navigation & maps",
  "News & weather",
  "Personal finance",
  "Personalization",
  "Photo & video",
  "Productivity",
  "Security",
  "Shopping",
  "Social",
  "Sports",
  "Travel",
  "Utilities & tools"
];

export const isLocalhost = window.location.host.includes("localhost") || navigator.userAgent.includes("ReactSnap");

export const backendProtocol: string = (
  isLocalhost ? "http" : "https"
); 

export const backendHost: string = (
  isLocalhost ? "localhost:5000" : "uwpcommunity-site-backend.herokuapp.com"
); 