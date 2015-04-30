var _settings = document && JSON.parse(document.getElementById('app').getAttribute('data-settings'));

module.exports = {
    getSettings: function() {
        return _settings;
    }
};