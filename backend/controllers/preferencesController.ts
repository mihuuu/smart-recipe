import { Request, Response } from "express";
import User from "../models/User";

export const getPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);

    res.json({
      success: true,
      data: user!.preferences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const updatePreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const { complexity, spice, dietary, cuisine, meal } = req.body as {
      complexity?: string[];
      spice?: string[];
      dietary?: string[];
      cuisine?: string[];
      meal?: string[];
    };

    const user = await User.findById(req.user!.id);

    user!.preferences = {
      complexity: complexity || [],
      spice: spice || [],
      dietary: dietary || [],
      cuisine: cuisine || [],
      meal: meal || [],
    };

    await user!.save();

    res.json({
      success: true,
      data: user!.preferences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};

export const resetPreferences = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user!.id);

    user!.preferences = {
      complexity: [],
      spice: [],
      dietary: [],
      cuisine: [],
      meal: [],
    };

    await user!.save();

    res.json({
      success: true,
      data: user!.preferences,
      message: "Preferences reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: (error as Error).message,
    });
  }
};
