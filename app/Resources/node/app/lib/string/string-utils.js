var charMap = {
    'Á' : 'A', 'É': 'E',
    'Í': 'I', 'Ó': 'O',
    'Ú': 'U', 'á': 'a',
    'é': 'e', 'í': 'i',
    'ó': 'o', 'ú': 'u',

    'À': 'A', 'È': 'E',
    'Ì': 'I', 'Ò': 'O',
    'Ù': 'U', 'à': 'a',
    'è': 'e', 'ì': 'i',
    'ò': 'o', 'ù': 'u',

    'Ü': 'U', 'ü': 'u',
    'Ñ': 'N', 'ñ': 'n',
};

var StringUtils = {
    unlatinize: function(text) {
        return text.replace(/[^A-Za-z0-9\[\] ]/g,function(a) {
            return charMap[a]||a;
        });
    },

    compact: function(text) {
        return text.replace(/\s+/g, ' ').trim();
    },

    createIndexable: function(text) {
        text = this.compact(text);
        return this.unlatinize(text).toLowerCase();
    }
};


module.exports = StringUtils;

