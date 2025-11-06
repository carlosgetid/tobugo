import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
  throw new Error('Missing required Mercado Pago access token: MERCADOPAGO_ACCESS_TOKEN');
}

// Initialize Mercado Pago SDK
export const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  options: { timeout: 5000 }
});

export const preferenceClient = new Preference(client);
export const paymentClient = new Payment(client);

export interface CreatePreferenceParams {
  title: string;
  description: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  externalReference: string;
  backUrls: {
    success: string;
    failure: string;
    pending: string;
  };
  autoReturn?: 'approved' | 'all';
  notificationUrl?: string;
  payer?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
}

export async function createPaymentPreference(params: CreatePreferenceParams) {
  try {
    const preference = await preferenceClient.create({
      body: {
        items: [
          {
            id: params.externalReference,
            title: params.title,
            description: params.description,
            quantity: params.quantity,
            unit_price: params.unitPrice,
            currency_id: params.currency,
          }
        ],
        back_urls: params.backUrls,
        auto_return: params.autoReturn || 'approved',
        external_reference: params.externalReference,
        notification_url: params.notificationUrl,
        payer: params.payer,
        statement_descriptor: 'TOBUGO',
      }
    });

    return {
      id: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    };
  } catch (error: any) {
    console.error('Mercado Pago preference creation error:', error);
    throw new Error(`Failed to create payment preference: ${error.message}`);
  }
}

export async function getPaymentInfo(paymentId: string) {
  try {
    const payment = await paymentClient.get({ id: paymentId });
    return payment;
  } catch (error: any) {
    console.error('Mercado Pago payment info error:', error);
    throw new Error(`Failed to get payment info: ${error.message}`);
  }
}
