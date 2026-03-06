import json
from flask import request
from flask_restx import Namespace, Resource
from app.routes.auth import token_required
from app.models import Pipeline
from app import db

pipelines_ns = Namespace('pipelines', description="Pipeline Management")


@pipelines_ns.route('/')
class PipelineList(Resource):
    @token_required
    def get(self, current_user):
        """List all pipeline runs for the authenticated user (newest first)"""
        pipelines = Pipeline.query.filter_by(user_id=current_user.id).order_by(Pipeline.timestamp.desc()).all()
        return [_serialize(p) for p in pipelines], 200

    @token_required
    def post(self, current_user):
        """Create a new pipeline run record"""
        data = request.get_json() or {}
        if not data.get('run_id'):
            return {"error": "run_id is required"}, 400

        stages = data.get('stages', [])
        pipeline = Pipeline(
            user_id=current_user.id,
            run_id=data['run_id'],
            trigger=data.get('trigger', 'push'),
            commit_message=data.get('commit_message', ''),
            branch=data.get('branch', 'main'),
            commit_hash=data.get('commit_hash', ''),
            author=data.get('author', ''),
            status=data.get('status', 'success'),
            stages=json.dumps(stages),
            duration_seconds=int(data.get('duration_seconds', 0)),
        )
        db.session.add(pipeline)
        db.session.commit()
        return _serialize(pipeline), 201


@pipelines_ns.route('/<int:pipeline_id>')
class PipelineItem(Resource):
    @token_required
    def delete(self, current_user, pipeline_id):
        """Delete a pipeline run record"""
        pipeline = Pipeline.query.filter_by(id=pipeline_id, user_id=current_user.id).first()
        if not pipeline:
            return {"error": "Not found"}, 404
        db.session.delete(pipeline)
        db.session.commit()
        return {"message": "Deleted"}, 200


@pipelines_ns.route('/summary')
class PipelineSummary(Resource):
    @token_required
    def get(self, current_user):
        """Get pipeline counts by status"""
        pipelines = Pipeline.query.filter_by(user_id=current_user.id).all()
        success = sum(1 for p in pipelines if p.status == 'success')
        failed = sum(1 for p in pipelines if p.status == 'failed')
        running = sum(1 for p in pipelines if p.status == 'running')
        cancelled = sum(1 for p in pipelines if p.status == 'cancelled')
        avg_duration = round(sum(p.duration_seconds for p in pipelines) / len(pipelines)) if pipelines else 0
        success_rate = round((success / len(pipelines)) * 100, 1) if pipelines else 0.0
        return {
            "total": len(pipelines),
            "success": success,
            "failed": failed,
            "running": running,
            "cancelled": cancelled,
            "avg_duration_seconds": avg_duration,
            "success_rate": success_rate,
        }, 200


def _serialize(p):
    try:
        stages = json.loads(p.stages) if p.stages else []
    except (json.JSONDecodeError, TypeError):
        stages = []
    return {
        "id": p.id,
        "run_id": p.run_id,
        "trigger": p.trigger,
        "commit_message": p.commit_message,
        "branch": p.branch,
        "commit_hash": p.commit_hash,
        "author": p.author,
        "status": p.status,
        "stages": stages,
        "duration_seconds": p.duration_seconds,
        "timestamp": p.timestamp.isoformat() if p.timestamp else None,
    }
