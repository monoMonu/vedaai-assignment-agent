import { NextFunction, Request, Response } from "express";
import Paper from "../models/paper.model";

export const getPaperById = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const paper = await Paper.findById(req.params.id);
    if (!paper) {
      return res.status(404).json({ message: "Paper not found" });
    }
    res.json(paper);
  } catch (error) {
    next(error);
  }
}