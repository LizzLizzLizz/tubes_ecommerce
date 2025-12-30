import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse } from '@/lib/apiResponse';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { items, shipping_cost, shipping_courier, total_amount: clientTotal, customer_details } = body;

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    // ✅ SECURITY FIX: Server-side price verification
    // Recalculate total from database prices to prevent tampering
    let serverCalculatedTotal = 0;
    const validatedItems: Array<{
      productId: string;
      name: string;
      price: number;
      quantity: number;
      variantId: string | null;
      variantName: string | null;
    }> = [];

    for (const item of items) {
      // Fetch actual price from database
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { id: true, name: true, price: true, stock: true, variants: true }
      });

      if (!product) {
        return errorResponse(`Product ${item.id} not found`, 400);
      }

      // Check if product has variants
      if (product.variants && product.variants.length > 0) {
        // Product has variants - check variant stock
        if (!item.variantId) {
          return errorResponse(`Please select a variant for ${product.name}`, 400);
        }

        const variant = product.variants.find((v: any) => v.id === item.variantId);
        if (!variant) {
          return errorResponse(`Variant not found for ${product.name}`, 400);
        }

        if (variant.stock < item.quantity) {
          return errorResponse(`Insufficient stock for ${product.name} - ${variant.name}`, 400);
        }
      } else {
        // Product has no variants - check product stock
        if (product.stock < item.quantity) {
          return errorResponse(`Insufficient stock for ${product.name}`, 400);
        }
      }

      if (item.quantity <= 0) {
        return errorResponse(`Invalid quantity for ${product.name}`, 400);
      }

      // Use database price, not client price
      const itemTotal = product.price * item.quantity;
      serverCalculatedTotal += itemTotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        price: product.price,  // Use DB price
        quantity: item.quantity,
        variantId: item.variantId || null,
        variantName: item.variantName || null,
      });
    }

    // Add verified shipping cost
    serverCalculatedTotal += shipping_cost;

    // Verify client total matches server calculation
    // Allow 0.01 difference for floating point rounding
    if (Math.abs(serverCalculatedTotal - clientTotal) > 0.01) {
      console.error('Price mismatch detected:', {
        clientTotal,
        serverCalculatedTotal,
        difference: Math.abs(serverCalculatedTotal - clientTotal),
        userEmail: session.user.email,
        items: validatedItems
      });
      return errorResponse(
        'Price verification failed. Please refresh and try again.', 
        400
      );
    }

    // Generate Midtrans order ID first (before creating order)
    const tempOrderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Create order with verified total and reduce stock in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Reduce stock for each item
      for (const item of validatedItems) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (product?.variants && product.variants.length > 0 && item.variantId) {
          // Reduce variant stock
          await tx.variant.update({
            where: { id: item.variantId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        } else {
          // Reduce product stock
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Create the order with Midtrans order ID and expiry time
      const expiryTime = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
      
      return await tx.order.create({
        data: {
          id: tempOrderId,  // ✅ Use Midtrans order ID as primary key
          userId: user.id,
          total: serverCalculatedTotal,  // ✅ Use verified total
          address: customer_details.address,
          status: 'UNPAID',
          expiryTime: expiryTime,  // ✅ Set expiry time for auto-cancel
          items: {
            create: validatedItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,  // ✅ Store DB price
              variantId: item.variantId,
              variantName: item.variantName,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    });

    // Prepare Midtrans transaction payload
    const orderId = order.id;  // ✅ Use the order ID we already set
    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: serverCalculatedTotal,  // ✅ Use verified total
      },
      customer_details: {
        first_name: customer_details.name,
        email: customer_details.email,
        phone: customer_details.phone,
        shipping_address: {
          address: customer_details.address,
          city: customer_details.city || 'Jakarta',
          postal_code: customer_details.postal_code,
          country_code: 'IDN',
        },
      },
      item_details: [
        ...validatedItems.map((item: any) => ({
          id: item.productId,
          price: item.price,  // ✅ Use DB price
          quantity: item.quantity,
          name: item.name,
        })),
        {
          id: 'SHIPPING',
          price: shipping_cost,
          quantity: 1,
          name: `Shipping - ${shipping_courier}`,
        },
      ],
      enabled_payments: ['credit_card', 'bca_va', 'bni_va', 'bri_va', 'permata_va', 'gopay', 'shopeepay'],
    };

    // Call Midtrans Snap API
    const midtransUrl = process.env.MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com/snap/v1/transactions'
      : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const authString = Buffer.from(serverKey + ':').toString('base64');

    const response = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authString}`,
        Accept: 'application/json',
      },
      body: JSON.stringify(midtransPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Midtrans API error:', errorText);
      return errorResponse(
        'Failed to create payment transaction',
        response.status,
        { details: errorText }
      );
    }

    const data = await response.json();

    // No need to update order ID - it's already set correctly

    return successResponse(
      {
        token: data.token,
        redirect_url: data.redirect_url,
        order_id: orderId,
      },
      'Payment created successfully',
      200
    );
  } catch (error) {
    console.error('Payment creation error:', error);
    // Return detailed error in development
    if (process.env.NODE_ENV === 'development') {
      return errorResponse(
        'Failed to create payment', 
        500, 
        { error: error instanceof Error ? error.message : String(error) }
      );
    }
    return errorResponse('Failed to create payment', 500);
  }
}
