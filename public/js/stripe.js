/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51NAFD0FH4NwTSoUGp8tcbJxjwBKtR0qFZ1xGB2HoXRHXa8h29TrS1baVMar6X6ituP8s60UVxv5xJ6NIxleEP7UH00OcJXwJ6F');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
