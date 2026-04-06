import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { FinancialRecord } from '../Schema/finance';
import { start } from 'repl';
import { isStringObject } from 'util/types';

export const monthlysummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, msg: 'Unauthorized' });

    const { month, year } = req.query;
    if (!month || !year) {
      return res.status(400).json({ success: false, msg: 'Please provide month and year' });
    }

    const startDate = new Date(Number(year), Number(month) - 1, 1);
    const endDate = new Date(Number(year), Number(month), 0, 23, 59, 59, 999);

    const summary = await FinancialRecord.aggregate([
      {
        $match: {
          createdBy: new Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate },
          isDeleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          balance: { $subtract: ['$totalIncome', '$totalExpense'] },
        },
      },
    ]);

    res.status(200).json({ success: true, data: summary[0] || { totalIncome: 0, totalExpense: 0, balance: 0 } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

export const yearlysummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, msg: 'Unauthorized' });

    const { year } = req.query;
    if (!year) {
      return res.status(400).json({ success: false, msg: 'Please provide year' });
    }

    const startDate = new Date(Number(year), 0, 1);
    console.log(startDate)
    const endDate = new Date(Number(year), 11, 31, 23, 59, 59, 999);

    const summary = await FinancialRecord.aggregate([
      {
        $match: {
          createdBy: new Types.ObjectId(req.user.id),
          date: { $gte: startDate, $lte: endDate },
          isDeleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          balance: { $subtract: ['$totalIncome', '$totalExpense'] },
        },
      },
    ]);

    res.status(200).json({ success: true, data: summary[0] || { totalIncome: 0, totalExpense: 0, balance: 0 } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};



export const usersummary = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = Array.isArray(id) ? id[0] : id;

    if (!userId) {
      return res.status(400).json({ success: false, msg: "Invalid id" });
    }

    const { startDate, endDate, category, skip = "0", limit = "10" } = req.query;

    if (!req.user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999); // ✅ full day include

    const result = await FinancialRecord.aggregate([
      {
        $match: {
          createdBy: new Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
          ...(category && { category }),
          isDeleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          balance: { $subtract: ["$totalIncome", "$totalExpense"] },
        },
      },
      { $skip: parseInt(skip as string) },
      { $limit: parseInt(limit as string) },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0] || {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      },
    });

  } catch (error) {
    return res.status(500).json({ success: false, msg: "Server Error" });
  }
};


export const summary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, msg: "Unauthorized" });
    }

    const { startDate, endDate, category } = req.query;

   
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setHours(23, 59, 59, 999);

    const result = await FinancialRecord.aggregate([
      {
        $match: {
          date: { $gte: start, $lte: end },
          ...(category && { category }),
          isDeleted: { $ne: true },
        },
      },
      {
        $group: {
          _id: null,
          totalIncome: {
            $sum: {
              $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
            },
          },
          totalExpense: {
            $sum: {
              $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
          totalExpense: 1,
          balance: { $subtract: ["$totalIncome", "$totalExpense"] },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result[0] || {
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
      },
    });

  } catch (error) {
    return res.status(500).json({ success: false, msg: "Server Error" });
  }
};