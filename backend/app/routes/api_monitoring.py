from flask_restx import Namespace, Resource
from app.routes.auth import token_required
from app.models import Website, Metric
from datetime import datetime, timedelta

api_monitoring_ns = Namespace('api-monitoring', description="API Monitoring")


def _percentile(sorted_values, p):
    if not sorted_values:
        return 0.0
    idx = int(len(sorted_values) * p / 100)
    idx = min(idx, len(sorted_values) - 1)
    return sorted_values[idx]


@api_monitoring_ns.route('/summary')
class ApiMonitoringSummary(Resource):
    @token_required
    def get(self, current_user):
        """Derive API monitoring stats from website metrics (last 30 days)"""
        websites = Website.query.filter_by(user_id=current_user.id).all()
        if not websites:
            return {
                "total_endpoints": 0,
                "avg_latency": 0,
                "error_rate": 0.0,
                "uptime_30d": 0.0,
                "latency_distribution": [],
                "endpoints": [],
            }, 200

        since_30d = datetime.utcnow() - timedelta(days=30)
        website_map = {w.id: w for w in websites}
        website_ids = list(website_map.keys())

        all_metrics = Metric.query.filter(
            Metric.website_id.in_(website_ids),
            Metric.timestamp >= since_30d,
        ).all()

        # Group metrics by website
        by_site = {wid: [] for wid in website_ids}
        for m in all_metrics:
            by_site[m.website_id].append(m)

        endpoints = []
        all_response_times = []

        for wid, metrics in by_site.items():
            w = website_map[wid]
            response_times = sorted([m.response_time for m in metrics if m.response_time > 0])
            all_response_times.extend(response_times)

            if response_times:
                p50 = round(_percentile(response_times, 50), 1)
                p95 = round(_percentile(response_times, 95), 1)
                p99 = round(_percentile(response_times, 99), 1)
            else:
                p50 = p95 = p99 = 0.0

            total = len(metrics)
            errors = sum(1 for m in metrics if m.uptime == 0)
            error_rate = round((errors / total) * 100, 2) if total else 0.0
            uptime_pct = round(((total - errors) / total) * 100, 2) if total else 0.0

            # Estimate checks/hour from check count and time window
            checks_per_hour = round(total / (30 * 24), 1) if total else 0.0

            status = "healthy" if uptime_pct >= 99 else ("degraded" if uptime_pct >= 95 else "down")

            endpoints.append({
                "id": wid,
                "name": w.name,
                "url": w.url,
                "status": status,
                "checks_per_hour": checks_per_hour,
                "p50": p50,
                "p95": p95,
                "p99": p99,
                "error_rate": error_rate,
                "uptime_pct": uptime_pct,
                "total_checks": total,
            })

        # Sort: degraded/down first
        status_order = {"down": 0, "degraded": 1, "healthy": 2}
        endpoints.sort(key=lambda e: status_order.get(e["status"], 3))

        # Overall stats
        avg_latency = round(sum(all_response_times) / len(all_response_times), 1) if all_response_times else 0.0
        total_checks = len(all_metrics)
        total_errors = sum(1 for m in all_metrics if m.uptime == 0)
        overall_error_rate = round((total_errors / total_checks) * 100, 2) if total_checks else 0.0
        overall_uptime = round(100 - overall_error_rate, 2)

        # Latency distribution buckets
        rt_all = sorted([m.response_time for m in all_metrics if m.response_time > 0])
        buckets = [
            ("< 50ms",    lambda v: v < 50),
            ("50-200ms",  lambda v: 50 <= v < 200),
            ("200-500ms", lambda v: 200 <= v < 500),
            ("500ms-1s",  lambda v: 500 <= v < 1000),
            ("> 1s",      lambda v: v >= 1000),
        ]
        latency_distribution = []
        total_rt = len(rt_all) or 1
        for label, fn in buckets:
            count = sum(1 for v in rt_all if fn(v))
            latency_distribution.append({
                "label": label,
                "count": count,
                "pct": round((count / total_rt) * 100, 1),
            })

        return {
            "total_endpoints": len(websites),
            "avg_latency": avg_latency,
            "error_rate": overall_error_rate,
            "uptime_30d": overall_uptime,
            "latency_distribution": latency_distribution,
            "endpoints": endpoints,
        }, 200
