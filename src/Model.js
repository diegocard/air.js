// Model
// -----
dry.Model = function(name, params) {
    params = params || {};
    this.name = name;
    this.attributes = params.attributes || {};
    var self = this;

    /* Generate model methods for each given endpoint */
    dry.each(params, function(value, property){
        var split, httpMethod, url;
        if (dry.isString(value)){
            split = value.split(' ');
            httpMethod = split[0];
            url = split[1];
            self[property] = self.endpointMethod(httpMethod, url);
        }
    });
};

// Generate a model method which will perform an ajax request
// for a given endpoint
dry.Model.prototype.endpointMethod = function(httpMethod, url) {
    return function(params, success, error) {
        var urlAfterReplacement = url,
            attributes = this.attributes,
            attribute, param;
        /* Replace attributes in URL */
        for (attribute in attributes) {
            urlAfterReplacement = urlAfterReplacement.replace('{' + attribute + '}', attributes[attribute]);
        }
        /* Replace params in URL */
        for (param in params) {
            urlAfterReplacement = urlAfterReplacement.replace('{' + param + '}', params[param]);
        }
        return dry.ajax({
            url: urlAfterReplacement,
            type: httpMethod,
            data: params,
            success: success,
            error: error
        });
    };
};
