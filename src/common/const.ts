import { isLocalhost } from "./helpers";

export const Links = {
  thisSiteRepo: "https://github.com/UWPCommunity/uwpcommunity.github.io/",
  launch2019Medium: "https://medium.com/@Arlodottxt/launch-2019-7efd37cc0877",
  launch2020Medium: "https://medium.com/@Arlodottxt/uwp-community-launch-2020-1772efb1e382",
  discordServerInvite: "https://discord.gg/eBHZSKG",
  githubOrganization: "https://github.com/UWPCommunity/"
};

export const Images = {
  discordChatExample: "/assets/img/discordchatexample.jpg",
  discordChatExampleAltText: "Screenshot of Discord chat",
  githubOrgScreenshot: "/assets/img/githuborgscreenshot.jpg",
  githubOrgScreenshotAltText: "Screenshot of GitHub showing the UWP Community organization",
  launchHeroImage: "/assets/img/LaunchHero.jpg",
  launchHeroImageAltText: "Hero image of Launch 2021",
  launchHeroImageHD: "/assets/img/LaunchHeroHD.jpg",
  launchAppsHero: "/assets/img/LaunchAppsHero.png",
  launchAppsHeroAltText: "Image showing logos of Launch 2020 apps",

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