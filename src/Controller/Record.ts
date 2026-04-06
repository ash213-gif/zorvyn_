import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { FinancialRecord } from '../Schema/finance'

    // admin can update and manage records

export const getRecords = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, category, type } = req.query;

    if (!req.user) {
      return res.status(401).json({ success: false, msg: 'Unauthorized' });
    }

    // 🔹 Pagination params
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    // 🔹 Base query
    const query: any = { createdBy: req.user.id };

    if (category) query.category = category;
    if (type) query.type = type;

    // 🔹 Date filtering (safe)
    if (startDate || endDate) {
      query.date = {};

      if (startDate) {
        const start = new Date(startDate as string);
        if (isNaN(start.getTime())) {
          return res.status(400).json({ msg: "Invalid startDate" });
        }
        query.date.$gte = start;
      }

      if (endDate) {
        const end = new Date(endDate as string);
        if (isNaN(end.getTime())) {
          return res.status(400).json({ msg: "Invalid endDate" });
        }
        query.date.$lte = end;
      }
    }

    // 🔹 Fetch data with pagination
    const records = await FinancialRecord.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await FinancialRecord.countDocuments(query);

    // 🔹 Pagination meta
    const pagination = {
      current: page,
      pages: Math.ceil(total / limit),
      total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    };

    res.status(200).json({
      success: true,
      count: records.length,
      pagination,
      data: records,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};


export const updateRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, msg: 'Unauthorized' });

    // Destructure to prevent passing immutable fields like _id to the update object
    const { _id, createdBy, ...updateData } = req.body;

    const record = await FinancialRecord.findOneAndUpdate(
      { _id: new Types.ObjectId(req.params.id as string), createdBy: new Types.ObjectId(req.user.id) },
      { ...updateData, updatedBy: new Types.ObjectId(req.user.id) },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ success: false, msg: 'Record not found or unauthorized' });
    }

    res.status(200).json({ success: true, data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

export const deleteRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, msg: 'Unauthorized' });

    // We perform a soft delete as requested by the schema design
    const record = await FinancialRecord.findOneAndUpdate(
      { _id: new Types.ObjectId(req.params.id as string), createdBy: new Types.ObjectId(req.user.id) },
      {
        isDeleted: true,
        deletedAt: new Date(),
        deletedBy: new Types.ObjectId(req.user.id),
      },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ success: false, msg: 'Record not found or unauthorized' });
    }

    res.status(200).json({ success: true, msg: 'Record deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};

export const createRecord = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, msg: 'Unauthorized' });
    const { amount, type, category, date, description, tags } = req.body;

    const record = await FinancialRecord.create({
      amount,
      type,
      category,
      date,
      description,
      tags,
      createdBy: new Types.ObjectId(req.user.id),
    });

    res.status(201).json({ success: true, data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
