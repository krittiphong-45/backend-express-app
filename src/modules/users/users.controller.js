import { users } from "../../mock-db/users.js";
import { User } from "./users.model.js";

export const testAPI = (req, res) => {
  res.send(`
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Express + Tailwind</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="min-h-screen bg-gray-50 text-gray-800">
      <main class="max-w-2xl mx-auto p-8">
        <div class="rounded-xl bg-white shadow-sm ring-1 ring-gray-100 p-8">
          <h1 class="text-3xl font-bold tracking-tight text-blue-600">
            Hello Client! I am your Server!
          </h1>
          <p class="mt-3 text-gray-600">
            This page is styled with <span class="font-semibold">Tailwind CSS</span> via CDN.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a href="/users" class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              GET /users
            </a>
            <span class="text-xs text-gray-500">Try POST/PUT/DELETE with your API client.</span>
          </div>
        </div>
        <footer class="mt-10 text-center text-xs text-gray-400">
          Express server running with Tailwind via CDN
        </footer>
      </main>
    </body>
  </html>`)
};

//❌ route handler:get all users (mork)
export const getUsers2 = (req, res) => {
  res.status(200).json(users);
};

//✅ route handler: get all users from the database
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Failed to get users...",
    });
  }
}

export const deleteUser = (req, res) => {
  const userId = req.params.id;

  const userIndex = users.findIndex((user) => user.id === userId);

  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    res.status(200).send(`User with ID ${userId} deleted ✅`);
  } else {
    res.status(404).send(`User not found.`);
  }
};

//❌ route handler: create a new user (mork)
export const createUser2 = (req, res) => {
  const { name, email } = req.body

  const newUser = {
    id: String(users.length + 1),
    name: name,
    email: email,
  };

  users.push(newUser);

  res.status(201).json(newUser);

};

//✅ route handler: create a new user in the database
export const createUser = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(404).json({
      success: false,
      error: "username, email, and password are required",
    });
  }

  try {
    const doc = await User.create({ username, email, password });

    const safe = doc.toObject()
    delete safe.password

    return res.status(201).json({
      success: true,
      data: safe
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: "Email already in use!",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Failed to create user...",
    });
  }
}