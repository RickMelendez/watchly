from flask import request
from flask_restx import Namespace, Resource
from app.routes.auth import token_required
from app.models import Container
from app import db
from datetime import datetime

containers_ns = Namespace('containers', description="Container Management")


@containers_ns.route('/')
class ContainerList(Resource):
    @token_required
    def get(self, current_user):
        """List all containers for the authenticated user"""
        containers = Container.query.filter_by(user_id=current_user.id).order_by(Container.started_at.desc()).all()
        return [_serialize(c) for c in containers], 200

    @token_required
    def post(self, current_user):
        """Create a new container record"""
        data = request.get_json() or {}
        if not data.get('name') or not data.get('image'):
            return {"error": "name and image are required"}, 400

        container = Container(
            user_id=current_user.id,
            name=data['name'],
            image=data['image'],
            status=data.get('status', 'running'),
            cpu_percent=float(data.get('cpu_percent', 0.0)),
            memory_used=int(data.get('memory_used', 0)),
            memory_limit=int(data.get('memory_limit', 512)),
            ports=data.get('ports', ''),
        )
        db.session.add(container)
        db.session.commit()
        return _serialize(container), 201


@containers_ns.route('/<int:container_id>')
class ContainerItem(Resource):
    @token_required
    def patch(self, current_user, container_id):
        """Update container status / stats"""
        container = Container.query.filter_by(id=container_id, user_id=current_user.id).first()
        if not container:
            return {"error": "Not found"}, 404

        data = request.get_json() or {}
        for field in ('name', 'image', 'status', 'ports'):
            if field in data:
                setattr(container, field, data[field])
        for field in ('cpu_percent',):
            if field in data:
                setattr(container, field, float(data[field]))
        for field in ('memory_used', 'memory_limit'):
            if field in data:
                setattr(container, field, int(data[field]))
        container.updated_at = datetime.utcnow()
        db.session.commit()
        return _serialize(container), 200

    @token_required
    def delete(self, current_user, container_id):
        """Delete a container record"""
        container = Container.query.filter_by(id=container_id, user_id=current_user.id).first()
        if not container:
            return {"error": "Not found"}, 404
        db.session.delete(container)
        db.session.commit()
        return {"message": "Deleted"}, 200


@containers_ns.route('/summary')
class ContainerSummary(Resource):
    @token_required
    def get(self, current_user):
        """Get container counts by status"""
        containers = Container.query.filter_by(user_id=current_user.id).all()
        running = sum(1 for c in containers if c.status == 'running')
        stopped = sum(1 for c in containers if c.status == 'stopped')
        error = sum(1 for c in containers if c.status == 'error')
        avg_cpu = round(sum(c.cpu_percent for c in containers) / len(containers), 1) if containers else 0.0
        return {
            "total": len(containers),
            "running": running,
            "stopped": stopped,
            "error": error,
            "avg_cpu": avg_cpu,
        }, 200


def _serialize(c):
    return {
        "id": c.id,
        "name": c.name,
        "image": c.image,
        "status": c.status,
        "cpu_percent": c.cpu_percent,
        "memory_used": c.memory_used,
        "memory_limit": c.memory_limit,
        "ports": c.ports,
        "started_at": c.started_at.isoformat() if c.started_at else None,
        "updated_at": c.updated_at.isoformat() if c.updated_at else None,
    }
