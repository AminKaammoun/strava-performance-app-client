import { useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import {
  Alert,
  Box,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  DirectionsRun,
  EmojiEvents,
  LocalFireDepartment,
  Speed,
  Timeline,
} from "@mui/icons-material";
import { LineChart, BarChart } from "@mui/x-charts";
import analyticsService from "../services/analyticsService";
import { goalCollection } from "../stores/catalog/GoalCollection";

function formatPace(secPerKm) {
  if (secPerKm == null || !Number.isFinite(secPerKm)) return "-";
  const minutes = Math.floor(secPerKm / 60);
  const seconds = Math.round(secPerKm % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")} /km`;
}

function formatKm(value) {
  if (value == null) return "-";
  return `${value.toFixed(1)} km`;
}

function StatCard({ icon, label, value, sub }) {
  return (
    <Paper className="stat-card" sx={{ p: 2.5, height: "100%" }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box className="stat-icon">{icon}</Box>
        <Box>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            {value}
          </Typography>
          {sub && (
            <Typography variant="caption" color="text.secondary">
              {sub}
            </Typography>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}

function ratioLabel(ratio) {
  if (ratio == null) return { text: "Not enough data", color: "default" };
  if (ratio < 0.8) return { text: "Detraining", color: "info" };
  if (ratio <= 1.3) return { text: "Optimal load", color: "success" };
  return { text: "Injury risk — high load spike", color: "error" };
}

const DashboardPage = observer(() => {
  const [summary, setSummary] = useState(null);
  const [trends, setTrends] = useState([]);
  const [records, setRecords] = useState([]);
  const [shoes, setShoes] = useState([]);
  const [trainingLoad, setTrainingLoad] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const [summaryRes, trendsRes, recordsRes, shoesRes, loadRes] =
          await Promise.all([
            analyticsService.getSummary(),
            analyticsService.getTrends(12),
            analyticsService.getRecords(),
            analyticsService.getShoeMileage(),
            analyticsService.getTrainingLoad(8),
          ]);
        if (cancelled) return;
        setSummary(summaryRes?.data ?? null);
        setTrends(trendsRes?.data ?? []);
        setRecords(recordsRes?.data ?? []);
        setShoes(shoesRes?.data ?? []);
        setTrainingLoad(loadRes?.data ?? null);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load dashboard data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    goalCollection.loadGoals();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeGoals = useMemo(
    () => goalCollection.page.items.filter((goal) => !goal.achieved),
    [goalCollection.page.items],
  );

  const ratio = ratioLabel(trainingLoad?.acuteChronicRatio);

  if (loading) {
    return (
      <Box className="page-shell">
        <LinearProgress />
        <Typography color="text.secondary">Loading your dashboard…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="page-shell">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const noActivities = !summary || summary.totalActivities === 0;

  return (
    <Box className="page-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow">Strava-powered running analytics</p>
          <h2>Track every mile and train smarter.</h2>
          <p>
            {noActivities
              ? "No synced activities yet — hit sync on the Activities table to pull your Strava history in."
              : "Real numbers from your synced Strava history, updated every time you sync."}
          </p>
        </div>
        <div className="hero-panel">
          <div className="metric-row">
            <span className="metric-label">Weekly mileage</span>
            <strong>{formatKm(summary?.distanceThisWeekKm)}</strong>
          </div>
          <div className="metric-row">
            <span className="metric-label">Avg pace (30d)</span>
            <strong>{formatPace(summary?.avgPaceSecPerKm)}</strong>
          </div>
          <div className="metric-row">
            <span className="metric-label">Longest run</span>
            <strong>{formatKm(summary?.longestRunKm)}</strong>
          </div>
        </div>
      </section>

      {noActivities ? (
        <Paper className="panel" sx={{ p: 3 }}>
          <Typography color="text.secondary">
            Once activities are synced, this page fills in with real trends,
            personal records, shoe mileage, and training load.
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<DirectionsRun />}
                label="This week"
                value={formatKm(summary.distanceThisWeekKm)}
                sub={`${summary.movingTimeThisWeekMin} min moving`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<Speed />}
                label="Avg pace (30d)"
                value={formatPace(summary.avgPaceSecPerKm)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<Timeline />}
                label="Longest run"
                value={formatKm(summary.longestRunKm)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <StatCard
                icon={<LocalFireDepartment />}
                label="Current streak"
                value={`${summary.currentStreakDays} day${summary.currentStreakDays === 1 ? "" : "s"}`}
              />
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper className="panel" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Weekly distance
                </Typography>
                <BarChart
                  height={260}
                  dataset={trends}
                  xAxis={[{ dataKey: "label", scaleType: "band" }]}
                  series={[{ dataKey: "distanceKm", label: "Distance (km)", color: "var(--accent)" }]}
                  grid={{ horizontal: true }}
                />
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper className="panel" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                  Weekly avg pace
                </Typography>
                <LineChart
                  height={260}
                  dataset={trends}
                  xAxis={[{ dataKey: "label", scaleType: "point" }]}
                  series={[
                    {
                      dataKey: "avgPaceSecPerKm",
                      label: "sec/km (lower is faster)",
                      color: "var(--accent-2)",
                      valueFormatter: (v) => formatPace(v),
                    },
                  ]}
                />
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Paper className="panel" sx={{ p: 3 }}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1 }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Training load
                  </Typography>
                  <Chip label={ratio.text} color={ratio.color} size="small" />
                </Stack>
                <BarChart
                  height={240}
                  dataset={trainingLoad?.weeklyLoad ?? []}
                  xAxis={[{ dataKey: "label", scaleType: "band" }]}
                  series={[{ dataKey: "load", label: "Weekly load", color: "var(--accent)" }]}
                  grid={{ horizontal: true }}
                />
                <Typography variant="caption" color="text.secondary">
                  {trainingLoad?.restDaysLast28 ?? 0} rest days in the last 28 days.
                  Acute:chronic ratio {trainingLoad?.acuteChronicRatio ?? "-"}.
                </Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 5 }}>
              <Paper className="panel" sx={{ p: 3, height: "100%" }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  <EmojiEvents fontSize="small" sx={{ mr: 1, verticalAlign: "middle" }} />
                  Personal records
                </Typography>
                {records.length === 0 ? (
                  <Typography color="text.secondary">
                    Not enough matching runs yet to detect records.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {records.map((record) => (
                      <Stack
                        key={record.label}
                        direction="row"
                        justifyContent="space-between"
                        className="record-row"
                      >
                        <Typography variant="body2" color="text.secondary">
                          {record.label}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {formatPace(record.paceSecPerKm)}
                          {" · "}
                          {formatKm(record.distanceKm)}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className="panel" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Shoe mileage
                </Typography>
                {shoes.length === 0 ? (
                  <Typography color="text.secondary">
                    No shoes synced yet.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {shoes.map((shoe) => (
                      <Box key={shoe.id}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          sx={{ mb: 0.5 }}
                        >
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {shoe.name}
                            {shoe.retired ? " (retired)" : ""}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatKm(shoe.distanceKm)} / {formatKm(shoe.mileageLimitKm)}
                          </Typography>
                        </Stack>
                        <LinearProgress
                          variant="determinate"
                          value={Math.min(shoe.percentUsed, 100)}
                          color={shoe.warning ? "error" : "primary"}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Paper className="panel" sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
                  Active goals
                </Typography>
                {activeGoals.length === 0 ? (
                  <Typography color="text.secondary">
                    No active goals — add one from the Goals table.
                  </Typography>
                ) : (
                  <Stack spacing={2}>
                    {activeGoals.map((goal) => {
                      const pct =
                        goal.targetValue && goal.targetValue > 0
                          ? Math.min(
                              ((goal.currentValue ?? 0) / goal.targetValue) * 100,
                              100,
                            )
                          : 0;
                      return (
                        <Box key={goal.id}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            sx={{ mb: 0.5 }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {goal.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {goal.currentValue ?? 0} / {goal.targetValue ?? "-"}
                            </Typography>
                          </Stack>
                          <LinearProgress variant="determinate" value={pct} />
                        </Box>
                      );
                    })}
                  </Stack>
                )}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
});

export default DashboardPage;
