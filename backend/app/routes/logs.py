from flask import request
from flask_restx import Namespace, Resource
from app.routes.auth import token_required
from app.models import Log
from app import db

logs_ns = Namespace('logs', description="Log Management")


@logs_ns.route('/')
class LogList(Resource):
    @token_required
    def get(self, current_user):
        """List logs for the authenticated user (newest first, limit 200)"""
        level = request.args.get('level', '').upper()
        search = request.args.get('search', '').lower()

        query = Log.query.filter_by(user_id=current_user.id)
        if level and level != 'ALL':
            query = query.filter(Log.level == level)

        logs = query.order_by(Log.timestamp.desc()).limit(200).all()

        if search:
            logs = [l for l in logs if search in l.message.lower() or search in l.service.lower()]

        return [_serialize(l) for l in logs], 200

    @token_required
    def post(self, current_user):
        """Create a new log entry"""
        data = request.get_json() or {}
        if not data.get('message'):
            return {"error": "message is required"}, 400

        log = Log(
            user_id=current_user.id,
            level=data.get('level', 'INFO').upper(),
            service=data.get('service', 'app'),
            message=data['message'],
        )
        db.session.add(log)
        db.session.commit()
        return _serialize(log), 201


@logs_ns.route('/<int:log_id>')
class LogItem(Resource):
    @token_required
    def delete(self, current_user, log_id):
        """Delete a log entry"""
        log = Log.query.filter_by(id=log_id, user_id=current_user.id).first()
        if not log:
            return {"error": "Not found"}, 404
        db.session.delete(log)
        db.session.commit()
        return {"message": "Deleted"}, 200


@logs_ns.route('/clear')
class LogClear(Resource):
    @token_required
    def delete(self, current_user):
        """Clear all logs for the user"""
        Log.query.filter_by(user_id=current_user.id).delete()
        db.session.commit()
        return {"message": "Cleared"}, 200


def _serialize(l):
    return {
        "id": l.id,
        "level": l.level,
        "service": l.service,
        "message": l.message,
        "timestamp": l.timestamp.isoformat() if l.timestamp else None,
    }
