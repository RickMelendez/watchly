import os
import socket
import threading

from flask_migrate import Migrate

from app import create_app, db
from app.monitor import start_monitoring

# Create the Flask app (CORS is configured inside create_app via flask-cors)
app = create_app()

# Initialize Flask-Migrate
migrate = Migrate(app, db)


def is_main_worker():
    """
    Ensures that background tasks are only started by ONE worker process
    when running multi-worker WSGI servers like Gunicorn.
    """
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.bind(("127.0.0.1", 47200))
        # Save socket reference so it's not garbage collected and stays bound.
        initialize_app._lock_socket = s
        return True
    except socket.error:
        return False


def initialize_app():
    """
    Common setup code that should run once on startup.

    AUTO_CREATE_SCHEMA is intentionally disabled by default in production to
    avoid race conditions across Gunicorn workers with Postgres.
    """
    should_create_schema = os.getenv("AUTO_CREATE_SCHEMA", "0").lower() in ("1", "true", "yes")

    if should_create_schema:
        with app.app_context():
            # Prefer migrations in production; this is opt-in for local bootstrap.
            db.create_all()
    else:
        print("INFO: Skipping db.create_all() (AUTO_CREATE_SCHEMA disabled).")

    if is_main_worker():
        print("Primary worker elected: Starting background monitoring scheduler...")
        monitoring_thread = threading.Thread(target=start_monitoring, args=(app,), daemon=True)
        monitoring_thread.start()


# ---------------------------------------------------------------------
# Only run the built-in Flask server if we run 'python main.py' directly.
# Gunicorn will just import 'app' and call it on its own, ignoring app.run().
# ---------------------------------------------------------------------
if __name__ == "__main__":
    initialize_app()

    port = int(os.environ.get("PORT", 5000))
    # For local development only, run the Flask dev server.
    app.run(host="0.0.0.0", port=port, debug=True)
else:
    # Production path (Gunicorn)
    initialize_app()
    # No app.run() here. Gunicorn will serve 'app' as defined above.
