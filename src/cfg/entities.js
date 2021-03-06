module.exports = [{
    name: 'articleList',
    allowed: ['articleList', 'article'],
    pointed: true
}, {
    name: 'article',
    allowed: [],
    treeNode: false,
    properties: {
        title: false,
        active: false,
        parent: false,
        template: false,
        layouts: false,
        ssl: false,
        seo: false,
        meta: false,
        robots: false,
        permissions: false
    }
}];