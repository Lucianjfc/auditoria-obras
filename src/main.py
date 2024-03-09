from apscheduler.schedulers.blocking import BlockingScheduler
from datetime import datetime
from retrying import retry

@retry(wait_fixed=30 * 60 * 1000, stop_max_attempt_number=5)
def crawler1():
    print(f'Crawler 1 executado às {datetime.now()}')

@retry(wait_fixed=30 * 60 * 1000, stop_max_attempt_number=5)
def crawler2():
    print(f'Crawler 2 executado às {datetime.now()}')

scheduler = BlockingScheduler()

scheduler.add_job(crawler1, 'cron', day_of_week='mon-fri', hour=10, minute=34)
scheduler.add_job(crawler2, 'cron', day_of_week='mon-fri', hour=10, minute=34)
