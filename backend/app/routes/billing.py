import os
import stripe
from flask import request
from flask_restx import Namespace, Resource

from app.routes.auth import token_required

billing_ns = Namespace("billing", description="Stripe Billing")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000").split(",")[0].strip().rstrip("/")


@billing_ns.route("/create-checkout-session")
class CreateCheckoutSession(Resource):
    @token_required
    def post(self, current_user):
        """Create a Stripe Checkout session for a subscription"""
        if not stripe.api_key:
            return {"error": "Stripe is not configured"}, 503

        data = request.get_json() or {}
        price_id = data.get("price_id", "")

        if not price_id or not price_id.startswith("price_"):
            return {"error": "Invalid price_id"}, 400

        try:
            session = stripe.checkout.Session.create(
                mode="subscription",
                payment_method_types=["card"],
                customer_email=current_user.email,
                line_items=[{"price": price_id, "quantity": 1}],
                success_url=f"{FRONTEND_URL}/#/dashboard/billing?session_id={{CHECKOUT_SESSION_ID}}",
                cancel_url=f"{FRONTEND_URL}/#/pricing",
                metadata={"user_id": str(current_user.id)},
            )
            return {"url": session.url}, 200
        except stripe.error.InvalidRequestError as e:
            return {"error": str(e)}, 400
        except stripe.error.StripeError as e:
            return {"error": "Payment provider error"}, 502


@billing_ns.route("/portal")
class BillingPortal(Resource):
    @token_required
    def post(self, current_user):
        """Create a Stripe Customer Portal session"""
        if not stripe.api_key:
            return {"error": "Stripe is not configured"}, 503

        data = request.get_json() or {}
        customer_id = data.get("customer_id", "")

        if not customer_id:
            return {"error": "customer_id required"}, 400

        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=f"{FRONTEND_URL}/#/dashboard/billing",
            )
            return {"url": session.url}, 200
        except stripe.error.StripeError as e:
            return {"error": "Payment provider error"}, 502
