import os
import random
from config import db
from models import Product

# Data to initialize database with
PRODUCT_NAMES = ["foo", "bar", "baz", "foobar", "green eggs", "ham", "spam" ]

# Delete database file if it exists currently
if os.path.exists("product.db"):
    os.remove("product.db")

# Create the database
db.create_all()

# iterate over the Products and populate the database
for i in range(1,10):
    for pid, pname in enumerate(PRODUCT_NAMES):
        p = Product(id=pid, name=pname, inventory_level=random.randint(1, 101))
        db.session.add(p)

db.session.commit()
