
function root_require(path) {
    const app_root = process.cwd();
    return require(app_root + path);
}

module.exports = root_require;
