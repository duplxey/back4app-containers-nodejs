const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

app.get("/", (req, res) => {
  return res.json({
    name: "express-github-stats",
    description: "simple github user stats fetcher",
    version: "1.0.0",
  });
});

app.get("/:username", async (req, res) => {
  const username = req.params["username"];
  try {
    const [user, repos] = await axios.all([
      axios.get(`https://api.github.com/users/${username}`),
      axios.get(`https://api.github.com/users/${username}/repos`),
    ]);
    const { login, name, location, followers, following } = user.data;
    let stargazers_count = 0;
    for (let i = 0; i < repos.length; i++) {
      stargazers_count += repos[i]["stargazers_count"];
    }
    return res.json({
      username: login,
      name: name,
      location: location,
      followers: followers,
      following: following,
      stars: stargazers_count,
    });
  } catch (e) {
    console.error(e);
    return res.status(400).json({
      detail: "Oops, something went wrong. Check the console for more information.",
    });
  }
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});