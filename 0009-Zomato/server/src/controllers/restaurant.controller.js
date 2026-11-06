const Restaurant = require("../models/restaurant.model");
const MenuItem = require("../models/menuItem.model");
const getPagination = require("../utils/pagination");
const findOwnedRestaurant = require("../utils/ownership");
const order = require("../models/order.model");

// Turns lng/lat from the request body into a GeoJSON point (or null if invalid)
function buildLocation(lng, lat) {
  const longitude = Number(lng);
  const latitude = Number(lat);

  const isValid =
    lng !== undefined &&
    lat !== undefined &&
    Number.isFinite(longitude) &&
    Number.isFinite(latitude) &&
    longitude >= -180 &&
    longitude <= 180 &&
    latitude >= -90 &&
    latitude <= 90;

  return isValid ? { type: "Point", coordinates: [longitude, latitude] } : null;
}

// GET /api/restaurants?page=1&limit=10&city=Bhopal
async function getRestaurants(req, res) {
  const { page, limit, skip } = getPagination(req.query);

  const filter = {};
  if (req.query.city) {
    filter.city = String(req.query.city);
  }

  const [restaurants, total] = await Promise.all([
    Restaurant.find(filter).sort({ name: 1, _id: 1 }).skip(skip).limit(limit),
    Restaurant.countDocuments(filter),
  ]);

  res.json({
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    restaurants,
  });
}

// GET /api/restaurants/:id
async function getRestaurantById(req, res) {
  const restaurant = await Restaurant.findById(req.params.id).populate(
    "owner",
    "name",
  );
  if (!restaurant) {
    return res.status(404).json({ message: "Restaurant not found" });
  }
  res.json({ restaurant });
}

// POST /api/restaurants  (owner)
// Body: { name, city, area, cuisines: [], lng, lat, isOpen }
async function createRestaurant(req, res) {
  const { name, city, area, cuisines, lng, lat, isOpen } = req.body;

  const location = buildLocation(lng, lat);
  if (!location) {
    return res.status(400).json({ message: "Valid lng and lat are required" });
  }

  const restaurant = await Restaurant.create({
    name,
    owner: req.user.id,
    city,
    area,
    cuisines,
    location,
    isOpen,
  });

  res.status(201).json({ restaurant });
}

// PATCH /api/restaurants/:id  (owner, own restaurant only)
async function updateRestaurant(req, res) {
  const { restaurant, error } = await findOwnedRestaurant(
    req.params.id,
    req.user.id,
  );
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  // Only these fields can be changed
  const allowedFields = ["name", "city", "area", "cuisines", "isOpen"];
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      restaurant[field] = req.body[field];
    }
  }

  if (req.body.lng !== undefined || req.body.lat !== undefined) {
    const location = buildLocation(req.body.lng, req.body.lat);
    if (!location) {
      return res
        .status(400)
        .json({ message: "Send both lng and lat with valid values" });
    }
    restaurant.location = location;
  }

  await restaurant.save();
  res.json({ restaurant });
}

// DELETE /api/restaurants/:id  (owner, own restaurant only)
async function deleteRestaurant(req, res) {
  const { restaurant, error } = await findOwnedRestaurant(
    req.params.id,
    req.user.id,
  );
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  // Remove the menu too. Old orders and reviews are kept for history.
  await MenuItem.deleteMany({ restaurant: restaurant._id });
  await restaurant.deleteOne();

  res.json({ message: "Restaurant deleted" });
}

//GEt /api/restaurants/:id/revenue  (owner, own restaurant only)
async function getRestaurantRevenue(req, res) {
  const id = req.params.id;
  const to = req.query.to ? new Date(req.query.to) : new Date();
  const from = req.query.from
    ? new Date(req.query.from)
    : new Date(to.getTime() - 7 * 24 * 60 * 60 * 1000);
  from.setHours(0, 0, 0, 0);

  /* 

  res = {
  message: "Revenue fetched successfully",
  revenue:12345, // total revenue in the given time range
  from:"2024-01-01T00:00:00.000Z", // start date of the range
  to:"2024-01-07T23:59:59.999Z" // end date of the range
  days: [
    {
      date: "2024-01-01",
      revenue: 1234
    },
    {
      date: "2024-01-02",
      revenue: 2345
    },
    ...
  ]
  }
   */

  const revenue = await Order.aggregate([
    {
      $match: {
        restaurant: new ObjectId(id),
        status: "delivered",
        createdAt: {
          $gte: from,
          $lte: to,
        },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$createdAt",
          },
        },
        revenue: {
          $sum: "$totalAmount",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
    {
      $project: {
        date: "$_id",
        revenue: 1,
        _id: 0,
      },
    },
  ]);

  res.json({
    message: "Revenue fetched successfully",
    revenue: revenue.reduce((acc, curr) => acc + curr.revenue, 0),
    from: from.toISOString(),
    to: to.toISOString(),
    days: revenue,
  });
}

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};
s;
