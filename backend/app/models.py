#Datab# Database Models Schema
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.exc import OperationalError
import time
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from app import db

# Database Session Handler (Ensures Neon Wakes Up)
def get_db():
    """Handles database session with auto-retry for Neon PostgreSQL wake-up."""
    from app import SessionLocal
    for _ in range(3):  # Retry up to 3 times
        try:
            session = SessionLocal()  # ✅ Use `session`, not `db`
            yield session
            break  # Exit loop if successful
        except OperationalError:
            print("🚀 Database is waking up... retrying in 5 seconds...")
            time.sleep(5)  # Wait for Neon to wake up
        finally:
            session.close()  # ✅ Close session properly after use

#User Model
class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable = False)
    email = db.Column(db.String(200), nullable=False, unique=True)
    password_hash = db.Column(db.String(200), nullable=False) #store hash password
    websites = db.relationship('Website', backref='user', cascade="all, delete", passive_deletes=True, lazy=True)
    #set hashed password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password, method="pbkdf2:sha256")
    #check if given password matches stored hash
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

#Website Model
class Website(db.Model):
    __tablename__ = 'website'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False, index=True)
    url = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    frequency = db.Column(db.Integer, default=5)
    metrics = db.relationship('Metric', backref='website', cascade="all, delete", passive_deletes=True)
    alerts = db.relationship('Alert', backref='website', cascade="all, delete", passive_deletes=True)

#Metric Model
class Metric(db.Model):
    id =db.Column(db.Integer, primary_key=True)
    website_id = db.Column(db.Integer, db.ForeignKey('website.id', ondelete="CASCADE"), nullable=False, index=True)
    response_time = db.Column(db.Float, nullable=False)
    uptime = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

#Alert Model
class Alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    website_id = db.Column(db.Integer, db.ForeignKey('website.id', ondelete="CASCADE"), nullable=False, index=True)
    alert_type = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(50), default="unresolved")
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

#Container Model
class Container(db.Model):
    __tablename__ = 'container'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False, index=True)
    name = db.Column(db.String(100), nullable=False)
    image = db.Column(db.String(200), nullable=False)
    status = db.Column(db.String(50), default="running")  # running, stopped, error
    cpu_percent = db.Column(db.Float, default=0.0)
    memory_used = db.Column(db.Integer, default=0)    # MB
    memory_limit = db.Column(db.Integer, default=512)  # MB
    ports = db.Column(db.String(200), default="")
    started_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow)

#Deployment Model
class Deployment(db.Model):
    __tablename__ = 'deployment'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False, index=True)
    service = db.Column(db.String(100), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    commit_hash = db.Column(db.String(40), default="")
    branch = db.Column(db.String(100), default="main")
    environment = db.Column(db.String(50), default="production")  # production, staging, dev
    status = db.Column(db.String(50), default="success")          # success, failed, in_progress
    duration_seconds = db.Column(db.Integer, default=0)
    deployed_by = db.Column(db.String(100), default="")
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

#Log Model
class Log(db.Model):
    __tablename__ = 'log'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False, index=True)
    level = db.Column(db.String(10), nullable=False, default="INFO")   # DEBUG, INFO, WARN, ERROR
    service = db.Column(db.String(100), nullable=False, default="app")
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)

#SecurityFinding Model
class SecurityFinding(db.Model):
    __tablename__ = 'security_finding'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False, index=True)
    severity = db.Column(db.String(20), nullable=False, default="medium")  # critical, high, medium, low
    vulnerability = db.Column(db.String(300), nullable=False)
    resource = db.Column(db.String(200), nullable=False, default="")
    status = db.Column(db.String(50), default="open")   # open, in_progress, resolved
    detected_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

#OtelSpan Model — stores OpenTelemetry HTTP spans captured by the Flask instrumentation
class OtelSpan(db.Model):
    __tablename__ = 'otel_span'

    id               = db.Column(db.String(32),  primary_key=True)          # 16-char hex span_id
    trace_id         = db.Column(db.String(32),  nullable=False, index=True)
    parent_span_id   = db.Column(db.String(32),  nullable=True)
    name             = db.Column(db.String(200), nullable=False)
    start_time       = db.Column(db.DateTime,    nullable=False, index=True)
    duration_ms      = db.Column(db.Float,       nullable=False)
    status_code      = db.Column(db.String(10),  default="OK")    # OK | ERROR
    http_method      = db.Column(db.String(10),  nullable=True)
    http_route       = db.Column(db.String(200), nullable=True, index=True)
    http_status_code = db.Column(db.Integer,     nullable=True)
    error_message    = db.Column(db.Text,        nullable=True)


#Pipeline Model
class Pipeline(db.Model):
    __tablename__ = 'pipeline'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete="CASCADE"), nullable=False, index=True)
    run_id = db.Column(db.String(50), nullable=False)
    trigger = db.Column(db.String(50), default="push")    # push, manual, schedule, pr
    commit_message = db.Column(db.String(200), default="")
    branch = db.Column(db.String(100), default="main")
    commit_hash = db.Column(db.String(40), default="")
    author = db.Column(db.String(100), default="")
    status = db.Column(db.String(50), default="success")  # success, failed, running, cancelled
    stages = db.Column(db.Text, default="[]")             # JSON array of stage objects
    duration_seconds = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
