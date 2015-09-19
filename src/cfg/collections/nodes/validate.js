var _ = require('underscore');

var self = this;

if (self.content.entity === 'articleList') {

    contentProperties.articleTemplate = {
        type: "object",
        required: true,
        properties: {
            inherits: { type: "boolean", required: true },
            value: { type: "string", required: true }
        }
    };

    validate({
        type: 'object',
        properties: {
            content: {
                type: "object",
                required: true,
                properties: contentProperties
            }
        }
    });

}