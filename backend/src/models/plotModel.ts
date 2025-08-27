// src/models/fieldModel.ts
import { db } from "../db/knex";

export interface Plot {
    id?: number;
    user_id: number;
    name: string;
    culture: string;
    coordinates: string; 
    area: number; 
    point_count: number;
    created_at?: Date;
    updated_at?: Date;
}

export interface PlotActivity {
    id?: number;
    plot_id: number;
    activity_name: string;
    activity_details?: string;
    activity_date: Date;
    created_at?: Date;
    updated_at?: Date;
}

const PLOTS_TABLE = "plots";
const ACTIVITIES_TABLE = "activities";

export async function findPlotsByUserId(userId: number): Promise<Plot[]> {
    return db<Plot>(PLOTS_TABLE).where({ user_id: userId }).orderBy('created_at', 'desc');
}

export async function createPlot(plot: Plot): Promise<Plot> {
    const [created] = await db<Plot>(PLOTS_TABLE).insert(plot).returning("*");                  
    return created;
}

export async function findPlotById(id: number, userId: number): Promise<Plot | undefined> {
    return db<Plot>(PLOTS_TABLE).where({ id, user_id: userId }).first();                                        
}

export async function updatePlot(id: number, userId: number, plot: Partial<Plot>): Promise<Plot | undefined> {
    const [updated] = await db<Plot>(PLOTS_TABLE)
        .where({ id, user_id: userId })
        .update({ ...plot, updated_at: new Date() })
        .returning("*");
    return updated;
}

export async function deletePlot(id: number, userId: number): Promise<boolean> {
    const deleted = await db<Plot>(PLOTS_TABLE).where({ id, user_id: userId }).del();
    return deleted > 0;
}

export async function findActivitiesByPlotId(plotId: number, userId: number): Promise<PlotActivity[]> {
    return db<PlotActivity>(ACTIVITIES_TABLE)
        .join(PLOTS_TABLE, `${ACTIVITIES_TABLE}.plot_id`, `${PLOTS_TABLE}.id`)
        .where({ 
            [`${ACTIVITIES_TABLE}.plot_id`]: plotId,
            [`${PLOTS_TABLE}.user_id`]: userId 
        })
        .select(`${ACTIVITIES_TABLE}.*`)
        .orderBy(`${ACTIVITIES_TABLE}.activity_date`, 'desc');
}

export async function createActivity(activity: PlotActivity): Promise<PlotActivity> {
    const [created] = await db<PlotActivity>(ACTIVITIES_TABLE).insert(activity).returning("*");
    return created;
}

export async function findActivityById(id: number, userId: number): Promise<PlotActivity | undefined> {
    return db<PlotActivity>(ACTIVITIES_TABLE)
        .join(PLOTS_TABLE, `${ACTIVITIES_TABLE}.plot_id`, `${PLOTS_TABLE}.id`)
        .where({ 
            [`${ACTIVITIES_TABLE}.id`]: id,
            [`${PLOTS_TABLE}.user_id`]: userId 
        })
        .select(`${ACTIVITIES_TABLE}.*`)
        .first();
}

export async function updateActivity(id: number, userId: number, activity: Partial<PlotActivity>): Promise<PlotActivity | undefined> {
    const existingActivity = await findActivityById(id, userId);
    if (!existingActivity) return undefined;

    const [updated] = await db<PlotActivity>(ACTIVITIES_TABLE)
        .where({ id })
        .update({ ...activity, updated_at: new Date() })
        .returning("*");
    return updated;
}

export async function deleteActivity(id: number, userId: number): Promise<boolean> {
    const existingActivity = await findActivityById(id, userId);
    if (!existingActivity) return false;

    const deleted = await db<PlotActivity>(ACTIVITIES_TABLE).where({ id }).del();
    return deleted > 0;
}