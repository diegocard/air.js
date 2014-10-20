air.Template = function(name, tmpl) {
    this.name = name;
    if (air.isFunction(tmpl)){
        // Allow for pre-compiled funcions
        this.compile = tmpl;
    } else {
        this.domId = tmpl || ('script[data-air="' + name + '"]');
        this.element = air.$(this.domId).element;
    }
};

air.Template.prototype.cache = [];

air.Template.prototype.compile = function tmpl(data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    data = data || {};
    var str = this.elment.innerHTML.trim(),
        cache = air.Template.prototype.cache,
        fn = !/\W/.test(str) ?
        cache[this.name] = cache[this.name] ||
        tmpl(document.getElementById(str).innerHTML) :

        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'") + "');}return p.join('');");

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
};
