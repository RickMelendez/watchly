from flask import request
from flask_restx import Namespace, Resource
from app.routes.auth import token_required
from app.models import SecurityFinding
from app import db

security_ns = Namespace('security', description="Security Findings")


@security_ns.route('/')
class SecurityList(Resource):
    @token_required
    def get(self, current_user):
        """List all security findings for the authenticated user"""
        findings = SecurityFinding.query.filter_by(user_id=current_user.id).order_by(SecurityFinding.detected_at.desc()).all()
        return [_serialize(f) for f in findings], 200

    @token_required
    def post(self, current_user):
        """Create a new security finding"""
        data = request.get_json() or {}
        if not data.get('vulnerability'):
            return {"error": "vulnerability is required"}, 400

        finding = SecurityFinding(
            user_id=current_user.id,
            severity=data.get('severity', 'medium').lower(),
            vulnerability=data['vulnerability'],
            resource=data.get('resource', ''),
            status=data.get('status', 'open'),
        )
        db.session.add(finding)
        db.session.commit()
        return _serialize(finding), 201


@security_ns.route('/<int:finding_id>')
class SecurityItem(Resource):
    @token_required
    def patch(self, current_user, finding_id):
        """Update finding status"""
        finding = SecurityFinding.query.filter_by(id=finding_id, user_id=current_user.id).first()
        if not finding:
            return {"error": "Not found"}, 404

        data = request.get_json() or {}
        for field in ('severity', 'vulnerability', 'resource', 'status'):
            if field in data:
                setattr(finding, field, data[field])
        db.session.commit()
        return _serialize(finding), 200

    @token_required
    def delete(self, current_user, finding_id):
        """Delete a security finding"""
        finding = SecurityFinding.query.filter_by(id=finding_id, user_id=current_user.id).first()
        if not finding:
            return {"error": "Not found"}, 404
        db.session.delete(finding)
        db.session.commit()
        return {"message": "Deleted"}, 200


@security_ns.route('/summary')
class SecuritySummary(Resource):
    @token_required
    def get(self, current_user):
        """Get security finding counts by severity and status"""
        findings = SecurityFinding.query.filter_by(user_id=current_user.id).all()
        open_findings = [f for f in findings if f.status != 'resolved']

        counts = {"critical": 0, "high": 0, "medium": 0, "low": 0}
        for f in open_findings:
            if f.severity in counts:
                counts[f.severity] += 1

        total = len(findings)
        resolved = sum(1 for f in findings if f.status == 'resolved')
        score = 100
        score -= counts["critical"] * 20
        score -= counts["high"] * 10
        score -= counts["medium"] * 3
        score -= counts["low"] * 1
        score = max(0, score)

        return {
            "total": total,
            "open": len(open_findings),
            "resolved": resolved,
            "critical": counts["critical"],
            "high": counts["high"],
            "medium": counts["medium"],
            "low": counts["low"],
            "score": score,
        }, 200


def _serialize(f):
    return {
        "id": f.id,
        "severity": f.severity,
        "vulnerability": f.vulnerability,
        "resource": f.resource,
        "status": f.status,
        "detected_at": f.detected_at.isoformat() if f.detected_at else None,
    }
