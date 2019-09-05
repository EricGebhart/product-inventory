/*
 * JavaScript file for the application to demonstrate
 * using the API
 */

// Create the namespace instance
let ns = {};

// Create the model instance
ns.model = (function() {
    'use strict';

    let $event_pump = $('body');

    // Return the API
    return {
        'read': function() {
            let ajax_options = {
                type: 'GET',
                url: 'api/products',
                accepts: 'application/json',
                dataType: 'json'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_read_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        create: function(product) {
            let ajax_options = {
                type: 'POST',
                url: 'api/products',
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(product)
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_create_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        update: function(product) {
            let ajax_options = {
                type: 'PUT',
                url: `api/products/${product.product_id}`,
                accepts: 'application/json',
                contentType: 'application/json',
                dataType: 'json',
                data: JSON.stringify(product)
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_update_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        },
        'delete': function(product_id) {
            let ajax_options = {
                type: 'DELETE',
                url: `api/products/${product_id}`,
                accepts: 'application/json',
                contentType: 'plain/text'
            };
            $.ajax(ajax_options)
            .done(function(data) {
                $event_pump.trigger('model_delete_success', [data]);
            })
            .fail(function(xhr, textStatus, errorThrown) {
                $event_pump.trigger('model_error', [xhr, textStatus, errorThrown]);
            })
        }
    };
}());

// Create the view instance
ns.view = (function() {
    'use strict';

    let $product_id = $('#product_id'),
        $name = $('#name'),
        $inventory_level = $('#inventory_level');

    // return the API
    return {
        reset: function() {
            $product_id.val('');
            $inventory_level.val('');
            $name.val('').focus();
        },
        update_editor: function(product) {
            $product_id.val(product.product_id);
            $inventory_level.val(product.inventory_level);
            $name.val(product.name).focus();
        },
        build_table: function(products) {
            let rows = ''

            // clear the table
            $('.products table > tbody').empty();

            // did we get a products array?
            if (products) {
                for (let i=0, l=products.length; i < l; i++) {
                    rows += `<tr data-product-id="${products[i].product_id}">
                        <td class="name">${products[i].name}</td>
                        <td class="inventory_level">${products[i].inventory_level}</td>
                        <td>${products[i].timestamp}</td>
                    </tr>`;
                }
                $('table > tbody').append(rows);
            }
        },
        error: function(error_msg) {
            $('.error')
                .text(error_msg)
                .css('visibility', 'visible');
            setTimeout(function() {
                $('.error').css('visibility', 'hidden');
            }, 3000)
        }
    };
}());

// Create the controller
ns.controller = (function(m, v) {
    'use strict';

    let model = m,
        view = v,
        $event_pump = $('body'),
        $product_id = $('#product_id'),
        $name = $('#name'),
        $inventory_level = $('#inventory_level');

    // Get the data from the model after the controller is done initializing
    setTimeout(function() {
        model.read();
    }, 100)

    // Validate input
    function validate(name, inventory_level) {
        return name !== "" && inventory_level !== "";
    }

    // Create our event handlers
    $('#create').click(function(e) {
        let name = $name.val(),
            inventory_level = parseInt($inventory_level.val());

        e.preventDefault();

        if (validate(name, inventory_level)) {
            model.create({
                'name': name,
                'inventory_level': inventory_level,
            })
        } else {
            alert('Problem with name or inventory level input');
        }
    });

    $('#update').click(function(e) {
        let product_id = $product_id.val(),
            name = $name.val(),
            inventory_level = parseInt($inventory_level.val());

        e.preventDefault();

        if (validate(name, inventory_level)) {
            model.update({
                product_id: product_id,
                name: name,
                inventory_level: inventory_level,
            })
        } else {
            alert('Problem with name or inventory level input');
        }
        e.preventDefault();
    });

    $('#delete').click(function(e) {
        let product_id = $product_id.val();

        e.preventDefault();

        if (validate('placeholder', inventory_level)) {
            model.delete(product_id)
        } else {
            alert('Problem with name or inventory level input');
        }
        e.preventDefault();
    });

    $('#reset').click(function() {
        view.reset();
    })

    $('table > tbody').on('dblclick', 'tr', function(e) {
        let $target = $(e.target),
            product_id,
            name,
            inventory_level;

        product_id = $target
            .parent()
            .attr('data-product-id');

        name = $target
            .parent()
            .find('td.name')
            .text();

        inventory_level = $target
            .parent()
            .find('td.inventory_level')
            .number();

        view.update_editor({
            product_id: product_id,
            name: name,
            inventory_level: inventory_level,
        });
    });

    // Handle the model events
    $event_pump.on('model_read_success', function(e, data) {
        view.build_table(data);
        view.reset();
    });

    $event_pump.on('model_create_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_update_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_delete_success', function(e, data) {
        model.read();
    });

    $event_pump.on('model_error', function(e, xhr, textStatus, errorThrown) {
        let error_msg = textStatus + ': ' + errorThrown + ' - ' + xhr.responseJSON.detail;
        view.error(error_msg);
        console.log(error_msg);
    })
}(ns.model, ns.view));
