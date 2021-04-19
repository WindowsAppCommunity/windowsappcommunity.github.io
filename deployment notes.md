Deployment notes
====
For use by webmaster only. Deployment of this project to production is notoriously difficult, so a history is kept here to assist with future problems.

### 4/19/2021
Spent several hours tinkering with pupeteer and react-snap. Ran into these issues:
1. After setting up again from a PC reset, and after a nuking and reinstalling node_modules, puppeteer couldn't find the chromium runtime. Solution:  run `node node_modules/puppeteer/install.js`.
2. The `/launch` page wouldn't render. Went into react-snap (config in package.jsom and actual source in node_modules) and manually changed things around to debug this. Turned off headless mode, changed to single threaded, switch exectuable to Edge Chromium, etc. Solution: For some reason, the PromiseVisualizer was causing this when grabbing markdown for Launch 2021 info, but not in debug mode. To prevent this, we made PromiseVisualizer break when react-snap is being used.