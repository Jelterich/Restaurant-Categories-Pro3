-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/wwkZpa
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.

-- Modify this code to update the DB schema diagram.
-- To reset the sample schema, replace everything with
-- two dots ('..' - without quotes).

CREATE TABLE "restaurants" (
    "business_id" varchar(100)   NOT NULL,
    "name" varchar(200)   NOT NULL,
    "address" varchar(400)   NOT NULL,
    "city" varchar(50)   NOT NULL,
    "state" varchar(50)   NOT NULL,
    "postal_code" varchar(15)   NOT NULL,
    "latitude" float   NOT NULL,
    "longitude" float   NOT NULL,
    "stars" float   NOT NULL,
    "review_count" int   NOT NULL,
    "is_open" int   NOT NULL,
    "attributes" varchar(400)   NOT NULL,
    "categories" varchar(400)   NOT NULL,
    "hours" varchar(200)   NOT NULL,
    PRIMARY KEY ("city"),
	PRIMARY KEY ("state")
);

CREATE TABLE "cities" (
    "city" varchar(50)   NOT NULL,
    "city_ascii" varchar(50)   NOT NULL,
    "state_id" varchar(50)   NOT NULL,
    "state_name" varchar(50)   NOT NULL,
    "county_fips" int   NOT NULL,
    "county_name" varchar(50)   NOT NULL,
    "lat" float   NOT NULL,
    "lng" float   NOT NULL,
    "population" int   NOT NULL,
    "density" float   NOT NULL,
    "source" varchar(100)   NOT NULL,
    "military" boolean   NOT NULL,
    "incorporated" boolean   NOT NULL,
    "timezone" varchar(50)   NOT NULL,
    "ranking" int   NOT NULL,
    "zips" varchar(100)   NOT NULL,
    "id" int   NOT NULL,
	FOREIGN KEY ("city") REFERENCES restaurants("city"),
	FOREIGN KEY ("state_name") REFERENCES restaurants("state")
);

ALTER TABLE "restaurants" ADD CONSTRAINT "fk_restaurants_city_state" FOREIGN KEY("city", "state")
REFERENCES "cities" ("city", "state_name");

SELECT * FROM cities;

SELECT * FROM restaurants;

DROP TABLE cities;

DROP TABLE restaurants;

