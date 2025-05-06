import { Request, Response } from 'express';
import { Table } from './tableInterfaces';
import { ResturantTable } from '../../db/models/table';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../../utils/ApiResponse';
import { ApiErrorResponse } from '../../utils/ApiErrorResponse';

class TableController {
    constructor() {}

    async getTableData(req: Request, res: Response): Promise<Response> {
        try {
            const tables = await ResturantTable.find({});
            if (!tables) {
                return res.status(StatusCodes.NOT_FOUND).json(
                    new ApiErrorResponse(
                        StatusCodes.NOT_FOUND,
                        'No tables found',
                        []
                    )
                );
            }
            return res.status(StatusCodes.OK).json(
                new ApiResponse(
                    StatusCodes.OK,
                    tables,
                    'Tables fetched successfully'
                )
            );
        } catch (error: any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiErrorResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Server error',
                    [error.message]
                )
            );
        }
    }

    async addTableData(req: Request<{}, {}, Table>,
            res: Response): Promise<Response> {
        try {
            const tableData: Table = req.body;
            const addTable = new ResturantTable({...tableData});
            await addTable.save();

            return res.status(StatusCodes.CREATED).json(
                new ApiResponse(
                    StatusCodes.CREATED,
                    {...tableData, id: addTable._id},
                    'Food item created successfully'
                )
            );
        } catch (error: any) {
            if (error.code === 11000) {
                return res.status(StatusCodes.CONFLICT).json(
                    new ApiErrorResponse(
                        StatusCodes.CONFLICT,
                        'Table already exists',
                        [error.message]
                    )
                );
            }

            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
                new ApiErrorResponse(
                    StatusCodes.INTERNAL_SERVER_ERROR,
                    'Server error',
                    [error.message]
                )
            );
        }
    }

    async updateTableData(req: Request, res: Response): Promise<void> {
        try {
            // TODO: Logic to update table data
            res.status(200).json({
                success: true,
                message: "Table data updated successfully!"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error updating table data",
                
            });
        }
    }

    async deleteTableData(req: Request, res: Response): Promise<void> {
        try {
            // TODO : Logic to delete table data
            res.status(200).json({
                success: true,
                message: "Table data deleted successfully!"
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error deleting table data",
                
            });
        }
    }
}

export default TableController;