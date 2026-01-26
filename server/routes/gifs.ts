import express, { Request, Response } from "express";
import auth from "../auth";

const router = express.Router();

router.get("/search", auth.ensureLoggedIn, async (req, res) => {
  try {
    const query = req.query.q as string;
    const apikey = process.env.GIF_API;
    const customerid = req.user!._id;

    if (!apikey) res.send([]);

    const baseURL = "https://api.klipy.com/api/v1";

    const endpoint = query
      ? `${baseURL}/${apikey}/gifs/search`
      : `${baseURL}/${apikey}/gifs/trending`;

    const params = new URLSearchParams({
      customer_id: customerid,
      per_page: "20",
      locale: "en_US",
    });
    if (query) params.append("q", query);
    const finalURL = `${endpoint}?${params.toString()}`;

    const response = await fetch(finalURL);
    if (!response.ok) return res.send([]);

    const json = await response.json();
    if (!json.result || !json.data || !json.data.data) return res.send([]);

    const gifList = json.data.data.map((item: any) => {
      const media = item.file;
      if (!media) return null;

      if (media.md?.gif?.url) return media.md.gif.url;
      if (media.sm?.gif?.url) return media.sm.gif.url;
      if (media.hd?.gif?.url) return media.hd.gif.url;

      return null;
    });
    const clean = gifList.filter((url): url is string => url !== null);
    res.send(clean);
  } catch (error) {
    console.error("GIF Fetch Error:", error);
    return res.status(500).send({ error: "Failed to fetch gifs" });
  }
});

export default router;
