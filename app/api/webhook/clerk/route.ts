import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import User from '@/lib/models/user.model'; 

export async function POST(req: NextRequest) {
  try {
    // Verify the webhook signature
    const evt = await verifyWebhook(req);

    await connectToDatabase();

    if (evt.type === 'user.created') {
      const userData = evt.data;


      const user = {
        id: userData.id,
        email: userData.email_addresses?.[0]?.email_address || '',
        name: userData.first_name || userData.last_name || 'Unknown', 
        username: userData.username || `user_${userData.id.slice(-8)}`,
        profile_picture: userData.image_url || '',
      };

      await User.findOneAndUpdate(
        { id: user.id },
        user,
        { upsert: true, new: true }
      );

      console.log('User data saved:', user);
      return NextResponse.json({ message: 'Webhook processed' }, { status: 200 });
    }

    return NextResponse.json({ message: 'Webhook received' }, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 400 });
  }
}