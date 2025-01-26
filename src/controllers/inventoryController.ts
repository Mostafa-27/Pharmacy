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
  try {
    const { barcode } = req.body;
    console.log("barcode", req.user.pharmacy_id, barcode);
    const stockItem = await inventoryService.getStockByBarcode(
      req.user.pharmacy_id,
      barcode
    );

    if (!stockItem) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    if (stockItem.stock_quantity <= 0) {
      res.status(400).json({ error: "Out of stock" });
      return;
    }

    const updatedStock = await inventoryService.updateStockQuantity(
      req.user.pharmacy_id,
      barcode,
      stockItem.stock_quantity - 1
    );
    res.json(updatedStock);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
