var DomUtils = {
    closestWithId: function(domId, child, deep) {
        deep = deep || 10;

        if (!child) {
            return;
        }

        if (child === document.body) {
            return;
        }

        if (deep <= 0) return;


        if (child.getAttribute('id') == domId) {
            return child;
        }

        if (child.parentNode) {
            return this.closestWithId(domId, child.parentNode, deep--);
        }
    },
};

module.exports = DomUtils;
