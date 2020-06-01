const path = require('path');
const fs = require('fs-extra');

const viewAssets = {
    from: path.resolve("./src/assets/views/"),
    to: path.resolve("./build/assets/views")
};

const assetsToMove = [viewAssets];

for (let assetData of assetsToMove) {
    fs.copy(assetData.from, assetData.to, () => { });
}