from flask import request
from flask_restx import Namespace, Resource
from app.routes.auth import token_required
from app.models import Deployment
from app import db

deployments_ns = Namespace('deployments', description="Deployment Management")


@deployments_ns.route('/')
class DeploymentList(Resource):
    @token_required
    def get(self, current_user):
        """List all deployments for the authenticated user (newest first)"""
        deployments = Deployment.query.filter_by(user_id=current_user.id).order_by(Deployment.timestamp.desc()).all()
        return [_serialize(d) for d in deployments], 200

    @token_required
    def post(self, current_user):
        """Create a new deployment record"""
        data = request.get_json() or {}
        if not data.get('service') or not data.get('version'):
            return {"error": "service and version are required"}, 400

        deployment = Deployment(
            user_id=current_user.id,
            service=data['service'],
            version=data['version'],
            commit_hash=data.get('commit_hash', ''),
            branch=data.get('branch', 'main'),
            environment=data.get('environment', 'production'),
            status=data.get('status', 'success'),
            duration_seconds=int(data.get('duration_seconds', 0)),
            deployed_by=data.get('deployed_by', ''),
        )
        db.session.add(deployment)
        db.session.commit()
        return _serialize(deployment), 201


@deployments_ns.route('/<int:deployment_id>')
class DeploymentItem(Resource):
    @token_required
    def delete(self, current_user, deployment_id):
        """Delete a deployment record"""
        deployment = Deployment.query.filter_by(id=deployment_id, user_id=current_user.id).first()
        if not deployment:
            return {"error": "Not found"}, 404
        db.session.delete(deployment)
        db.session.commit()
        return {"message": "Deleted"}, 200


@deployments_ns.route('/summary')
class DeploymentSummary(Resource):
    @token_required
    def get(self, current_user):
        """Get deployment counts by status"""
        deployments = Deployment.query.filter_by(user_id=current_user.id).all()
        success = sum(1 for d in deployments if d.status == 'success')
        failed = sum(1 for d in deployments if d.status == 'failed')
        in_progress = sum(1 for d in deployments if d.status == 'in_progress')
        avg_duration = round(sum(d.duration_seconds for d in deployments) / len(deployments)) if deployments else 0
        return {
            "total": len(deployments),
            "success": success,
            "failed": failed,
            "in_progress": in_progress,
            "avg_duration_seconds": avg_duration,
        }, 200


def _serialize(d):
    return {
        "id": d.id,
        "service": d.service,
        "version": d.version,
        "commit_hash": d.commit_hash,
        "branch": d.branch,
        "environment": d.environment,
        "status": d.status,
        "duration_seconds": d.duration_seconds,
        "deployed_by": d.deployed_by,
        "timestamp": d.timestamp.isoformat() if d.timestamp else None,
    }
