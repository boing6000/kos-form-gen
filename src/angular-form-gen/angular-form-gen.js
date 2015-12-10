var fg = angular.module('fg', ['dq', 'ui.utils.masks']);

/**
 * Constructor for form-gen Field types.
 * @param {string} type         Indicates the type of field
 * @param {object} properties   [optional] Initial property values
 */
fg.constant('FgField', function FgField(type, properties) {
        this.name = this.type = type;

        if (properties) {
            angular.extend(this, properties);
        }

        this.displayName = this.displayName || this.type.charAt(0).toUpperCase() + this.type.substring(1);
    }
);

fg.config(function ($provide) {

    $provide.provider('fgConfig', function () {

        var config = {
            enableDebugInfo: true,
            validation: {
                messages: {},
                patterns: {}
            },
            fields: {
                templates: [],
                categories: {},
                renderInfo: {}
            }
        };

        var templates = config.fields.templates;

        function indexOfTemplate(type) {
            var idx = templates.length;

            while (idx--) {
                if (templates[idx].type === type) {
                    break;
                }
            }

            return idx;
        }

        return {
            debug: function (value) {
                config.enableDebugInfo = value;
            },
            fields: {
                add: function (objectTemplate, categories, templateUrl, propertiesTemplateUrl) {

                    if (!objectTemplate || !objectTemplate.type || !categories || !categories.length) {
                        throw new Error('Need a valid objectTemplate and at least one category');
                    }

                    var idx = indexOfTemplate(objectTemplate.type);

                    if (idx !== -1) {
                        templates[idx] = objectTemplate;
                    } else {
                        templates.push(objectTemplate);
                    }

                    this.category(objectTemplate.type, categories);
                    this.renderInfo(objectTemplate.type, templateUrl, propertiesTemplateUrl);
                },
                remove: function (type) {
                    var idx = indexOfTemplate(type);

                    if (idx !== -1) {
                        templates.splice(idx, 1);
                    }

                    this.category(type);
                    this.renderInfo(type);
                },
                get: function (type) {
                    var i = templates.length;
                    while (i--) {
                        var t = templates[i];
                        if (t.type === type) {
                            return t;
                        }
                    }
                },
                renderInfo: function (fieldType, templateUrl, propertiesTemplateUrl) {
                    config.fields.renderInfo[fieldType] = {
                        templateUrl: templateUrl,
                        propertiesTemplateUrl: propertiesTemplateUrl
                    };
                },
                category: function (fieldType, categories) {
                    if (!angular.isArray(categories)) {
                        categories = [categories];
                    }

                    angular.forEach(config.fields.categories, function (category) {
                        delete category[fieldType];
                    });

                    angular.forEach(categories, function (category) {
                        if (config.fields.categories[category] === undefined) {
                            config.fields.categories[category] = {};
                        }

                        config.fields.categories[category][fieldType] = true;
                    });
                }
            },
            validation: {
                message: function (typeOrObject, message) {

                    var messages = config.validation.messages;

                    if (angular.isString(typeOrObject)) {

                        if (!message) {
                            throw new Error('No message specified for ' + typeOrObject);
                        }

                        messages[typeOrObject] = message;
                    } else {
                        angular.extend(messages, typeOrObject);
                    }
                },
                pattern: function (nameOrObject, pattern) {

                    if (angular.isString(nameOrObject)) {
                        config.validation.patterns[nameOrObject] = pattern;
                    } else {
                        angular.extend(config.validation.patterns, nameOrObject);
                    }
                }
            },
            $get: function () {
                return config;
            }
        };
    });

});

fg.config(function (fgConfigProvider, FgField) {

    // - - - - - - - - - - - - - - - - - - - - - -
    // Messages
    // - - - - - - - - - - - - - - - - - - - - - -

    fgConfigProvider.validation.message({
        required: 'Um valor é necessário para este campo.',
        minlength: 'O valor não coincide com o comprimento mínimo{{ field.schema && (" de " + field.schema.validation.minlength + " caracteres" || "")}}.',
        maxlength: 'O valor excede o comprimento máximo{{ field.schema && (" de " + field.schema.validation.maxlength + " caracteres" || "")}}.',
        pattern: 'O valor "{{ field.state.$viewValue }}" não coincide com o formato exigido.',
        email: 'O valor "{{ field.state.$viewValue }}" não é um endereço de email válido.',
        unique: 'O valor "{{ field.state.$viewValue }}" já está em uso.',
        number: 'O valor "{{ field.state.$viewValue }}" não é um número.',
        min: 'O valor {{ field.schema && ("deve ser de pelo menos " + field.schema.validation.min) || field.state.$viewValue + " é muito baixo" }}',
        max: 'O valor {{ field.schema && ("deve ser de pelo menos " + field.schema.validation.max) || field.state.$viewValue + " é muito alto" }}',
        minoptions: 'Pelo menos {{ field.schema.validation.minoptions }} opção(ões) devem ser seleccionados.',
        maxoptions: 'Não mais que {{ field.schema.validation.maxoptions }} opção(ões) devem ser seleccionados.',

        //ui-mask
        "brPhoneNumber": "Telefone inválido.",
        'nfeAccessKey': "Número Nota Fiscal inválido.",
        'ie': "Inscrição Estadual inválido.",
        'cpf': "CPF inválido.",
        'cnpj': "CNPJ inválido",
        "cep": "CEP inválido",
        'brBoletoBancario': "Número do Boleto inválido",
        'time': "Hora inválida.",
        'date': "Data inválida."

    });

    // - - - - - - - - - - - - - - - - - - - - - -
    // Fields
    // - - - - - - - - - - - - - - - - - - - - - -

    var categories = {
        'Campos de Texto': [
            new FgField('text', {
                displayName: 'Campo de Texto'
            }),
            new FgField('email'),
            new FgField('number', {
                displayName: 'Número',
                validation: {maxlength: 15 /* to prevent > Number.MAX_VALUE */}
            }),
            new FgField('password', {
                displayName: 'Senha'
            }),
            new FgField('textarea')
        ],
        'Campos de Checkbox': [
            new FgField('checkbox', {nolabel: true}),
            new FgField('checkboxlist', {
                displayName: 'Lista Checkbox',
                options: [
                    {
                        value: '1',
                        text: 'opção 1'
                    },
                    {
                        value: '2',
                        text: 'opção 2'
                    },
                    {
                        value: '3',
                        text: 'opção 3'
                    }
                ],
                value: {
                    '1': true,
                    '2': true
                }
            })
        ],
        'Campos de Seletores': [
            new FgField('radiobuttonlist', {
                displayName: 'Lista Radiobutton',
                options: [
                    {
                        value: '1',
                        text: 'opção 1'
                    },
                    {
                        value: '2',
                        text: 'opção 2'
                    },
                    {
                        value: '3',
                        text: 'opção 3'
                    }
                ],
                value: '1'
            }),
            new FgField('selectlist', {
                displayName: 'Lista Select',
                options: [
                    {
                        value: '',
                        text: 'Selecione uma opção'
                    },
                    {
                        value: '1',
                        text: 'opção 1'
                    },
                    {
                        value: '2',
                        text: 'opção 2'
                    },
                    {
                        value: '3',
                        text: 'opção 3'
                    }
                ],
                value: ''
            }) // ,
            // new FgField('dropdownlist', {
            //   options: [{
            //     value: '1',
            //     text: 'Option 1'
            //   }, {
            //     value: '2',
            //     text: 'Option 2'
            //   }, {
            //     value: '3',
            //     text: 'Option 3'
            //   }],
            //   value: '1'
            // })
        ]
    };


    angular.forEach(categories, function (fields, category) {
        angular.forEach(fields, function (field) {
            fgConfigProvider.fields.add(field, category /*, templateUrl, propertiesTemplateUrl */);
        });
    });

    // - - - - - - - - - - - - - - - - - - - - - -
    // Patterns
    // - - - - - - - - - - - - - - - - - - - - - -

    fgConfigProvider.validation.pattern({
        'Nenhum': undefined,
        'Url': '/^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$/',
        'Domínio': '/^([a-z][a-z0-9\\-]+(\\.|\\-*\\.))+[a-z]{2,6}$/',
        'Endereço IPv4': '/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/',
        'Email': '/^([a-z0-9_\\.-]+)@([\\da-z\\.-]+)\\.([a-z\\.]{2,6})$/',
        'Inteiro': '/^-{0,1}\\d+$/',
        'Inteiro Positivo': '/^\\d+$/',
        'Inteiro Negativo': '/^-\\d+$/',
        'Número': '/^-{0,1}\\d*\\.{0,1}\\d+$/',
        'Número Positivo': '/^\\d*\\.{0,1}\\d+$/',
        'Número Negativo': '/^-\\d*\\.{0,1}\\d+$/',
        'Ano (1920-2099)': '/^(19|20)[\\d]{2,2}$/',
        'Senha': '/(?=.*\\d)(?=.*[!@#$%^&*\\-=()|?.\"\';:]+)(?![.\\n])(?=.*[A-Z])(?=.*[a-z]).*$/'
    });
});
