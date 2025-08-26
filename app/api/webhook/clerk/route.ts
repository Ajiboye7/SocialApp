import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/user.model'; 

export async function POST(req: NextRequest) {
  try {
    // Verify the webhook signature
    const evt = await verifyWebhook(req);

    // Connect to MongoDB
    await connectToDatabase();

    // Handle user.created event
    if (evt.type === 'user.created') {
      const userData = evt.data;

      // Extract relevant fields
      const user = {
        id: userData.id,
        email: userData.email_addresses?.[0]?.email_address || '',
        name: userData.first_name || '',
        //lastName: userData.last_name || '',
        profile_picture: userData.image_url || '',
      };

      // Save or update user in MongoDB
      await User.findOneAndUpdate(
        { id: user.id },
        user,
        { upsert: true, new: true } // Create if not exists, update if exists
      );

      console.log('User data saved:', user);
      return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
    }

    // Handle other events if needed
    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}