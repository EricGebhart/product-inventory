
# A simple backend server using Python, Flask, Connexion, Marshmallow and SQLAlchemy.

The requirement only specified CSV for the data, but in many ways SQLAlchemy is
easier. So that's what I did.

_Flask_CORS_ is installed because otherwise I couldn't access my server from the client
when both are running on localhost.

The only trick is that SQLAlchemy really wants a primary key and this table specification
doesn't need one. So I added a _row-id column_ to make SQLAlchemy happy.

I stored the timestamp data as an epoch number at UTC.  This is the easiest storage
format for dates which can be easily turned back into a date object as needed.

There is a a simple user interface, I didn't do too much with it. It does work
to a point.

The API is defined with Swagger, so the specification is browseable here.

If you navigate to [http://localhost:5000/api/ui](http://localhost:5000/api/ui), you will find the API doc to the server requests.

Browse [here](http://localhost:5000/) to get to the server side UI. It's just a sanity check really 

There is a UI project that works with this server [in this repo.](http://github.com/ericgebhart/prod-inv-ui.git)


# these are the goals.  On verra.

**Front (client side)** 


*It should include three main elements:* 

1- A graph of inventory level(y-axis) vs. date(x-axis) of the selected product 

2- Table of data filtered on the selected product: product_id; product_name; date; inventory_level

3- Dropdown/Select option to choose the product ID or product name to visualize

4- **(Bonus)** Add a button that allows data table editing. Add the possibility to change the "inventory level"  and send request to change it in the back-end 

5- (**Bonus)** Add the possibility to choose multiple products and visualize them in the same graph

**Back (server side)**

Storing the data in a simple flat file. 
Implement a simple API (post, get,...). 

**Unit test**

Write some basic unit test (client and server side)

## Annexe

**Constraints**

1) front-end code and back-end code are separated in two different projects

2) Communication between back and front is done by a rest API or GaphQL

**Type of data**

You can create the sample of data you want with at least those elements: 

```
product_id(int); product_name(String); date(String: "dd-mm-yyyy"); inventory_level(int)
```


# How to get this running.

This is a _python3_ project. 

*Create a virtual env how you like.*

`pip install connexion[swagger-ui]`

`pip install Flask-SQLAlchemy flask-cors flask-marshmallow marshmallow-sqlalchemy marshmallow`

Each time you run this the database will be recreated.

`python build_database.py`

Once there is a database you can run the server.
`python server.py`






