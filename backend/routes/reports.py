from flask import Blueprint
from controllers.reports_controller import (
    get_report_summary
)

reports_bp = Blueprint(
    "reports",
    __name__
)

@reports_bp.route(
    "/summary",
    methods=["GET"]
)
def summary_route():

    return get_report_summary()