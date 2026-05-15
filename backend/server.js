require("dotenv").config();

const crypto = require("crypto");
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const seedProducts = require("./data/products.json");

const app = express();
const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
const dbName = process.env.DB_NAME || "thewoodwise";
const port = process.env.PORT || 5000;

let db;

app.use(express.json());

const col = (name) => db.collection(name);
const api = (handler) => async (request, response, next) => {
    try {
        await handler(request, response, next);
    } catch (error) {
        next(error);
    } finally {
    }
};

function cleanProduct(product) {
    return {
        id: product._id.toString(),
        title: product.title,
        brand: product.brand,
        price: product.price,
        rating: product.rating,
        popularity: product.popularity || 0,
        stock: product.stock || 0,
        category: product.category,
        date: product.date,
        image: product.image,
        description: product.description,
    };
}

function productQuery(id) {
    return ObjectId.isValid(id) ? { _id: new ObjectId(id) } : { seedId: Number(id) };
}

function cleanOrders(orders) {
    return Array.isArray(orders)
        ? orders.map(({ product, id, price, paymentMode, date, time }) => ({
            product,
            id,
            price,
            paymentMode,
            date,
            time,
        }))
        : [];
}

async function accountData(userId) {
    await col("userdata").updateOne(
        { userId },
        { $setOnInsert: { userId, orders: [] } },
        { upsert: true }
    );

    const data = await col("userdata").findOne({ userId });
    return { orders: Array.isArray(data?.orders) ? data.orders : [] };
}

const requireUser = api(async (request, response, next) => {
    const auth = request.headers.authorization || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
    const session = token && (await col("sessions").findOne({ token }));

    if (!session) {
        return response.status(401).json({ message: "Please login first" });
    }

    request.token = token;
    request.userId = session.userId;
    next();
});

app.get("/health", api(async (request, response) => {
    response.json({ ok: true });
}));

app.get("/products", api(async (request, response) => {
    const {
        search = "",
        category = "All",
        maxPrice = "",
        rating = "0",
        sort = "newest",
        limit = "0",
        page = "0",
    } = request.query;

    const query = {};
    const term = search.trim();

    if (term) {
        query.$or = ["title", "brand", "category", "description"].map((field) => ({
            [field]: { $regex: term, $options: "i" },
        }));
    }

    if (category !== "All") query.category = category;
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (Number(rating) > 0) query.rating = { $gte: Number(rating) };

    const sortBy = {
        low: { price: 1 },
        high: { price: -1 },
        rating: { rating: -1 },
        popular: { popularity: -1 },
        newest: { date: -1 },
    }[sort] || { date: -1 };

    const pageSize = Math.max(0, Number(limit));
    const currentPage = Math.max(0, Number(page));
    let cursor = col("products").find(query).sort(sortBy);

    if (pageSize && currentPage) cursor = cursor.skip((currentPage - 1) * pageSize);
    if (pageSize) cursor = cursor.limit(pageSize);

    const items = (await cursor.toArray()).map(cleanProduct);

    if (!currentPage) return response.json(items);

    const total = await col("products").countDocuments(query);
    response.json({
        items,
        total,
        page: currentPage,
        limit: pageSize,
        pages: Math.max(1, Math.ceil(total / (pageSize || total || 1))),
    });
}));

app.get("/products/:id", api(async (request, response) => {
    const product = await col("products").findOne(productQuery(request.params.id));

    if (!product) {
        return response.status(404).json({ message: "Product not found" });
    }

    response.json(cleanProduct(product));
}));

app.get("/products/:id/similar", api(async (request, response) => {
    const product = await col("products").findOne(productQuery(request.params.id));

    if (!product) {
        return response.status(404).json({ message: "Product not found" });
    }

    const items = await col("products")
        .find({ _id: { $ne: product._id }, category: product.category })
        .sort({ popularity: -1 })
        .limit(4)
        .toArray();

    response.json(items.map(cleanProduct));
}));

app.post("/signup", api(async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({ message: "Name, email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await col("users").findOne({ email: normalizedEmail });

    if (existingUser) {
        return response.status(409).json({ message: "Account already exists with this email" });
    }

    const result = await col("users").insertOne({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 10),
        createdAt: new Date(),
    });

    await col("userdata").insertOne({ userId: result.insertedId.toString(), orders: [] });
    response.status(201).json({ message: "Signup successful" });
}));

app.post("/login", api(async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ message: "Email and password are required" });
    }

    const user = await col("users").findOne({ email: email.toLowerCase().trim() });
    const validPassword = user && (await bcrypt.compare(password, user.passwordHash || ""));

    if (!validPassword) {
        return response.status(401).json({ message: "Invalid credentials" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const userId = user._id.toString();

    await col("sessions").insertOne({ token, userId, createdAt: new Date() });
    response.json({
        token,
        user: { id: userId, name: user.name, email: user.email },
        data: await accountData(userId),
    });
}));

app.post("/logout", requireUser, api(async (request, response) => {
    await col("sessions").deleteOne({ token: request.token });
    response.json({ message: "Logged out successfully" });
}));

app.get("/me/data", requireUser, api(async (request, response) => {
    response.json(await accountData(request.userId));
}));

app.put("/me/data", requireUser, api(async (request, response) => {
    await col("userdata").updateOne(
        { userId: request.userId },
        { $set: { orders: cleanOrders(request.body.orders) }, $setOnInsert: { userId: request.userId } },
        { upsert: true }
    );

    response.json(await accountData(request.userId));
}));

app.use((error, request, response, next) => {
    console.error(error);
    response.status(500).json({ message: "Something went wrong" });
});

async function start() {
    try {
        await client.connect();
        db = client.db(dbName);

        await Promise.all([
            col("products").createIndex({ category: 1 }),
            col("products").createIndex({ date: -1 }),
            col("users").createIndex({ email: 1 }, { unique: true }),
            col("sessions").createIndex({ token: 1 }, { unique: true }),
            col("sessions").createIndex({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }),
            col("userdata").createIndex({ userId: 1 }, { unique: true }),
        ]);

        if ((await col("products").countDocuments()) === 0) {
            await col("products").insertMany(
                seedProducts.map(({ id, date, ...product }) => ({
                    ...product,
                    seedId: id,
                    date: date ? new Date(date) : new Date(),
                }))
            );
        }

        app.listen(port, () => console.log(`Server running on ${port}`));
    } catch (error) {
        console.error("Unable to start server", error);
        process.exit(1);
    } finally {
    }
}

start();
