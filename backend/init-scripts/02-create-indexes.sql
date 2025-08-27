CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE INDEX IF NOT EXISTS idx_plots_user_id ON plots(user_id);
CREATE INDEX IF NOT EXISTS idx_plots_created_at ON plots(created_at);
CREATE INDEX IF NOT EXISTS idx_plots_culture ON plots(culture);

CREATE INDEX IF NOT EXISTS idx_activities_plot_id ON activities(plot_id);
CREATE INDEX IF NOT EXISTS idx_activities_activity_date ON activities(activity_date);
CREATE INDEX IF NOT EXISTS idx_activities_created_at ON activities(created_at);