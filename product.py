"""
This is the product module and supports all the REST actions for the
product data
"""

from flask import make_response, abort
from config import db
from models import Product, ProductSchema
from sqlalchemy.sql import func


def read_all():
    """
    This function responds to a request for /api/product with
    the complete list of inventory levels for all products
    :return:        json string of list of products
    """
    # Create the list of products from our data, newest dates first.
    products = Product.query.order_by(Product.id, Product.timestamp.desc()).all()

    # Serialize the data for the response
    product_schema = ProductSchema(many=True)
    data = product_schema.dump(products)
    return data


def read_one(product_id):
    """
    This function responds to a request for /api/products/{product_id}
    with one matching product from products

    :param product_id:  Id of product to find
    :return:            product matching id
    """
    # Get the product requested
    product = Product.query.filter(Product.product_id == product_id).one_or_none()

    # Did we find a product?
    if product is not None:

        # Serialize the data for the response
        product_schema = ProductSchema()
        data = product_schema.dump(product)
        return data

    # Otherwise, nope, didn't find that product
    else:
        abort(
            404,
            "Product not found for Id: {product_id}".format(product_id=product_id),
        )


def create(product):
    """
    This function creates a new product in the product structure
    based on the passed in product data

    :param product:  product to create in products structure
    :return:        201 on success, 406 on product exists
    """
    name = product.get("name")
    inventory_level = product.get("inventory_level")

    # we aren't this kind of database...
    
    # existing_product = (
    #     Product.query.filter(Product.name == name)
    #     .filter(Product.inventory_level == inventory_level)
    #     .one_or_none()
    # )
    existing_product = None

    # Can we insert this product?
    if existing_product is None:
        
        # Create a new product id based on max value if there isn't an id already
        # this allows us to add a new inventory_level for an existing product.
        # Or create an entirely new product by leaving out the id.
        if "id" not in product:
            product["id"] = db.session.query(func.max(Product.id)).scalar() + 1

        # Create a product instance using the schema and the passed in product
        schema = ProductSchema()
        new_product = schema.load(product, session=db.session)

        # Add the product to the database
        db.session.add(new_product)
        db.session.commit()

        # Serialize and return the newly created product in the response
        data = schema.dump(new_product)

        return data, 201

    # Otherwise, nope, product exists already
    else:
        abort(
            409,
            "Product {name} {inventory_level} exists already".format(
                name=name, inventory_level=inventory_level
            ),
        )


def update(product_id, product):
    """
    This function updates an existing product in the products structure
    Throws an error if a product with the name we want to update to
    already exists in the database.

    :param product_id:   Id of the product to update in the products structure
    :param product:      product to update
    :return:             updated product structure
    """
    # Get the product requested from the db into session
    update_product = Product.query.filter(
        Product.product_id == product_id
    ).one_or_none()

    # Try to find an existing product with the same name as the update
    name = product.get("name")
    inventory_level = product.get("inventory_level")

    existing_product = (
        Product.query.filter(Product.name == name)
        .filter(Product.inventory_level == inventory_level)
        .one_or_none()
    )

    # Are we trying to find a product that does not exist?
    if update_product is None:
        abort(
            404,
            "product not found for Id: {product_id}".format(product_id=product_id),
        )

    # Would our update create a duplicate of another product already existing?
    elif (
        existing_product is not None and existing_product.product_id != product_id
    ):
        abort(
            409,
            "Product {name} {inventory_level} exists already".format(
                name=name, inventory_level=inventory_level
            ),
        )

    # Otherwise go ahead and update!
    else:

        # turn the passed in product into a db object
        schema = ProductSchema()
        update = schema.load(product, session=db.session)

        # Set the id to the product we want to update
        update.product_id = update_product.product_id

        # merge the new object into the old and commit it to the db
        db.session.merge(update)
        db.session.commit()

        # return updated product in the response
        data = schema.dump(update_product)

        return data, 200


def delete(product_id):
    """
    This function deletes a product from the products structure

    :param product_id:   Id of the product to delete
    :return:            200 on successful delete, 404 if not found
    """
    # Get the product requested
    product = product.query.filter(product.product_id == product_id).one_or_none()

    # Did we find a product?
    if product is not None:
        db.session.delete(product)
        db.session.commit()
        return make_response(
            "product {product_id} deleted".format(product_id=product_id), 200
        )

    # Otherwise, nope, didn't find that product
    else:
        abort(
            404,
            "product not found for Id: {product_id}".format(product_id=product_id),
        )
