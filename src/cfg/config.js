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
        subtitle: 'Lorem ipsum dolor sit amet',
        body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam fringilla nunc vel cursus consequat. Pellentesque sit amet libero vel risus tristique euismod sed quis eros.',
        image: 'img/news/icon.png',
        url: '/modules/news'
    }],

    scripts: [{
        name: 'admin-app',
        items: [
            '/admin/js/news/app/main.js',
            '/admin/js/news/app/controllers/NewsCategoriesController.js',
            '/admin/js/news/app/controllers/NewsCategoryController.js',
            '/admin/js/news/app/controllers/NewsCategoryFormController.js',
            '/admin/js/news/app/controllers/NewsArticleFormController.js',
            '/admin/js/news/app/controllers/NewsSettingsController.js'
        ]
    }]

};