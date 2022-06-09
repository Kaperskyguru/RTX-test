import CatFact from '../../services/CatFact.js';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../helpers/passwords.js';
const prisma = new PrismaClient();

class CatsController {
  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async findAll(req, res) {
    try {
      const page = req.query.page || 0;
      const size = req.query.size || 10;

      const cats = await prisma.fact.findMany({
        take: size ?? 30,
        skip: page ?? 0,
      });
      res.status(200).json({
        success: true,
        message: 'Cat facts loaded successfully',
        cats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        msg: 'Internal Server Error Occurred, Please try again',
        error,
      });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  static async load(req, res, next) {
    try {
      // Call handler to response with data
      const items = await CatFact.getListFromAPI();

      //Properly map data to be stored in database
      const mappedData = items.map(async (item) => {
        const user = await prisma.user.upsert({
          where: {
            email: 'test@test.com',
          },
          update: {},
          create: {
            id: item.user,
            name: 'Test User',
            email: 'test@test.com',
            password: await hashPassword('password'),
          },
        });
        const statusCreated = await prisma.status.create({
          data: {
            verified: item.status?.verified ?? false,
            sentCount: item.status?.sentCount ?? 0,
          },
        });

        return {
          id: item._id,
          text: item.text,
          userId: user.id,
          statusId: statusCreated.id,
          source: item.source,
          type: item.type,
          deleted: item.deleted,
          used: item.used,
        };
      });

      //Await all Promises and Store data to database
      const data = await Promise.all(mappedData);
      const created = await prisma.fact.createMany({
        data,
        skipDuplicates: true,
      });

      res.status(200).json({
        success: true,
        message: 'Cat facts loaded successfully from server',
        total: created,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error Occurred, Please try again',
        err,
      });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async store(req, res) {
    try {
      const { verified, sentCount, text, deleted, used, type, source } =
        req.body;

      const status = await prisma.status.create({
        data: {
          verified,
          sentCount,
        },
      });

      // Find User
      const user = await prisma.user.findFirst({
        where: { email: 'test@test.com' },
      });

      const cat = await prisma.fact.create({
        data: {
          text,
          deleted,
          used,
          type,
          source,
          statusId: status?.id,
          userId: user.id,
        },
      });
      res.status(200).json({
        success: true,
        message: 'Cat created successfully',
        cat,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal Server Error Occurred, Please try again',
        error,
      });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  static async show(req, res) {
    const cat = await prisma.fact.findFirst({ where: { id: req.params.id } });
    if (cat) {
      return res.status(200).json({
        success: true,
        message: 'Cat fact loaded successfully',
        data: cat,
      });
    } else
      return res.status(404).json({
        success: false,
        message: 'Cat fact not found',
      });
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async update(req, res) {
    try {
      const data = {};
      const { text, verified, sentCount, source, type, deleted, used } =
        req.body;

      // To avoid data replacement when updating, we have to check for undefined value
      if (text !== undefined) data.text = text;
      if (source !== undefined) data.source = source;
      if (type !== undefined) data.type = type;
      if (deleted !== undefined) data.deleted = deleted;
      if (used !== undefined) data.used = used;

      const cat = await prisma.fact.update({
        where: { id: req.params.id },
        data,
      });

      if (verified || sentCount) {
        const statusData = {};
        if (verified !== undefined) statusData.verified = verified;
        if (sentCount !== undefined) statusData.sentCount = sentCount;

        const cat = await prisma.status.update({
          where: { id: cat.id },
          data: statusData,
        });
      }
      res.status(200).json({
        success: true,
        message: 'Cat fact updated successfully',
        cat,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error Occurred, Please try again',
        error,
      });
    }
  }

  /**
   *
   * @param {*} req
   * @param {*} res
   */
  static async delete(req, res) {
    try {
      const deletedCat = await prisma.fact.delete({
        where: { id: req.params.id },
      });
      if (deletedCat)
        res.status(200).json({
          success: true,
          message: 'Cat deleted successfully',
          deletedCat,
        });
      else
        res.status(404).json({
          success: false,
          message: 'No Cat found',
        });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal Server Error Occurred, Please try again',
        error,
      });
    }
  }
}

export default CatsController;
