from datetime import datetime
from calendar import timegm
from config import db, ma


class Product(db.Model):
    __tablename__ = "product"
    row_id= db.Column(db.Integer, primary_key = True)
    id = db.Column(db.Integer)
    name = db.Column(db.String(32))
    inventory_level = db.Column(db.Integer)
    timestamp = db.Column(
        db.Integer, default=timegm(datetime.utcnow().timetuple()),
        onupdate=timegm(datetime.utcnow().timetuple()))

class ProductSchema(ma.ModelSchema):
    class Meta:
        model = Product
        sqla_session = db.session
