from collections import defaultdict
from datetime import datetime, timedelta

from flask import request
from flask_restx import Namespace, Resource

from app.routes.auth import token_required
from app.models import OtelSpan

telemetry_ns = Namespace('telemetry', description="OpenTelemetry APM Data")


def _percentile(sorted_vals, p):
    if not sorted_vals:
        return 0.0
    idx = min(int(len(sorted_vals) * p / 100), len(sorted_vals) - 1)
    return round(sorted_vals[idx], 1)


@telemetry_ns.route('/routes')
class RouteStats(Resource):
    @token_required
    def get(self, current_user):
        """p50 / p95 / p99 latency per route for the last 24 hours"""
        since = datetime.utcnow() - timedelta(hours=24)
        spans = OtelSpan.query.filter(
            OtelSpan.start_time >= since,
            OtelSpan.http_method.isnot(None),
        ).all()

        by_route = defaultdict(list)
        for span in spans:
            key = (span.http_method, span.http_route or "unknown")
            by_route[key].append(span)

        result = []
        for (method, route), route_spans in by_route.items():
            times = sorted(s.duration_ms for s in route_spans)
            errors = sum(1 for s in route_spans if s.status_code == "ERROR")
            result.append({
                "route": route,
                "method": method,
                "count": len(times),
                "p50": _percentile(times, 50),
                "p95": _percentile(times, 95),
                "p99": _percentile(times, 99),
                "avg": round(sum(times) / len(times), 1),
                "error_count": errors,
                "error_rate": round(errors / len(times) * 100, 1),
            })

        result.sort(key=lambda x: x["count"], reverse=True)
        return result, 200


@telemetry_ns.route('/traces')
class RecentTraces(Resource):
    @token_required
    def get(self, current_user):
        """Most recent HTTP traces (default 50, max 200)"""
        limit = min(int(request.args.get("limit", 50)), 200)
        traces = (
            OtelSpan.query
            .filter(OtelSpan.http_method.isnot(None))
            .order_by(OtelSpan.start_time.desc())
            .limit(limit)
            .all()
        )
        return [{
            "trace_id": t.trace_id[:16],
            "name": t.name,
            "method": t.http_method,
            "route": t.http_route,
            "http_status": t.http_status_code,
            "duration_ms": t.duration_ms,
            "status": t.status_code,
            "error": t.error_message,
            "timestamp": t.start_time.isoformat() if t.start_time else None,
        } for t in traces], 200
