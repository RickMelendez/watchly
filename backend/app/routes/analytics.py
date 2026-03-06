from flask_restx import Namespace, Resource
from app.routes.auth import token_required
from app.models import Website, Metric, Alert
from datetime import datetime, timedelta
from collections import defaultdict

analytics_ns = Namespace('analytics', description="Analytics Endpoints")


@analytics_ns.route('/summary')
class AnalyticsSummary(Resource):
    @token_required
    def get(self, current_user):
        """Get aggregated analytics for the authenticated user (last 30 days)"""
        websites = Website.query.filter_by(user_id=current_user.id).all()
        website_ids = [w.id for w in websites]

        if not website_ids:
            return {
                "total_checks": 0,
                "avg_response_time": 0,
                "uptime_percentage": 0,
                "total_alerts": 0,
                "response_trend": [],
                "website_performance": [],
            }, 200

        # All-time total checks
        total_checks = Metric.query.filter(
            Metric.website_id.in_(website_ids)
        ).count()

        # All-time total alerts
        total_alerts = Alert.query.filter(
            Alert.website_id.in_(website_ids)
        ).count()

        # Last 30 days metrics
        since_30d = datetime.utcnow() - timedelta(days=30)
        recent_metrics = Metric.query.filter(
            Metric.website_id.in_(website_ids),
            Metric.timestamp >= since_30d
        ).all()

        avg_response_time = 0.0
        uptime_percentage = 0.0
        if recent_metrics:
            avg_response_time = sum(m.response_time for m in recent_metrics) / len(recent_metrics)
            uptime_percentage = (sum(m.uptime for m in recent_metrics) / len(recent_metrics)) * 100

        # Response time trend: last 30 days grouped by day
        daily = defaultdict(lambda: {"total": 0.0, "count": 0})
        for m in recent_metrics:
            key = m.timestamp.strftime("%b %d")
            daily[key]["total"] += m.response_time
            daily[key]["count"] += 1

        response_trend = []
        for i in range(29, -1, -1):
            day = datetime.utcnow() - timedelta(days=i)
            key = day.strftime("%b %d")
            if key in daily and daily[key]["count"] > 0:
                avg = daily[key]["total"] / daily[key]["count"]
                response_trend.append({"day": key, "response_time": round(avg, 1)})
            else:
                response_trend.append({"day": key, "response_time": None})

        # Per-website performance (last 30 days)
        website_map = {w.id: w for w in websites}
        website_performance = []
        for wid in website_ids:
            site_metrics = [m for m in recent_metrics if m.website_id == wid]
            if site_metrics:
                avg_rt = sum(m.response_time for m in site_metrics) / len(site_metrics)
                uptime_pct = (sum(m.uptime for m in site_metrics) / len(site_metrics)) * 100
            else:
                avg_rt = 0.0
                uptime_pct = 0.0

            site_alerts = Alert.query.filter(
                Alert.website_id == wid,
                Alert.timestamp >= since_30d
            ).count()

            w = website_map[wid]
            website_performance.append({
                "id": wid,
                "name": w.name,
                "url": w.url,
                "avg_response_time": round(avg_rt, 1),
                "uptime_percentage": round(uptime_pct, 2),
                "checks": len(site_metrics),
                "alerts_30d": site_alerts,
            })

        # Sort by uptime descending (best performing first)
        website_performance.sort(key=lambda x: x["uptime_percentage"], reverse=True)

        return {
            "total_checks": total_checks,
            "avg_response_time": round(avg_response_time, 1),
            "uptime_percentage": round(uptime_percentage, 2),
            "total_alerts": total_alerts,
            "response_trend": response_trend,
            "website_performance": website_performance,
        }, 200
