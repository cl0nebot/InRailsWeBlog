const path = require('path');
const fs = require('fs');

module.exports = (publicPath, dest, filename) => {
    filename = filename || 'rev-manifest.json';

    return function () {
        this.plugin("done", function (stats) {
            stats = stats.toJson();
            const chunks = stats.assetsByChunkName;
            const manifest = {};
            for (const key in chunks) {
                manifest[publicPath + key + '.js'] = publicPath + chunks[key];
            }

            fs.writeFileSync(
                path.join(process.cwd(), dest, filename),
                JSON.stringify(manifest)
            );
        });
    };
};
