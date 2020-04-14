import { isLocalhost } from "./helpers";
import { CSSProperties } from "react";

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

export function getBackendHost(): string {
  return isLocalhost ? "localhost:5000" : "uwpcommunity-site-backend.herokuapp.com"
}

export const FaIcon16Style: CSSProperties = {
  color: "black",
  height: "16px",
  width: "16px"
};

export const FaIcon25Style: CSSProperties = {
  color: "black",
  height: "25px",
  width: "25px"
};

export const FaIcon35Style: CSSProperties = {
  color: "black",
  height: "35px",
  width: "35px"
};

export const FaIcon38Style: CSSProperties = {
  color: "black",
  height: "38px",
  width: "38px"
};

export const FaIcon55Style: CSSProperties = {
  color: "black",
  height: "55px",
  width: "55px"
};

export const FaIcon65Style: CSSProperties = {
  color: "black",
  height: "65px",
  width: "65px"
};