import logging

# Configuración básica de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

task_metrics = {}

def update_task_metrics(task: str, elapsed_time: float):
    """
    Updates the global metrics for a specific task.
    Args:
        task (str): The type of task (e.g., "transcribe", "translate").
        elapsed_time (float): The elapsed time for the task in seconds.
    """
    if task not in task_metrics:
        task_metrics[task] = {
            "total_time": 0,
            "count": 0,
            "max_time": float('-inf'),
            "min_time": float('inf'),
        }

    # Update metrics
    task_metrics[task]["total_time"] += elapsed_time
    task_metrics[task]["count"] += 1
    task_metrics[task]["max_time"] = max(task_metrics[task]["max_time"], elapsed_time)
    task_metrics[task]["min_time"] = min(task_metrics[task]["min_time"], elapsed_time)

    # Calculate average time
    avg_time = task_metrics[task]["total_time"] / task_metrics[task]["count"]

    # Log metrics
    logger.info(
        f"Task {task} metrics - Avg: {avg_time:.2f}s, Max: {task_metrics[task]['max_time']:.2f}s, "
        f"Min: {task_metrics[task]['min_time']:.2f}s, Count: {task_metrics[task]['count']}"
    )