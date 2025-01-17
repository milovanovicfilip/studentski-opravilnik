import { News } from "../Models/News.Model.mjs";

export default class NewsController {
    constructor() { }

    static async getNews(req, res) {
        try {
            let news = await News.find().sort({ date: -1 });

            if (news.length === 0) {
                news = await NewsController.seedDefaultNews();
            }

            res.render("index", { title: "Študentski opravilnik", news });
        } catch (error) {
            console.error("Failed to fetch news:", error.message);
            res.render("index", { title: "Študentski opravilnik", news: [] });
        }
    }

    // napolni mongodb collection, če je prazna (drugače pride do napake v home page)
    static async seedDefaultNews() {
        console.log("No news found, adding default news...");
        const sampleNews = [
            {
                title: "Dobrodošli v Študentskem Opravilniku",
                content: "Organizirajte svoje študentsko življenje!",
                date: new Date(),
            },
            {
                title: "Nova funkcionalnost: Koledar",
                content: "Roki nalog so zdaj pregledno prikazani na eni strani.",
                date: new Date(),
            },
        ];

        try {
            const createdNews = await News.insertMany(sampleNews);
            return createdNews;
        } catch (error) {
            console.error("Failed to insert default news:", error);
            return [];
        }
    }
}

