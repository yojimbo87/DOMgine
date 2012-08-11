function Playground(options) {
    this._element = $(options.elementID);

    this._options = {
        width: options.width || 512,
        height: options.height || 512
    };
};