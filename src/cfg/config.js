var fs = require("fs");
var packInfo = require('../../package.json');

module.exports = {

    section: 'news',

    sections: [{
        name: 'news',
        roles: ['admin']
    }],

    entities: [{
        name: 'articleList',
        allowed: ['articleList', 'article'],
        properties: {
            meta: false
        }
    }, {
        name: 'article',
        allowed: [],
        treeNode: false,
        properties: {
            title: false,
            parent: false,
            template: false,
            active: false,
            layout: false,
            ssl: false,
            seo: false,
            meta: false,
            robots: false,
            permissions: false
        }
    }],

    collections: [{
        name: "nodes",
        events: {
            validate: fs.readFileSync(__dirname + "/collections/nodes/validate.js", "utf8")
        }
    }],

    content: [{
        id: 'news',
        title: 'news',
        body: 'articles and categories from the news module',
        image: 'img/news/icon.png',
        url: '/content/news'
    }],

    scripts: [{
        name: 'admin-app',
        items: [
            '/admin/js/news/app/main.js',
            '/admin/js/news/app/controllers/CategoriesController.js',
            '/admin/js/news/app/controllers/ArticlesController.js',
            '/admin/js/news/app/controllers/CategoryController.js',
            '/admin/js/news/app/controllers/ArticleController.js',
            '/admin/js/news/app/controllers/SettingsController.js'
        ]
    }]

};