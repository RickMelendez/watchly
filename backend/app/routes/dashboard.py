from flask_restx import Namespace, Resource
from app.routes.auth import token_required
from app.models import Website, Metric, Alert
from datetime import datetime, timedelta

dashboard_ns = Namespace('dashboard', description="Dashboard Summary Endpoints")


@dashboard_ns.route('/summary')
class DashboardSummary(Resource):
    @token_required
    def get(self, current_user):
        """Get aggregated dashboard metrics for the authenticated user"""
        websites = Website.query.filter_by(user_id=current_user.id).all()
        website_ids = [w.id for w in websites]

        if not website_ids:
            return {
                "websites_count": 0,
                "avg_response_time": 0,
                "active_alerts": 0,
                "uptime_percentage": 0,
                "response_trend": [],
                "recent_alerts": [],
                "website_statuses": [],
            }, 200

        # Count unresolved alerts
        active_alerts = Alert.query.filter(
            Alert.website_id.in_(website_ids),
            Alert.status == "unresolved"
        ).count()

        # Latest metric per website for KPI cards
        latest_metrics = []
        for wid in website_ids:
            m = Metric.query.filter_by(website_id=wid).order_by(Metric.timestamp.desc()).first()
            if m:
                latest_metrics.append(m)

        avg_response_time = 0.0
        uptime_percentage = 0.0
        if latest_metrics:
            avg_response_time = sum(m.response_time for m in latest_metrics) / len(latest_metrics)
            uptime_percentage = (sum(m.uptime for m in latest_metrics) / len(latest_metrics)) * 100

        # Response time trend: last 24h grouped by hour
        since = datetime.utcnow() - timedelta(hours=24)
        trend_metrics = Metric.query.filter(
            Metric.website_id.in_(website_ids),
            Metric.timestamp >= since
        ).order_by(Metric.timestamp.asc()).all()

        hourly = {}
        for m in trend_metrics:
            key = m.timestamp.strftime("%H:00")
            if key not in hourly:
                hourly[key] = {"total": 0, "count": 0}
            hourly[key]["total"] += m.response_time
            hourly[key]["count"] += 1

        response_trend = [
            {"time": k, "response_time": round(v["total"] / v["count"], 1)}
            for k, v in sorted(hourly.items())
        ]

        # Recent 5 unresolved alerts with website name
        website_map = {w.id: w.name for w in websites}
        recent_alerts_rows = Alert.query.filter(
            Alert.website_id.in_(website_ids),
            Alert.status == "unresolved"
        ).order_by(Alert.timestamp.desc()).limit(5).all()

        recent_alerts = [{
            "id": a.id,
            "website_name": website_map.get(a.website_id, "Unknown"),
            "alert_type": a.alert_type,
            "status": a.status,
            "timestamp": a.timestamp.isoformat(),
        } for a in recent_alerts_rows]

        # Per-website current status
        website_statuses = []
        for w in websites:
            m = Metric.query.filter_by(website_id=w.id).order_by(Metric.timestamp.desc()).first()
            website_statuses.append({
                "id": w.id,
                "name": w.name,
                "url": w.url,
                "status": "up" if (m and m.uptime >= 0.5) else "down",
                "response_time": round(m.response_time, 1) if m else 0,
                "uptime_pct": round(m.uptime * 100, 2) if m else 0,
            })

        return {
            "websites_count": len(websites),
            "avg_response_time": round(avg_response_time, 1),
            "active_alerts": active_alerts,
            "uptime_percentage": round(uptime_percentage, 2),
            "response_trend": response_trend,
            "recent_alerts": recent_alerts,
            "website_statuses": website_statuses,
        }, 200
