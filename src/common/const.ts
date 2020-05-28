import { isLocalhost } from "./helpers";

export const Links = {
  thisSiteRepo: "https://github.com/UWPCommunity/uwpcommunity.github.io/",
  launch2019Medium: "https://medium.com/@Arlodottxt/launch-2019-7efd37cc0877",
  discordServerInvite: "https://discord.gg/eBHZSKG",
  githubOrganization: "https://github.com/UWPCommunity/"
};

export const Images = {
  discordChatExample: "/assets/img/discordchatexample.jpg",
  githubOrgScreenshot: "/assets/img/githuborgscreenshot.jpg",
  launchHeroImage: "/assets/img/LaunchHero.jpg",
  launchHeroImageHD: "/assets/img/LaunchHeroHD.jpg",
  launchAppsHero: "/assets/img/LaunchAppsHero.jpg",

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

export function getBackendHost(): string {
  return isLocalhost ? "localhost:5000" : "uwpcommunity-site-backend.herokuapp.com"
}