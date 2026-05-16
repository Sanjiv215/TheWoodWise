require("dotenv").config();

const crypto = require("crypto");
const path = require("path");
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const seedProducts = require("./data/products.json");

const app = express();
const client = new MongoClient(process.env.MONGO_URI || "mongodb://localhost:27017");
const dbName = process.env.DB_NAME || "thewoodwise";
const port = process.env.PORT || 5000;
const otpMinutes = 10;

let db;
let mailTransporter;

app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "../frontend/images")));

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
        images: Array.isArray(product.images) ? product.images : [],
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

function normalizeEmail(email) {
    return String(email || "").toLowerCase().trim();
}

function createOtp() {
    return crypto.randomInt(100000, 1000000).toString();
}

function getMailTransporter() {
    if (mailTransporter) return mailTransporter;

    const smtpUser = process.env.SMTP_USER || "sanjivprasad215@gmail.com";
    const { SMTP_PASS } = process.env;

    if (!SMTP_PASS) {
        throw new Error("SMTP_PASS is missing");
    }

    const options = {
        service: "gmail",
        auth: {
            user: smtpUser,
            pass: SMTP_PASS,
        },
    };
    const defaults = {
        from: process.env.SMTP_FROM || `TheWoodWise <${smtpUser}>`,
    };

    mailTransporter = nodemailer.createTransport(options, defaults);

    return mailTransporter;
}

async function sendOtpEmail(email, otp, purpose) {
    await getMailTransporter().sendMail({
        to: email,
        subject: `Your TheWoodWise ${purpose} code`,
        text: `Your TheWoodWise ${purpose} OTP is ${otp}. It expires in ${otpMinutes} minutes.`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>TheWoodWise ${purpose}</h2>
                <p>Your OTP is:</p>
                <p style="font-size: 28px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
                <p>This code expires in ${otpMinutes} minutes.</p>
            </div>
        `,
    });
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

app.post("/signup/send-otp", api(async (request, response) => {
    const { name, email, password } = request.body;

    if (!name || !email || !password) {
        return response.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 4) {
        return response.status(400).json({ message: "Password needs at least 4 characters" });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await col("users").findOne({ email: normalizedEmail });

    if (existingUser) {
        return response.status(409).json({ message: "Account already exists with this email" });
    }

    const otp = createOtp();
    const expiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);

    await col("signup_otps").updateOne(
        { email: normalizedEmail },
        {
            $set: {
                name: name.trim(),
                email: normalizedEmail,
                passwordHash: await bcrypt.hash(password, 10),
                otpHash: await bcrypt.hash(otp, 10),
                expiresAt,
                attempts: 0,
                updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
    );

    try {
        await sendOtpEmail(normalizedEmail, otp, "email verification");
    } catch (error) {
        await col("signup_otps").deleteOne({ email: normalizedEmail });
        return response.status(500).json({ message: error.message || "Could not send OTP email" });
    }

    response.json({ message: "OTP sent to your email" });
}));

app.post("/signup/verify", api(async (request, response) => {
    const { email, otp } = request.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !otp) {
        return response.status(400).json({ message: "Email and OTP are required" });
    }

    const pendingSignup = await col("signup_otps").findOne({ email: normalizedEmail });

    if (!pendingSignup || pendingSignup.expiresAt < new Date()) {
        return response.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    if ((pendingSignup.attempts || 0) >= 5) {
        await col("signup_otps").deleteOne({ email: normalizedEmail });
        return response.status(429).json({ message: "Too many attempts. Please request a new OTP." });
    }

    const validOtp = await bcrypt.compare(String(otp).trim(), pendingSignup.otpHash || "");

    if (!validOtp) {
        await col("signup_otps").updateOne({ email: normalizedEmail }, { $inc: { attempts: 1 } });
        return response.status(400).json({ message: "Invalid OTP" });
    }

    const existingUser = await col("users").findOne({ email: normalizedEmail });

    if (existingUser) {
        await col("signup_otps").deleteOne({ email: normalizedEmail });
        return response.status(409).json({ message: "Account already exists with this email" });
    }

    const result = await col("users").insertOne({
        name: pendingSignup.name,
        email: normalizedEmail,
        passwordHash: pendingSignup.passwordHash,
        emailVerified: true,
        createdAt: new Date(),
    });

    await col("userdata").insertOne({ userId: result.insertedId.toString(), orders: [] });
    await col("signup_otps").deleteOne({ email: normalizedEmail });
    response.status(201).json({ message: "Signup successful" });
}));

app.post("/password/forgot", api(async (request, response) => {
    const normalizedEmail = normalizeEmail(request.body.email);

    if (!normalizedEmail) {
        return response.status(400).json({ message: "Email is required" });
    }

    const user = await col("users").findOne({ email: normalizedEmail });

    if (!user) {
        return response.status(404).json({ message: "No account found with this email" });
    }

    const otp = createOtp();
    const expiresAt = new Date(Date.now() + otpMinutes * 60 * 1000);

    await col("password_reset_otps").updateOne(
        { email: normalizedEmail },
        {
            $set: {
                email: normalizedEmail,
                otpHash: await bcrypt.hash(otp, 10),
                expiresAt,
                attempts: 0,
                updatedAt: new Date(),
            },
            $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
    );

    try {
        await sendOtpEmail(normalizedEmail, otp, "password reset");
    } catch (error) {
        await col("password_reset_otps").deleteOne({ email: normalizedEmail });
        return response.status(500).json({ message: error.message || "Could not send OTP email" });
    }

    response.json({ message: "Password reset OTP sent to your email" });
}));

app.post("/password/reset", api(async (request, response) => {
    const { email, otp, password } = request.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !otp || !password) {
        return response.status(400).json({ message: "Email, OTP and new password are required" });
    }

    if (password.length < 4) {
        return response.status(400).json({ message: "Password needs at least 4 characters" });
    }

    const pendingReset = await col("password_reset_otps").findOne({ email: normalizedEmail });

    if (!pendingReset || pendingReset.expiresAt < new Date()) {
        return response.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    if ((pendingReset.attempts || 0) >= 5) {
        await col("password_reset_otps").deleteOne({ email: normalizedEmail });
        return response.status(429).json({ message: "Too many attempts. Please request a new OTP." });
    }

    const validOtp = await bcrypt.compare(String(otp).trim(), pendingReset.otpHash || "");

    if (!validOtp) {
        await col("password_reset_otps").updateOne({ email: normalizedEmail }, { $inc: { attempts: 1 } });
        return response.status(400).json({ message: "Invalid OTP" });
    }

    const result = await col("users").updateOne(
        { email: normalizedEmail },
        { $set: { passwordHash: await bcrypt.hash(password, 10), passwordUpdatedAt: new Date() } }
    );

    if (!result.matchedCount) {
        await col("password_reset_otps").deleteOne({ email: normalizedEmail });
        return response.status(404).json({ message: "No account found with this email" });
    }

    await col("password_reset_otps").deleteOne({ email: normalizedEmail });
    response.json({ message: "Password reset successful" });
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

app.put("/me", requireUser, api(async (request, response) => {
    const name = String(request.body.name || "").trim();

    if (!name) {
        return response.status(400).json({ message: "Name is required" });
    }

    if (name.length > 60) {
        return response.status(400).json({ message: "Name must be 60 characters or less" });
    }

    const userObjectId = ObjectId.isValid(request.userId) ? new ObjectId(request.userId) : null;

    if (!userObjectId) {
        return response.status(404).json({ message: "Account not found" });
    }

    const result = await col("users").findOneAndUpdate(
        { _id: userObjectId },
        { $set: { name, updatedAt: new Date() } },
        { returnDocument: "after" }
    );
    const updatedUser = result?.value || result;

    if (!updatedUser) {
        return response.status(404).json({ message: "Account not found" });
    }

    response.json({
        user: {
            id: updatedUser._id.toString(),
            name: updatedUser.name,
            email: updatedUser.email,
        },
    });
}));

app.delete("/me", requireUser, api(async (request, response) => {
    const userObjectId = ObjectId.isValid(request.userId) ? new ObjectId(request.userId) : null;
    const user = userObjectId ? await col("users").findOne({ _id: userObjectId }) : null;

    await Promise.all([
        col("sessions").deleteMany({ userId: request.userId }),
        col("userdata").deleteOne({ userId: request.userId }),
        user?.email ? col("signup_otps").deleteOne({ email: user.email }) : Promise.resolve(),
        user?.email ? col("password_reset_otps").deleteOne({ email: user.email }) : Promise.resolve(),
        userObjectId ? col("users").deleteOne({ _id: userObjectId }) : Promise.resolve(),
    ]);

    response.json({ message: "Account deleted successfully" });
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
            col("signup_otps").createIndex({ email: 1 }, { unique: true }),
            col("signup_otps").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
            col("password_reset_otps").createIndex({ email: 1 }, { unique: true }),
            col("password_reset_otps").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        ]);

        if ((await col("products").countDocuments()) === 0) {
            await col("products").insertMany(
                seedProducts.map(({ id, date, ...product }) => ({
                    ...product,
                    seedId: id,
                    date: date ? new Date(date) : new Date(),
                }))
            );
        } else {
            await col("products").bulkWrite(
                seedProducts.map(({ id, image }) => ({
                    updateOne: {
                        filter: { seedId: id },
                        update: { $set: { image } },
                    },
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
