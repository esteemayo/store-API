import { StatusCodes } from 'http-status-codes';

import catchError from '../utils/catchError.js';
import APIFeatures from '../utils/apiFeatures.js';
import NotFoundError from '../errors/notFound.js';

export const getAll = (Model) =>
  catchError(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(StatusCodes.OK).json({
      status: 'success',
      requestedAt: req.requestTime,
      counts: docs.length,
      docs,
    });
  });

export const getOneById = (Model) =>
  catchError(async (req, res, next) => {
    const { id: docID } = req.params;

    const doc = await Model.findById(docID);

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that ID: ${docID}`)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      doc,
    });
  });

export const getOneBySlug = (Model) =>
  catchError(async (req, res, next) => {
    const { slug } = req.params;

    const doc = await Model.findOne({ slug: slug });

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that SLUG: ${slug}`)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      doc,
    });
  });

export const createOne = (Model) =>
  catchError(async (req, res, next) => {
    const doc = await Model.create({ ...req.body });

    res.status(StatusCodes.CREATED).json({
      status: 'success',
      doc,
    });
  });

export const updateOne = (Model) =>
  catchError(async (req, res, next) => {
    const { id: docID } = req.params;

    const doc = await Model.findByIdAndUpdate(docID, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that ID: ${docID}`)
      );
    }

    res.status(StatusCodes.OK).json({
      status: 'success',
      doc,
    });
  });

export const deleteOne = (Model) =>
  catchError(async (req, res, next) => {
    const { id: docID } = req.params;

    const doc = await Model.findByIdAndDelete(docID);

    if (!doc) {
      return next(
        new NotFoundError(`No document found with that ID: ${docID}`, 404)
      );
    }

    res.status(StatusCodes.NO_CONTENT).json({
      status: 'success',
      doc: null,
    });
  });

const factory = {
  getAll,
  getOneById,
  getOneBySlug,
  createOne,
  updateOne,
  deleteOne,
};

export default factory;
