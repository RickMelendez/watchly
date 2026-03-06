import logging
from datetime import datetime, timezone

from opentelemetry import trace as otel_trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, SpanExporter, SpanExportResult
from opentelemetry.instrumentation.flask import FlaskInstrumentor

logger = logging.getLogger(__name__)

# URL path prefixes that are too noisy to store (health checks, Swagger UI, static assets)
_SKIP_PREFIXES = ("/healthz", "/status", "/docs", "/swagger", "/static", "/_")


class PostgresSpanExporter(SpanExporter):
    """Exports finished OTel spans to the otel_span PostgreSQL table."""

    def __init__(self, app):
        self._app = app

    def export(self, spans):
        from app import db
        from app.models import OtelSpan

        records = []
        for span in spans:
            attrs = dict(span.attributes or {})
            http_method = attrs.get("http.method")
            http_route = attrs.get("http.route") or attrs.get("http.target") or ""
            http_status = attrs.get("http.status_code")

            # Only store inbound HTTP server spans
            if not http_method:
                continue
            if any(http_route.startswith(p) for p in _SKIP_PREFIXES):
                continue

            start_dt = datetime.fromtimestamp(
                span.start_time / 1e9, tz=timezone.utc
            ).replace(tzinfo=None)
            duration_ms = round((span.end_time - span.start_time) / 1e6, 2)
            status = "ERROR" if span.status.status_code.name == "ERROR" else "OK"

            error_msg = None
            for event in span.events:
                if event.name == "exception":
                    error_msg = str(event.attributes.get("exception.message", ""))[:500]
                    break

            records.append(OtelSpan(
                id=format(span.context.span_id, '016x'),
                trace_id=format(span.context.trace_id, '032x'),
                parent_span_id=format(span.parent.span_id, '016x') if span.parent else None,
                name=span.name,
                start_time=start_dt,
                duration_ms=duration_ms,
                status_code=status,
                http_method=http_method,
                http_route=http_route,
                http_status_code=http_status,
                error_message=error_msg,
            ))

        if not records:
            return SpanExportResult.SUCCESS

        try:
            with self._app.app_context():
                db.session.bulk_save_objects(records)
                db.session.commit()
            return SpanExportResult.SUCCESS
        except Exception as exc:
            logger.warning("OTel span export failed: %s", exc)
            return SpanExportResult.FAILURE

    def shutdown(self):
        pass


def setup_telemetry(app):
    """
    Attach OpenTelemetry HTTP tracing to the Flask app.

    Uses BatchSpanProcessor so spans are exported asynchronously every few
    seconds without blocking request handling. SQLAlchemy is intentionally
    NOT instrumented to avoid recursive span generation when the exporter
    writes to the DB.
    """
    provider = TracerProvider()
    provider.add_span_processor(
        BatchSpanProcessor(PostgresSpanExporter(app))
    )
    otel_trace.set_tracer_provider(provider)

    FlaskInstrumentor().instrument_app(
        app,
        excluded_urls="healthz,/status$,/docs.*,swagger.*,static.*",
    )
    logger.info("OpenTelemetry tracing initialised — HTTP spans → otel_span table")
