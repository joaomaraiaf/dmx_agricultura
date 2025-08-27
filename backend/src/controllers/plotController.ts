// src/controllers/fieldController.ts
import { Request, Response } from "express";
import {
    Plot,
    PlotActivity,
    findPlotsByUserId,
    createPlot,
    findPlotById,
    updatePlot,
    deletePlot,
    findActivitiesByPlotId,
    createActivity
} from "../models/plotModel";

export const getPlots = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const plots = await findPlotsByUserId(userId);

        const plotsWithParsedCoordinates = plots.map(plot => ({
            ...plot,
            coordinates: JSON.parse(plot.coordinates)
        }));
        console.log("plotsWithParsedCoordinates", plotsWithParsedCoordinates)
        res.json(plotsWithParsedCoordinates);
    } catch (error) {
        console.error('Error fetching fields:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createPlotController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const { name, culture, coordinates, area, point_count } = req.body;

        console.log('Received data:', { name, culture, coordinates, area, point_count, userId });

        // Validate required fields
        if (!name || !culture || !coordinates || area === undefined || area === null || point_count === undefined || point_count === null) {
            console.log('Validation failed - missing fields:', {
                name: !!name,
                culture: !!culture,
                coordinates: !!coordinates,
                area,
                point_count
            });
            return res.status(400).json({
                error: 'Missing required fields: name, culture, coordinates, area, point_count',
                received: { name, culture, coordinates, area, point_count }
            });
        }

        const fieldData: Plot = {
            user_id: userId,
            name,
            culture,
            coordinates: JSON.stringify(coordinates),
            area: parseFloat(area),
            point_count: parseInt(point_count)
        };

        const newField = await createPlot(fieldData);

        const fieldWithParsedCoordinates = {
            ...newField,
            coordinates: JSON.parse(newField.coordinates)
        };

        res.status(201).json(fieldWithParsedCoordinates);
    } catch (error) {
        console.error('Error creating field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPlotById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const fieldId = parseInt(req.params.id);

        if (isNaN(fieldId)) {
            return res.status(400).json({ error: 'Invalid field ID' });
        }

        const field = await findPlotById(fieldId, userId);

        if (!field) {
            return res.status(404).json({ error: 'Field not found' });
        }

        const fieldWithParsedCoordinates = {
            ...field,
            coordinates: JSON.parse(field.coordinates)
        };

        res.json(fieldWithParsedCoordinates);
    } catch (error) {
        console.error('Error fetching field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updatePlotController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const fieldId = parseInt(req.params.id);
        const { name, culture, coordinates, area, point_count } = req.body;

        if (isNaN(fieldId)) {
            return res.status(400).json({ error: 'Invalid field ID' });
        }

        const updateData: Partial<Plot> = {};
        if (name) updateData.name = name;
        if (culture) updateData.culture = culture;
        if (coordinates) updateData.coordinates = JSON.stringify(coordinates);
        if (area) updateData.area = parseFloat(area);
        if (point_count) updateData.point_count = parseInt(point_count);

        const updatedField = await updatePlot(fieldId, userId, updateData);

        if (!updatedField) {
            return res.status(404).json({ error: 'Field not found' });
        }

        const fieldWithParsedCoordinates = {
            ...updatedField,
            coordinates: JSON.parse(updatedField.coordinates)
        };

        res.json(fieldWithParsedCoordinates);
    } catch (error) {
        console.error('Error updating field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const deletePlotController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const fieldId = parseInt(req.params.id);

        if (isNaN(fieldId)) {
            return res.status(400).json({ error: 'Invalid field ID' });
        }

        const deleted = await deletePlot(fieldId, userId);

        if (!deleted) {
            return res.status(404).json({ error: 'Field not found' });
        }

        res.status(204).send();
    } catch (error) {
        console.error('Error deleting field:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getPlotActivities = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const plotId = parseInt(req.params.id);

        if (isNaN(plotId)) {
            return res.status(400).json({ error: 'Invalid plot ID' });
        }

        const plot = await findPlotById(plotId, userId);
        if (!plot) {
            return res.status(404).json({ error: 'Plot not found' });
        }

        const activities = await findActivitiesByPlotId(plotId, userId);
        res.json(activities);
    } catch (error) {
        console.error('Error fetching plot activities:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const createPlotActivity = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.id;
        const plotId = parseInt(req.params.id);
        const { activity_name, activity_details, activity_date } = req.body;

        if (isNaN(plotId)) {
            return res.status(400).json({ error: 'Invalid plot ID' });
        }

        if (!activity_name || !activity_date) {
            return res.status(400).json({
                error: 'Missing required fields: activity_name, activity_date'
            });
        }

        const plot = await findPlotById(plotId, userId);
        if (!plot) {
            return res.status(404).json({ error: 'Plot not found' });
        }

        const activityData: PlotActivity = {
            plot_id: plotId,
            activity_name,
            activity_details: activity_details || '',
            activity_date: new Date(activity_date)
        };

        const newActivity = await createActivity(activityData);
        res.status(201).json(newActivity);
    } catch (error) {
        console.error('Error creating field activity:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};