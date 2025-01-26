import { Request, Response } from "express";
import * as inventoryService from "../services/inventoryService";

export const getStock = async (req: Request, res: Response): Promise<void> => {
  try {
    const stock = await inventoryService.getStock(req.user.pharmacy_id);
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reorderStock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await inventoryService.reorderStock(
      req.user.pharmacy_id,
      req.body
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const scanBarcode = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Implement barcode scanning logic here
  res.json({ message: "Barcode scanned" });
};

export const getLocations = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Implement multi-location support logic here
  res.json({ message: "Locations retrieved" });
};

export const getMedicineStock = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { medicine_id } = req.query;
    const stock = await inventoryService.getMedicineStock(
      req.user.pharmacy_id,
      Number(medicine_id)
    );
    res.json(stock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
