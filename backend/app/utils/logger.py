import logging
import os

# Ensure logs directory exists
log_dir = "logs"
os.makedirs(log_dir, exist_ok=True)

# Configure logging
log_file = os.path.join(log_dir, "app.log")

flask_debug = os.getenv("FLASK_DEBUG", "0").lower() in ("1", "true", "yes")
default_level = "DEBUG" if flask_debug else "INFO"
log_level_name = os.getenv("LOG_LEVEL", default_level).upper()
log_level = getattr(logging, log_level_name, logging.INFO)

logging.basicConfig(
    level=log_level,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler(log_file),  # Save logs to file
        logging.StreamHandler(),        # Print logs to stdout
    ]
)

# Create a logger instance
logger = logging.getLogger("WatchlyLogger")


if __name__ == "__main__":
    logger.info("Logging system initialized successfully.")
    logger.warning("This is a warning log")
    logger.error("This is an error log.")
    logger.debug("Debugging details go here.")
