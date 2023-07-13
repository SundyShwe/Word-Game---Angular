import { RequestHandler } from "express";
import TypedResponse from "./types/typedResponse";
import oxford_check from "./utils/oxford";

// RequestHandler<request params, response body, request body, request query params>
export const search: RequestHandler<{ word: string }, TypedResponse<{ valid: boolean }>> = async (req, res, next) => {
    try {
        const { word } = req.params;
        const result = await oxford_check(word);
        res.json({ success: true, data: result });
    } catch (error) {
        next(new Error(`Something went wrong! Please try again.`));
    }
}